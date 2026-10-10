import React from "react";
import {FaCalendarCheck, FaCar, FaCircleCheck, FaCreditCard} from "react-icons/fa6";

import {RentalBookingStatus} from "@/types/rental";
import {compositionDeLaCourse, ETAPES_COURSE} from "@/components/rental/statutCourse";

const ICONES = [FaCalendarCheck, FaCreditCard, FaCar, FaCircleCheck];

/**
 * Où en est la course, de la réservation à la descente.
 *
 * Quatre pastilles reliées, l'étape courante marquée. C'est ce qui manquait le
 * plus au détail d'une course : on y lisait un état, jamais un chemin. Un
 * client qui vient de payer veut savoir ce qui vient après, pas seulement
 * comment ça s'appelle aujourd'hui.
 *
 * Le rang de l'étape vient de `compositionDeLaCourse`, avec tout le reste de
 * ce qui se déduit d'un statut. Rien ne s'affiche sur une course annulée,
 * expirée ou dont le créneau a été perdu : elles se sont arrêtées en route, et
 * leur dessiner un parcours de quatre étapes serait mentir.
 */
export default function ProgressionCourse({status}: {status?: RentalBookingStatus | null}) {
    const {etapesFranchies} = compositionDeLaCourse(status);

    if (etapesFranchies === null) return null;

    return (
        <ol className="flex">
            {ETAPES_COURSE.map((libelle, rang) => {
                const Icone = ICONES[rang];
                const atteinte = rang < etapesFranchies;
                const courante = rang === etapesFranchies - 1;

                return (
                    <li key={libelle} className="flex flex-1 flex-col items-center">
                        {/* Les demi-segments se dessinent de part et d'autre de
                            la pastille : la ligne reste continue quelle que
                            soit la largeur de la colonne, sans position
                            absolue à calculer. */}
                        <span className="flex h-9 w-full items-center">
                            <span
                                className={`h-0.5 flex-1 ${
                                    rang === 0
                                        ? "bg-transparent"
                                        : atteinte
                                          ? "bg-brand-500"
                                          : "bg-surface-border"
                                }`}
                            />

                            <span
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-pill ${
                                    atteinte
                                        ? "bg-brand-500 text-ink-inverse"
                                        : "bg-surface-sunken text-ink-subtle"
                                }`}
                            >
                                <Icone aria-hidden />
                            </span>

                            <span
                                className={`h-0.5 flex-1 ${
                                    rang === ETAPES_COURSE.length - 1
                                        ? "bg-transparent"
                                        : rang + 1 < etapesFranchies
                                          ? "bg-brand-500"
                                          : "bg-surface-border"
                                }`}
                            />
                        </span>

                        <span
                            className={`mt-1.5 text-center text-caption ${
                                courante ? "font-bold text-ink" : "text-ink-subtle"
                            }`}
                        >
                            {libelle}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}
