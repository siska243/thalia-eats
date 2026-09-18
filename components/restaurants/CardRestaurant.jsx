"use client";

import ImagePlat from "@/components/ui/ImagePlat";
import Link from "next/link";
import {etatOuverture, libelleFermeture} from "@/helpers/openingHours";

/**
 * Une carte restaurant.
 *
 * L'ancienne posait le nom en blanc sur la photo, via un degrade. Quand la
 * photo etait claire — et les photos de plats le sont — le nom devenait
 * illisible. Le texte est donc sorti de l'image et pose sur du blanc.
 *
 * Elle annonce aussi l'etat d'ouverture. Sans lui, tous les restaurants se
 * ressemblent et l'on decouvre la fermeture au moment de commander.
 */
export default function CardRestaurant({restaurant}) {
    const horaire = etatOuverture(restaurant?.opens);

    return (
        <Link
            href={`/restaurant/${restaurant.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-card bg-surface shadow-card transition-shadow duration-200 hover:shadow-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-sunken">
                <ImagePlat
                    src={restaurant?.image}
                    alt={restaurant?.name ?? ""}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={`object-cover transition-transform duration-200 motion-safe:group-hover:scale-105 ${
                        horaire.ouvert ? "" : "opacity-40"
                    }`}
                />

                <span
                    className={`absolute left-3 top-3 rounded-pill px-2.5 py-1 text-caption font-bold ${
                        horaire.ouvert
                            ? "bg-success-surface text-success"
                            : "bg-white/90 text-ink-muted"
                    }`}
                >
                    {horaire.ouvert ? "Ouvert" : "Fermé"}
                </span>
            </div>

            <div className="flex flex-1 flex-col p-4">
                <p className="line-clamp-1 text-body font-semibold text-secondaryColor">
                    {restaurant?.name}
                </p>

                {restaurant?.adresse ? (
                    <p className="mt-0.5 line-clamp-2 text-caption text-ink-muted">
                        {restaurant.adresse}
                    </p>
                ) : null}

                {/*
                  * Un restaurant ferme reste consultable — on peut vouloir
                  * regarder la carte avant l'ouverture — mais on lui dit quand
                  * revenir. « Fermé » seul est une porte close sans indication ;
                  * « Ouvre à 9h » est un rendez-vous.
                  */}
                <p
                    className={`mt-auto pt-3 text-caption ${
                        horaire.ouvert ? "text-ink-subtle" : "font-semibold text-brand-700"
                    }`}
                >
                    {horaire.ouvert ? horaire.creneau : libelleFermeture(horaire)}
                </p>
            </div>
        </Link>
    );
}
