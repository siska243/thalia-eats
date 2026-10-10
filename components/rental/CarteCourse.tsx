"use client";

import React from "react";
import Link from "next/link";
import {FaCalendarDays, FaLocationDot} from "react-icons/fa6";

import {creneauLisible, dureeFacturee} from "@/helpers/rental";
import {formatPrix} from "@/helpers/openingHours";
import useExpiration from "@/hooks/useExpiration";
import {RentalBookingType} from "@/types/rental";
import CompteARebours from "@/components/commons/CompteARebours";
import PastilleStatut from "@/components/rental/PastilleStatut";
import PhotoVehicule from "@/components/rental/PhotoVehicule";

/**
 * Une réservation dans la liste « Mes courses ».
 *
 * Décalque de `booking-card.tsx` du mobile : la vignette du véhicule vient en
 * premier, comme au catalogue, parce qu'on reconnaît sa course à la voiture
 * avant de lire sa référence.
 *
 * La durée se lit dans l'unité facturée : « 2 jours », et non « 48 h ». C'est
 * `dureeFacturee` qui le sait, le même appel que sur le détail, pour que la
 * liste et la fiche ne puissent pas annoncer deux durées différentes pour la
 * même réservation.
 *
 * Le délai à côté du statut, et pas à sa place : l'état dit où en est la
 * course, le délai dit ce qu'on peut encore perdre. Il ne s'affiche que si le
 * serveur envoie une échéance, et seulement tant que l'acompte est attendu.
 */
export default function CarteCourse({booking}: {booking: RentalBookingType}) {
    const attentePaiement = booking.status === "pending_payment";
    const {minutes, ton} = useExpiration(attentePaiement ? booking.expires_at : null);

    const devise = booking.currency?.code;

    return (
        <Link
            href={`/location/courses/${encodeURIComponent(booking.uid)}`}
            className="flex flex-col gap-3 rounded-card bg-surface p-4 shadow-card transition-shadow duration-150 hover:shadow-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 sm:p-5"
        >
            <div className="flex items-center gap-3.5">
                <span className="relative h-[72px] w-[92px] shrink-0 overflow-hidden rounded-control bg-surface-sunken">
                    <PhotoVehicule src={booking.vehicle?.image} alt="" />
                </span>

                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                        <span className="line-clamp-1 text-body font-bold text-ink">
                            {booking.vehicle?.name ?? "Véhicule"}
                        </span>

                        <PastilleStatut status={booking.status} />
                    </div>

                    <span className="flex items-center gap-1.5 text-caption text-ink-muted">
                        <FaCalendarDays className="shrink-0" aria-hidden />
                        <span className="line-clamp-1">
                            {creneauLisible(booking.starts_at, booking.ends_at)}
                        </span>
                    </span>

                    <span className="flex items-center gap-1.5 text-caption text-ink-muted">
                        <FaLocationDot className="shrink-0" aria-hidden />
                        <span className="line-clamp-1">{booking.pickup_location}</span>
                    </span>
                </div>
            </div>

            {attentePaiement && ton ? (
                <CompteARebours minutes={minutes} ton={ton} compact sujet="reservation" />
            ) : null}

            <div className="flex items-center justify-between gap-3 border-t border-surface-border pt-3">
                <span className="line-clamp-1 text-caption text-ink-muted">
                    {booking.reference} ·{" "}
                    {dureeFacturee(
                        booking.pricing_mode ?? "hourly",
                        booking.billed_units,
                        booking.duration_hours,
                    )}
                </span>
                <span className="text-body font-bold text-ink">
                    {formatPrix(booking.total, devise)}
                </span>
            </div>
        </Link>
    );
}
