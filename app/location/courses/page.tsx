"use client";

import React, {useMemo, useState} from "react";
import Link from "next/link";

import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import {useNomsCommerciaux, useRentalBookings} from "@/hooks/useRental";
import {separerCourses} from "@/helpers/rental";
import EmptyState from "@/components/ui/EmptyState";
import CarteCourse from "@/components/rental/CarteCourse";

type Onglet = "en-cours" | "terminees";

/**
 * Mes courses, chez Thalia Trans.
 *
 * **Le meme ecran que les commandes de repas, seul le contenu change.** Le
 * proprietaire : « thalia trans doit garder le meme design que thalia eat
 * commande historique, c'est juste le contenu qui change, sinon le user se
 * perd ». Meme en-tete, memes onglets avec leurs compteurs, meme largeur,
 * meme etat vide : un client qui passe d'un metier a l'autre ne doit pas
 * avoir a reapprendre ou cliquer.
 *
 * Les deux univers ont bien DEUX pages : ils avaient ete fondus en une, et
 * « ça fait desordre ». Le menu mene a l'une ou a l'autre.
 *
 * Les reservations qui attendent leur acompte sont mises en avant, ce sont
 * les seules qui expirent : personne ne retient le vehicule tant que
 * l'acompte n'est pas regle.
 */
export default function PageCourses() {
    const {user} = useGetCurrentUser();
    const noms = useNomsCommerciaux();

    const [onglet, setOnglet] = useState<Onglet>("en-cours");

    const {data, isLoading, error, refetch} = useRentalBookings(!!user);

    const {aPayer, enCours, terminees} = useMemo(() => separerCourses(data ?? []), [data]);

    // « A payer » compte avec « en cours » : une reservation dont l'acompte
    // n'est pas regle n'est pas finie, et c'est elle qui demande une action.
    const courantes = [...aPayer, ...enCours];
    const courses = onglet === "en-cours" ? courantes : terminees;

    if (!user) {
        return (
            <div className="min-h-svh bg-surface-sunken pt-[var(--header-h)]">
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

    const onglets = [
        {cle: "en-cours" as Onglet, libelle: "En cours", nombre: courantes.length},
        {cle: "terminees" as Onglet, libelle: "Terminées", nombre: terminees.length},
    ];

    return (
        <div className="min-h-svh bg-surface-sunken pt-[var(--header-h)]">
            <div className="mx-auto max-w-[1400px] px-4 pb-16 pt-6 sm:px-5">
                <header className="mb-5">
                    <p className="text-caption text-ink-muted">{noms.rental}</p>
                    <h1 className="text-display font-extrabold text-secondaryColor">
                        Mes courses
                    </h1>
                </header>

                <div
                    role="tablist"
                    className="mb-6 flex rounded-control bg-surface-sunken p-1 ring-1 ring-surface-border sm:max-w-md"
                >
                    {onglets.map((item) => {
                        const actif = onglet === item.cle;

                        return (
                            <button
                                key={item.cle}
                                type="button"
                                role="tab"
                                aria-selected={actif}
                                onClick={() => setOnglet(item.cle)}
                                className={`flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-control text-body font-bold transition-colors duration-150 ${
                                    actif
                                        ? "bg-surface text-ink shadow-card"
                                        : "text-ink-muted hover:text-ink"
                                }`}
                            >
                                {item.libelle}

                                {item.nombre ? (
                                    <span className="min-w-5 rounded-pill bg-brand-500 px-1.5 text-caption font-bold text-ink-inverse">
                                        {item.nombre}
                                    </span>
                                ) : null}
                            </button>
                        );
                    })}
                </div>

                {/* Les reservations a regler, en tete et dans un cadre qui dit
                    pourquoi : ce sont les seules qui expirent. */}
                {onglet === "en-cours" && aPayer.length ? (
                    <div className="mb-6 rounded-card border border-warning bg-warning-surface p-3 sm:p-4">
                        <p className="text-body font-bold text-ink">
                            {aPayer.length > 1
                                ? `${aPayer.length} réservations attendent leur acompte`
                                : "Une réservation attend son acompte"}
                        </p>
                        <p className="mt-1 text-caption text-ink-muted">
                            Tant qu&apos;il n&apos;est pas réglé, le véhicule n&apos;est retenu
                            pour personne et le créneau repart à la vente à la fin du délai.
                        </p>

                        <ul className="mt-3 flex flex-col gap-3">
                            {aPayer.map((booking) => (
                                <li key={booking.uid}>
                                    <CarteCourse booking={booking} />
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}

                <div className="flex flex-col gap-4">
                    {isLoading && !courses.length ? (
                        Array.from({length: 3}).map((_, rang) => (
                            <div key={rang} className="h-40 animate-pulse rounded-card bg-surface" />
                        ))
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
                        courses
                            .filter((booking) => onglet === "terminees" || !aPayer.includes(booking))
                            .map((booking) => <CarteCourse key={booking.uid} booking={booking} />)
                    ) : onglet === "en-cours" ? (
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
                    )}
                </div>
            </div>
        </div>
    );
}
