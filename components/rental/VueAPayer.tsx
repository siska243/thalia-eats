import React from "react";
import {FaCalendarDays, FaLocationDot} from "react-icons/fa6";

import {TonExpiration} from "@/helpers/expiration";
import {creneauHoraire, dureeFacturee, formatDateStringFr, lignesDuPrix} from "@/helpers/rental";
import {formatPrix} from "@/helpers/openingHours";
import {RentalBookingType} from "@/types/rental";
import CompteARebours from "@/components/commons/CompteARebours";
import PhotoVehicule from "@/components/rental/PhotoVehicule";

interface Props {
    booking: RentalBookingType;
    /** Les minutes restantes et le ton, battus par `useExpiration`. */
    minutes: number | null;
    ton: TonExpiration | null;
    ecoule: boolean;
}

/**
 * Une réservation qui attend son acompte.
 *
 * C'est le plus pauvre des états : ni plaque, ni chauffeur, ni carte, ni code
 * de départ — rien de tout cela n'existe tant que rien n'est payé. Composée
 * comme les autres, elle ressemblait à une page à trous.
 *
 * Elle n'a pourtant pas le même sujet : ce n'est pas un reçu, c'est une
 * décision à prendre maintenant, avant que ça expire. La page se construit
 * donc autour de trois choses, dans cet ordre — le temps qui reste, ce qu'on
 * est sur le point de retenir, et la somme qu'on demande de sortir.
 *
 * Aucun montant n'est calculé ici : total, acompte et solde viennent du
 * serveur et ne font que passer.
 */
export default function VueAPayer({booking, minutes, ton, ecoule}: Props) {
    const devise = booking.currency?.code;
    const {accent, secondaires} = lignesDuPrix(booking, "deposit");

    return (
        <div className="flex flex-col gap-4">
            {/* Le délai d'abord : c'est ce qui décide si le reste a encore un
                sens. Il porte sa propre carte, pleine largeur. */}
            <div className="overflow-hidden rounded-card shadow-card">
                <CompteARebours minutes={minutes} ton={ton} sujet="reservation" />
            </div>

            {/* Ce que le client est sur le point de retenir. Grande photo : à
                ce moment-là il choisit encore, il ne consulte pas. */}
            <section className="overflow-hidden rounded-card bg-surface shadow-card">
                <div className="relative h-44 w-full sm:h-60">
                    <PhotoVehicule src={booking.vehicle?.image} alt="" />
                </div>

                <div className="flex flex-col gap-2.5 p-4">
                    <h2 className="text-title font-bold text-ink">
                        {booking.vehicle?.name ?? "Votre véhicule"}
                    </h2>

                    <p className="flex items-start gap-2">
                        <FaCalendarDays className="mt-1 shrink-0 text-ink-muted" aria-hidden />
                        <span>
                            <span className="block text-body font-semibold text-ink">
                                {formatDateStringFr(booking.starts_at)}
                            </span>
                            <span className="block text-caption text-ink-muted">
                                {creneauHoraire(booking.starts_at, booking.ends_at)} ·{" "}
                                {dureeFacturee(
                                    booking.pricing_mode ?? "hourly",
                                    booking.billed_units,
                                    booking.duration_hours,
                                )}
                            </span>
                        </span>
                    </p>

                    <p className="flex items-start gap-2 text-body text-ink">
                        <FaLocationDot className="mt-1 shrink-0 text-ink-muted" aria-hidden />
                        {booking.pickup_location}
                    </p>
                </div>
            </section>

            {/*
             * La somme qu'on demande de sortir, en grand, et seule sur sa
             * ligne. Le total et le solde restent lisibles en dessous : ce sont
             * des informations, pas des sommes à régler maintenant. Les mettre
             * au même poids faisait chercher laquelle payer.
             */}
            <section className="flex flex-col gap-3 rounded-card bg-surface p-4 shadow-card">
                <div>
                    <p className="text-body text-ink-muted">{accent.libelle}</p>
                    <p className="text-display font-bold text-brand-700">
                        {formatPrix(accent.montant, devise) || "—"}
                    </p>
                </div>

                <dl className="flex flex-col gap-1.5 border-t border-surface-border pt-3">
                    {secondaires.map((ligne) => (
                        <div key={ligne.cle} className="flex justify-between gap-3">
                            <dt className="text-caption text-ink-muted">{ligne.libelle}</dt>
                            <dd className="text-caption font-semibold text-ink">
                                {formatPrix(ligne.montant, devise) || "—"}
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>

            {/* Ce que l'acompte achète, en deux phrases. Une liste de puces
                aurait rallongé la page sans rien apprendre de plus. */}
            <p className="rounded-card bg-brand-50 p-4 text-body text-brand-700">
                {ecoule
                    ? "Personne ne retient plus ce véhicule sur ce créneau. Choisissez-en un autre, ou refaites la même réservation si la voiture est encore libre."
                    : "L’acompte retient la voiture et le chauffeur sur ce créneau : personne d’autre ne peut le réserver. Le solde se règle en espèces au chauffeur, à la fin de la course."}
            </p>
        </div>
    );
}
