"use client";

import React, {useMemo} from "react";
import Link from "next/link";

import {separerCourses} from "@/helpers/rental";
import {useRentalBookings} from "@/hooks/useRental";
import EmptyState from "@/components/ui/EmptyState";
import CarteCourse from "@/components/rental/CarteCourse";

interface Props {
    /** L'etat que l'ecran regarde, choisi par l'onglet de la page. */
    etat: "en-cours" | "terminees";
}

/**
 * Les courses de location, dans la section Thalia Trans de « Commandes ».
 *
 * Elle ne porte PAS ses propres onglets : l'etat est choisi une fois pour
 * l'ecran entier, et les deux univers le suivent. Deux jeux d'onglets sur la
 * meme page demanderaient au client de les accorder a la main pour comparer
 * ses commandes et ses courses, ce qui est exactement ce qu'on cherche a lui
 * eviter.
 *
 * « A payer » est rangee avec « en cours » : une reservation dont l'acompte
 * n'est pas regle n'est pas finie, et c'est meme celle qui demande une action.
 *
 * Les groupes viennent de `separerCourses`, la regle du mobile mot pour mot.
 */
export default function ListeCourses({etat}: Props) {
    const {data, isLoading, error, refetch} = useRentalBookings(true);

    const {aPayer, enCours, terminees} = useMemo(() => separerCourses(data ?? []), [data]);

    const courses = etat === "en-cours" ? enCours : terminees;

    /*
     * Les reservations en attente d'acompte sortent de la liste.
     *
     * Elles y etaient melees aux courses confirmees et ne se distinguaient
     * pas. Le proprietaire : « la location en attente de paiement on le voit
     * ou ». Or c'est la seule qui EXPIRE : personne ne retient le vehicule
     * tant que l'acompte n'est pas regle, et le serveur relache le creneau a
     * l'echeance. Elle passe donc devant, dans un cadre qui le dit, avec son
     * compte a rebours.
     */
    const aRegler = etat === "en-cours" ? aPayer : [];

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                {Array.from({length: 2}).map((_, rang) => (
                    <div key={rang} className="h-40 animate-pulse rounded-card bg-surface" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <EmptyState
                title="Chargement impossible"
                message={(error as Error).message}
                action={
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="inline-flex min-h-11 items-center rounded-pill bg-brand-500 px-7 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600"
                    >
                        Réessayer
                    </button>
                }
            />
        );
    }

    const rienDuTout = !courses.length && !aRegler.length;

    if (rienDuTout) {
        return etat === "en-cours" ? (
            <EmptyState
                title="Aucune course en cours"
                message="Réservez une voiture avec chauffeur, à l'heure ou à la journée."
                action={
                    <Link
                        href="/location"
                        className="inline-flex min-h-11 items-center rounded-pill bg-brand-500 px-7 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600"
                    >
                        Voir les véhicules
                    </Link>
                }
            />
        ) : (
            <EmptyState
                title="Aucune course terminée"
                message="Vos courses passées apparaîtront ici."
            />
        );
    }

    return (
        <div className="flex flex-col gap-5">
            {aRegler.length ? (
                <div className="rounded-card border border-warning bg-warning-surface p-3 sm:p-4">
                    <p className="text-body font-bold text-ink">
                        {aRegler.length > 1
                            ? `${aRegler.length} réservations attendent leur acompte`
                            : "Une réservation attend son acompte"}
                    </p>
                    <p className="mt-1 text-caption text-ink-muted">
                        Tant qu&apos;il n&apos;est pas réglé, le véhicule n&apos;est retenu pour
                        personne et le créneau repart à la vente à la fin du délai.
                    </p>

                    <ul className="mt-3 flex flex-col gap-3">
                        {aRegler.map((booking) => (
                            <li key={booking.uid}>
                                <CarteCourse booking={booking} />
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}

            {courses.length ? (
                <ul className="flex flex-col gap-4">
                    {courses.map((booking) => (
                        <li key={booking.uid}>
                            <CarteCourse booking={booking} />
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
}
