"use client";

import ImagePlat from "@/components/ui/ImagePlat";
import {enTexte} from "@/helpers/reponseApi";
import fondParDefaut from "@/public/assets/images/foodsImg.png";
import Loader from "../Loader/Loader";
import {etatOuverture, libelleFermeture} from "@/helpers/openingHours";

/**
 * L'en-tete d'une fiche restaurant.
 *
 * Trois defauts corriges ici :
 *
 * 1. Quand `restaurant` etait absent, le composant rendait
 *    `` sans l'avoir importe : ReferenceError, page
 *    blanche. Le repli est desormais un vrai etat neutre.
 * 2. `restaurant?.opens[0]` lisait l'indice 0 sans proteger `opens` lui-meme :
 *    un restaurant sans horaires faisait planter la page. Les horaires passent
 *    maintenant par `etatOuverture`, la meme fonction que celle du mobile, et
 *    un restaurant ferme affiche son heure de reouverture plutot qu'un
 *    « Fermé » suivi d'une plage horaire brute.
 * 3. Le bandeau affichait « Commande minimum : 5 $ » et « Livraison : 20-30
 *    minutes », deux valeurs ecrites en dur qu'aucune donnee ne garantit.
 *    Remplacees par ce que l'API sait reellement : adresse et telephone.
 */
export default function BannerResto({restaurant, restaurantIsLoading}) {
    if (restaurantIsLoading) {
        return <Loader />;
    }

    const horaire = etatOuverture(restaurant?.opens);

    return (
        <section className="mx-auto max-w-[1300px] px-4 pt-6 sm:px-5">
            <div className="relative overflow-hidden rounded-card">
                <ImagePlat
                    src={restaurant?.image}
                    repli={fondParDefaut}
                    alt=""
                    aria-hidden
                    fill
                    priority
                    sizes="(max-width: 1300px) 100vw, 1300px"
                    className="object-cover object-center"
                />

                <div
                    className="absolute inset-0 bg-gradient-to-r from-secondaryColor via-secondaryColor/90 to-secondaryColor/40"
                    aria-hidden
                />

                <div className="relative px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
                    <span
                        className={`inline-flex rounded-pill px-3 py-1 text-caption font-bold ${
                            horaire.ouvert
                                ? "bg-success-surface text-success"
                                : "bg-white/90 text-ink-muted"
                        }`}
                    >
                        {horaire.ouvert
                            ? `Ouvert${horaire.creneau ? ` · ${horaire.creneau}` : ""}`
                            : libelleFermeture(horaire)}
                    </span>

                    <h1 className="mt-4 max-w-2xl text-[28px] font-extrabold leading-tight tracking-tight text-white sm:text-[38px] lg:text-[46px]">
                        {restaurant?.name ?? "Restaurant"}
                    </h1>

                    <dl className="mt-5 flex flex-col gap-2 text-body text-white/80 sm:flex-row sm:flex-wrap sm:gap-x-8">
                        {restaurant?.adresse ? (
                            <div className="flex gap-2">
                                <dt className="sr-only">Adresse</dt>
                                <dd>{restaurant.adresse}</dd>
                            </div>
                        ) : null}

                        {restaurant?.phone ? (
                            <div className="flex gap-2">
                                <dt className="sr-only">Téléphone</dt>
                                <dd>
                                    <a
                                        href={`tel:${restaurant.phone}`}
                                        className="underline-offset-4 hover:underline"
                                    >
                                        {restaurant.phone}
                                    </a>
                                </dd>
                            </div>
                        ) : null}
                    </dl>

                    {enTexte(restaurant?.description) ? (
                        <p className="mt-4 max-w-xl text-body leading-7 text-white/70">
                            {enTexte(restaurant.description)}
                        </p>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
