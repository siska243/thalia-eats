import React from "react";
import {FaRegClock, FaWallet} from "react-icons/fa6";

import {formatPrix} from "@/helpers/openingHours";
import {minimumLisible} from "@/helpers/rental";

interface Props {
    /** La durée minimale imposée, en heures. Zéro : aucune. */
    minimumHeures: number;
    /** Le pourcentage réellement prélevé à la réservation. */
    acompte?: number;
    /** L'acompte en monnaie, quand le total est connu. */
    montantAcompte?: number | null;
    devise?: string;
}

/**
 * Les modalités de la location, dites avant de réserver.
 *
 * Décalque de `components/rental/modalites-location.tsx` du mobile. Le
 * propriétaire : « la location par jour c'est combien et le minimum c'est
 * combien de jours — on doit avoir toutes ces informations là, et ça doit
 * être au complet ». Elles existaient toutes dans les réglages ; aucune
 * n'était montrée au client.
 *
 * Rien ne s'affiche quand rien n'est imposé : une ligne « aucun minimum »
 * occuperait la place pour ne rien dire.
 */
export default function ModalitesLocation({
    minimumHeures,
    acompte,
    montantAcompte,
    devise,
}: Props) {
    const minimum = minimumLisible(minimumHeures);

    if (!minimum && !acompte) return null;

    return (
        <div className="flex flex-col gap-2 rounded-control bg-surface-sunken px-3 py-2.5">
            {minimum ? (
                <p className="flex items-center gap-2 text-caption text-ink-muted">
                    <FaRegClock aria-hidden /> {minimum}
                </p>
            ) : null}

            {acompte ? (
                <p className="flex items-center gap-2 text-caption text-ink-muted">
                    <FaWallet aria-hidden />
                    {montantAcompte
                        ? `${acompte} % à la réservation, soit ${formatPrix(montantAcompte, devise)}. Les ${100 - acompte} % restants à la fin de la course, au chauffeur.`
                        : `${acompte} % à la réservation, les ${100 - acompte} % restants à la fin de la course, au chauffeur.`}
                </p>
            ) : null}
        </div>
    );
}
