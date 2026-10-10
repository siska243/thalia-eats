"use client";

import React from "react";
import Link from "next/link";
import {FaCar, FaChevronRight} from "react-icons/fa6";

import {useNomsCommerciaux} from "@/hooks/useRental";

/**
 * L'entrée vers la location, sur l'accueil.
 *
 * Une seule carte, pas une section : c'est une ligne de produit voisine, pas
 * une catégorie de plats. Elle dit ce qu'on y trouve et ce que ça coûte de
 * s'engager — un acompte, pas la course entière.
 *
 * Le nom du service vient de la configuration : l'écrire en dur rendrait le
 * réglage du back-office sans effet visible.
 */
export default function EntreeLocation() {
    const noms = useNomsCommerciaux();

    return (
        <section className="mx-auto max-w-[1400px] px-4 py-6 sm:px-5">
            <Link
                href="/location"
                className="flex items-center gap-3 rounded-card bg-surface p-4 shadow-card transition-shadow duration-150 hover:shadow-raised sm:p-5"
            >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-pill bg-brand-50 text-brand-600">
                    <FaCar size={22} aria-hidden />
                </span>

                <span className="min-w-0 flex-1">
                    <span className="block text-body font-bold text-ink sm:text-title">
                        {noms.rental} · louer une voiture avec chauffeur
                    </span>
                    <span className="block text-caption text-ink-muted">
                        À l’heure ou à la journée · un acompte à la réservation, le solde au
                        chauffeur
                    </span>
                </span>

                <FaChevronRight className="shrink-0 text-ink-subtle" aria-hidden />
            </Link>
        </section>
    );
}
