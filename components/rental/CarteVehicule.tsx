import React from "react";
import Link from "next/link";
import {FaCalendarDays, FaLock, FaUsers} from "react-icons/fa6";

import {formatPrix} from "@/helpers/openingHours";
import {RentalVehicleType} from "@/types/rental";
import PhotoVehicule from "@/components/rental/PhotoVehicule";

/**
 * Une carte du catalogue, une par ligne.
 *
 * Décalque de `vehicle-card.tsx` du mobile : la vignette carrée à deux
 * colonnes montrait plus de voitures par écran, mais rien d'autre que leur
 * nom, alors que le nombre de places et le tarif journalier sont ce qui décide
 * d'un choix.
 *
 * Un véhicule en course reste consultable, exactement comme un restaurant
 * fermé : on peut vouloir regarder la voiture avant de choisir ses dates. Il
 * est signalé sans ambiguïté — photo éteinte, cadenas, pastille — plutôt que
 * retiré de la liste, ce qui laisserait croire qu'il n'existe pas.
 *
 * Le prix affiché est le tarif horaire : sans créneau, aucun total n'a de
 * sens. Le montant à payer apparaît sur la fiche, une fois les heures
 * choisies, et c'est le serveur qui le calcule.
 */
export default function CarteVehicule({vehicle}: {vehicle: RentalVehicleType}) {
    const libre = vehicle.available !== false;
    const devise = vehicle.currency?.code;

    const journalier = vehicle.daily_rate
        ? `${formatPrix(vehicle.daily_rate, devise)} / jour`
        : "À l'heure";

    return (
        <Link
            href={`/location/vehicule/${encodeURIComponent(vehicle.slug)}`}
            className="flex items-center gap-3.5 rounded-card bg-surface p-3 shadow-card transition-shadow duration-150 hover:shadow-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 sm:p-4"
        >
            <span className="relative h-[84px] w-[104px] shrink-0 overflow-hidden rounded-control bg-surface-sunken sm:h-[104px] sm:w-[140px]">
                <PhotoVehicule src={vehicle.image} alt="" />

                {!libre ? (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-ink-inverse">
                        <FaLock aria-hidden />
                    </span>
                ) : null}
            </span>

            <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="flex items-center gap-2">
                    <span
                        className={`line-clamp-1 text-body font-bold sm:text-title ${
                            libre ? "text-ink" : "text-ink-muted"
                        }`}
                    >
                        {vehicle.name}
                    </span>

                    {/*
                     * La pastille s'affiche DANS LES DEUX ÉTATS. Marquée
                     * seulement quand le véhicule est pris, elle laissait
                     * déduire « libre » d'une absence : le client ne lisait
                     * rien et devait supposer.
                     */}
                    <span
                        className={`shrink-0 rounded-pill px-2 py-0.5 text-caption font-bold ${
                            libre
                                ? "bg-success-surface text-success"
                                : "bg-surface-sunken text-ink-muted"
                        }`}
                    >
                        {libre ? "Libre" : "En course"}
                    </span>
                </span>

                {vehicle.description ? (
                    <span className="line-clamp-1 text-caption text-ink-subtle">
                        {vehicle.description}
                    </span>
                ) : null}

                <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-ink-muted">
                    {vehicle.seats ? (
                        <span className="flex items-center gap-1">
                            <FaUsers aria-hidden /> {vehicle.seats} places
                        </span>
                    ) : null}

                    <span className="flex items-center gap-1">
                        <FaCalendarDays aria-hidden /> {journalier}
                    </span>
                </span>

                <span
                    className={`text-body font-bold ${libre ? "text-brand-700" : "text-ink-subtle"}`}
                >
                    {formatPrix(vehicle.hourly_rate, devise)}
                    <span className="text-caption font-normal text-ink-muted"> / heure</span>
                </span>
            </span>
        </Link>
    );
}
