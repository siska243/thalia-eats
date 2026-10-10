"use client";

import React, {useMemo, useState} from "react";
import Link from "next/link";

import {separerCourses} from "@/helpers/rental";
import {useNomsCommerciaux, useRentalBookings} from "@/hooks/useRental";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import EmptyState from "@/components/ui/EmptyState";
import Bascule from "@/components/rental/Bascule";
import CarteCourse from "@/components/rental/CarteCourse";

type Onglet = "a-payer" | "en-cours" | "terminees";

/**
 * Mes courses.
 *
 * Le mobile a deux écrans : « Mes courses » à deux onglets et « Historique » à
 * part. Le web a déjà tranché cette question pour les repas — `/tracking` et
 * `/historique` ont été fondus en une page à onglets — et pour la même raison :
 * une course passe d'un groupe à l'autre toute seule, et changer de page pour
 * la suivre n'avance personne. Les trois groupes sont donc ici, séparés par
 * `separerCourses`, qui est la règle du mobile mot pour mot.
 *
 * Les courses terminées restent consultables : c'est la seule trace qu'un
 * remboursement est dû.
 */
export default function PageCourses() {
    const {user} = useGetCurrentUser();
    const noms = useNomsCommerciaux();

    const [onglet, setOnglet] = useState<Onglet>("a-payer");

    const {data, isLoading, error, refetch} = useRentalBookings(!!user);

    // Le partage se fait sur la liste déjà reçue : trois requêtes pour trois
    // tiers du même jeu de données seraient trois fois le trafic pour rien.
    const {aPayer, enCours, terminees} = useMemo(() => separerCourses(data ?? []), [data]);

    const listes: Record<Onglet, typeof aPayer> = {
        "a-payer": aPayer,
        "en-cours": enCours,
        terminees,
    };

    const courses = listes[onglet];

    if (!user) {
        return (
            <div className="min-h-svh bg-surface-sunken pt-[calc(var(--header-h)+24px)]">
                <EmptyState
                    title="Connectez-vous pour voir vos courses"
                    message="Vos réservations sont rattachées à votre compte."
                    action={
                        <Link
                            href="/login?retour=%2Flocation%2Fcourses"
                            className="inline-flex min-h-11 items-center rounded-pill bg-brand-500 px-7 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600"
                        >
                            Se connecter
                        </Link>
                    }
                />
            </div>
        );
    }

    return (
        <div className="min-h-svh bg-surface-sunken pt-[calc(var(--header-h)+24px)]">
            <div className="mx-auto max-w-[1100px] px-4 pb-16 sm:px-5">
                <header className="mb-5">
                    <p className="text-caption text-ink-muted">
                        Voitures avec chauffeur · {noms.rental}
                    </p>
                    <h1 className="text-display font-extrabold text-secondaryColor">Mes courses</h1>
                </header>

                <Bascule
                    className="mb-6 sm:max-w-xl"
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
        </div>
    );
}
