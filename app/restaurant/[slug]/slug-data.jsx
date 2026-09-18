"use client";

import {Suspense, useMemo, useState} from "react";
import BannerResto from "@/components/commons/BannerResto";
import BeforeFooterContent from "@/components/commons/BeforeFooterContent";
import CardPlat from "@/components/ui/CardPlat";
import EmptyState from "@/components/ui/EmptyState";
import useReferentialData from "@/hooks/useQueryTanStack";
import {Route} from "@/helpers/Route";

/**
 * La carte d'un restaurant.
 *
 * Un bug de fond est corrige ici. L'ancienne version filtrait les plats ainsi :
 *
 *     const findSubCategoryAndProductsByCategory = (slug) => {
 *         ...
 *         products.filter(i => i.restaurant?.slug == slug)
 *
 * Le parametre `slug` est le slug de la *categorie* ; il masquait la propriete
 * `slug` du composant, qui est celui du *restaurant*. La comparaison opposait
 * donc un slug de restaurant a un slug de categorie : toujours faux. La section
 * « Toutes les offres » etait vide sur toutes les fiches, depuis toujours.
 *
 * Le second etage du meme bug etait dans SectionOffers, qui rendait
 * `products[0]?.map(...)` sur un tableau deja aplati : l'element 0 est un plat,
 * pas une liste. Le composant ne se plaignait pas parce qu'il ne recevait
 * jamais rien.
 *
 * La page ne garde donc plus qu'une seule liste, groupee par sous-categorie,
 * plus un rayon promotions quand il y en a. Afficher deux fois les memes plats
 * — une fois en vrac, une fois groupes — n'apportait rien.
 */
export default function SlugData({slug, restaurant}) {
    const {data: categories, isLoading} = useReferentialData({
        url: Route.categorie_restaurant(slug),
        queryKey: "query-categorie-restaurant",
    });

    /*
     * Seul le choix explicite du visiteur est un etat. La categorie affichee
     * par defaut, elle, se deduit des donnees : la recopier dans un effet
     * faisait rendre la page une premiere fois sans categorie, puis une
     * seconde fois avec.
     */
    const [categorieChoisie, setCategorieChoisie] = useState(null);
    const categorieActive = categorieChoisie ?? categories?.data?.[0]?.slug ?? null;

    /** Les sous-categories de la categorie affichee, plats du restaurant seuls. */
    const rayons = useMemo(() => {
        const categorie = categories?.data?.find((c) => c.slug === categorieActive);

        return (categorie?.sub_category_product ?? [])
            .map((sous) => ({
                ...sous,
                product: (sous.product ?? []).filter(
                    (p) => p.restaurant?.slug === slug
                ),
            }))
            .filter((sous) => sous.product.length > 0);
    }, [categories, categorieActive, slug]);

    const promotions = useMemo(
        () =>
            rayons
                .flatMap((r) => r.product)
                .filter((p) => p.is_promotional && p.promotionnalPrice),
        [rayons]
    );

    return (
        <div className="bg-surface pt-[var(--header-h)]">
            <Suspense>
                <BannerResto restaurant={restaurant?.data} />
            </Suspense>

            {isLoading ? (
                <div className="mx-auto max-w-[1300px] px-4 py-10 sm:px-5">
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({length: 6}).map((_, i) => (
                            <div
                                key={i}
                                className="h-72 animate-pulse rounded-card bg-surface-sunken"
                            />
                        ))}
                    </div>
                </div>
            ) : categories?.data?.length ? (
                <>
                    {/*
                      * La rangee de categories reste collee sous l'en-tete quand on
                      * descend dans une longue carte : sans ca, il faut remonter tout
                      * en haut pour changer de categorie.
                      */}
                    <div className="sticky top-[var(--header-h)] z-40 border-b border-surface-border bg-surface/95 backdrop-blur">
                        <div className="no-scrollbar mx-auto flex max-w-[1300px] gap-2 overflow-x-auto px-4 py-3 sm:px-5">
                            {categories.data.map((categorie) => (
                                <button
                                    key={categorie.slug}
                                    type="button"
                                    onClick={() => setCategorieChoisie(categorie.slug)}
                                    aria-pressed={categorieActive === categorie.slug}
                                    className={`shrink-0 rounded-pill px-5 py-2 text-body font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
                                        categorieActive === categorie.slug
                                            ? "bg-secondaryColor text-white"
                                            : "bg-surface-sunken text-ink-muted hover:text-ink"
                                    }`}
                                >
                                    {categorie.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mx-auto max-w-[1300px] px-4 py-8 sm:px-5 md:py-12">
                        {promotions.length ? (
                            <section className="mb-12">
                                <h2 className="mb-5 text-display font-bold text-secondaryColor">
                                    En promotion
                                </h2>
                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    {promotions.map((product) => (
                                        <CardPlat key={product.uid} product={product} />
                                    ))}
                                </div>
                            </section>
                        ) : null}

                        {rayons.length ? (
                            <div className="flex flex-col gap-12">
                                {rayons.map((rayon) => (
                                    <section key={rayon.uid ?? rayon.slug}>
                                        <h2 className="mb-5 text-display font-bold text-secondaryColor">
                                            {rayon.title}
                                        </h2>
                                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                            {rayon.product.map((product) => (
                                                <CardPlat key={product.uid} product={product} />
                                            ))}
                                        </div>
                                    </section>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                title="Rien dans cette catégorie"
                                message="Choisissez une autre catégorie pour voir les plats disponibles."
                            />
                        )}
                    </div>
                </>
            ) : (
                <EmptyState
                    title="La carte n'est pas encore en ligne"
                    message={`${restaurant?.data?.name ?? "Ce restaurant"} n'a pas encore publié ses plats.`}
                />
            )}

            <Suspense>
                <BeforeFooterContent restaurant={restaurant ?? []} />
            </Suspense>
        </div>
    );
}
