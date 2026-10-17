"use client";

import React from "react";
import {FaMapLocationDot} from "react-icons/fa6";

import {useConsentement} from "@/providers/consentement-provider";

/**
 * Enveloppe une carte Google, et ne la monte qu'avec l'accord du visiteur.
 *
 * Google Maps est un TIERS : charger son script lui transmet l'adresse IP du
 * visiteur et lui laisse poser ses propres cookies. Tant que les « cartes »
 * ne sont pas autorisées, le script n'est pas chargé du tout — un composant
 * non monté n'appelle pas `useLoadScript`.
 *
 * ON NE SE CONTENTE PAS DE CACHER : un bouton propose d'autoriser et
 * d'afficher la carte tout de suite. Refuser ne doit pas rendre le service
 * inutilisable, et une zone vide sans explication passe pour une panne.
 *
 * Le bouton autorise la CATÉGORIE, pas cette carte-là : le visiteur dit oui
 * aux cartes du site, et le choix se retrouve dans ses réglages, où il peut
 * revenir dessus.
 */
export default function CarteConsentie({
    children,
    hauteur = "h-full",
}: {
    children: React.ReactNode;
    /** La classe de hauteur du substitut, pour qu'il occupe la place de la carte. */
    hauteur?: string;
}) {
    const {autorise, consentement, poser} = useConsentement();

    if (autorise("cartes")) return <>{children}</>;

    return (
        <div
            className={`flex ${hauteur} w-full flex-col items-center justify-center gap-3 rounded-card border border-surface-border bg-surface-sunken p-6 text-center`}
        >
            <FaMapLocationDot className="text-3xl text-ink-subtle" aria-hidden />

            <p className="max-w-sm text-caption leading-6 text-ink-muted">
                La carte est fournie par Google Maps. L’afficher transmet votre adresse IP à
                Google, nous attendons donc votre accord.
            </p>

            <button
                type="button"
                onClick={() =>
                    poser({
                        cartes: true,
                        // On ne touche pas aux notifications : le visiteur
                        // demande une carte, pas des alertes.
                        notifications: consentement?.notifications ?? false,
                    })
                }
                className="inline-flex min-h-11 items-center rounded-pill bg-brand-500 px-6 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600"
            >
                Autoriser et afficher la carte
            </button>
        </div>
    );
}
