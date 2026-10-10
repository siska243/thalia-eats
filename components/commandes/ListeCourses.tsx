"use client";

import React, {useMemo, useState} from "react";
import Link from "next/link";

import {separerCourses} from "@/helpers/rental";
import {useRentalBookings} from "@/hooks/useRental";
import EmptyState from "@/components/ui/EmptyState";
import Bascule from "@/components/rental/Bascule";
import CarteCourse from "@/components/rental/CarteCourse";

type Onglet = "a-payer" | "en-cours" | "terminees";

/**
 * La liste des courses de location, avec ses trois groupes.
 *
 * Extraite de `/location/courses` pour que la page « Commandes » puisse la
 * montrer sans la reecrire. Le proprietaire : « dans commande on doit avoir
 * pour thalia eat et thalia trans ». Un second exemplaire aurait diverge au
 * premier ajustement, c'est le motif qui a deja produit deux bugs ici.
 *
 * Les trois groupes viennent de `separerCourses`, la regle du mobile mot pour
 * mot : une course passe d'un groupe a l'autre toute seule, et changer de page
 * pour la suivre n'avance personne.
 */
export default function ListeCourses() {
    const [onglet, setOnglet] = useState<Onglet>("a-payer");

    const {data, isLoading, error, refetch} = useRentalBookings(true);

    // Le partage se fait sur la liste deja recue : trois requetes pour trois
    // tiers du meme jeu de donnees seraient trois fois le trafic pour rien.
    const {aPayer, enCours, terminees} = useMemo(() => separerCourses(data ?? []), [data]);

    const listes: Record<Onglet, typeof aPayer> = {
        "a-payer": aPayer,
        "en-cours": enCours,
        terminees,
    };

    const courses = listes[onglet];

    return (
        <div className="flex flex-col gap-6">
            <Bascule
                className="sm:max-w-xl"
                etiquette="Mes courses"
                onglets={[
                    {cle: "a-payer", libelle: "À payer", nombre: aPayer.length},
                    {cle: "en-cours", libelle: "En cours", nombre: enCours.length},
                    {cle: "terminees", libelle: "Terminées", nombre: terminees.length},
                ]}
                choisi={onglet}
                onChoisir={setOnglet}
            />

            {isLoading ? (
                <div className="flex flex-col gap-4">
                    {Array.from({length: 3}).map((_, rang) => (
                        <div key={rang} className="h-40 animate-pulse rounded-card bg-surface" />
                    ))}
                </div>
            ) : error ? (
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
            ) : courses.length ? (
                <ul className="flex flex-col gap-4">
                    {courses.map((booking) => (
                        <li key={booking.uid}>
                            <CarteCourse booking={booking} />
                        </li>
                    ))}
                </ul>
            ) : onglet === "a-payer" ? (
                <EmptyState
                    title="Rien à payer"
                    message="Vos réservations en attente d'acompte apparaîtront ici."
                    action={
                        <Link
                            href="/location"
                            className="inline-flex min-h-11 items-center rounded-pill bg-brand-500 px-7 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600"
                        >
                            Voir les véhicules
                        </Link>
                    }
                />
            ) : onglet === "en-cours" ? (
                <EmptyState
                    title="Aucune course en cours"
                    message="Réservez une voiture avec chauffeur à l'heure."
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
            )}
        </div>
    );
}
