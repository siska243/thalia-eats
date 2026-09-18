"use client";

import {useRef} from "react";
import Image from "next/image";
import Link from "next/link";
import {Navigation} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";

import Section from "@/components/ui/Section";

/**
 * Les categories, en carrousel.
 *
 * Deux sections les affichaient — SectionDeals et SectionResto — avec des
 * mises en forme differentes et un contenu remelange a chaque rendu. Une seule
 * suffit : c'est une aide a la navigation, pas une vitrine.
 *
 * Swiper, comme le reste du site, et non un debordement avec barre de
 * defilement : sur un site vitrine une barre grise en travers d'une rangee de
 * photos se voit comme un defaut.
 */
export default function SectionCategories({categories = []}) {
    const precedent = useRef(null);
    const suivant = useRef(null);

    const sousCategories = categories
        .flatMap((categorie) => categorie.sub_category_product ?? [])
        .filter((sous) => sous.picture && (sous.product ?? []).length > 0);

    if (!sousCategories.length) return null;

    return (
        <Section
            title="Par envie"
            subtitle="Ce que les restaurants proposent en ce moment"
            action={
                <div className="hidden gap-2 sm:flex">
                    <button
                        ref={precedent}
                        type="button"
                        aria-label="Catégories précédentes"
                        className="flex h-10 w-10 items-center justify-center rounded-pill border border-surface-border bg-surface text-ink transition-colors hover:bg-surface-sunken disabled:opacity-40"
                    >
                        <FaArrowLeft aria-hidden />
                    </button>
                    <button
                        ref={suivant}
                        type="button"
                        aria-label="Catégories suivantes"
                        className="flex h-10 w-10 items-center justify-center rounded-pill border border-surface-border bg-surface text-ink transition-colors hover:bg-surface-sunken disabled:opacity-40"
                    >
                        <FaArrowRight aria-hidden />
                    </button>
                </div>
            }
        >
            <Swiper
                modules={[Navigation]}
                spaceBetween={16}
                slidesPerView={2.2}
                breakpoints={{
                    640: {slidesPerView: 4.2},
                    1024: {slidesPerView: 6.5},
                }}
                /*
                 * Les boutons vivent hors du Swiper : on les lui rattache avant
                 * l'initialisation, sinon il ne les voit jamais.
                 *
                 * `onBeforeInit` s'execute apres le montage, donc les refs sont
                 * remplies a ce moment. Les lire aussi dans `navigation={...}`,
                 * comme le veut la recette repandue, revient a les lire pendant
                 * le rendu : au premier passage elles valent `null`, et React 19
                 * signale l'acces. Le rattachement ne se fait donc qu'ici.
                 */
                onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = precedent.current;
                    swiper.params.navigation.nextEl = suivant.current;
                }}
                navigation
            >
                {sousCategories.map((sous) => {
                    const slug = sous.product?.[0]?.restaurant?.slug;

                    return (
                        <SwiperSlide key={sous.uid ?? sous.slug}>
                            <Link
                                href={slug ? `/restaurant/${slug}` : "/restaurant"}
                                className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                            >
                                <div className="relative aspect-square w-full overflow-hidden rounded-card shadow-card">
                                    <Image
                                        src={sous.picture}
                                        alt={sous.title}
                                        fill
                                        sizes="(max-width: 640px) 45vw, 160px"
                                        className="object-cover transition-transform duration-200 motion-safe:group-hover:scale-105"
                                    />
                                </div>
                                <p className="mt-2 line-clamp-2 text-center text-caption font-semibold text-secondaryColor">
                                    {sous.title}
                                </p>
                            </Link>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </Section>
    );
}
