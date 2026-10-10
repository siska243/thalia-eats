"use client";

import {Suspense} from "react";

import PageCommandes from "@/components/commandes/PageCommandes";

/**
 * Le suivi des commandes.
 *
 * Cette adresse ouvre desormais l'ecran « Commandes », sur l'onglet « En
 * cours ». Elle est conservee telle quelle : elle figure dans la barre du
 * haut, dans le menu, et dans les liens deja partages.
 */
export default function PageTracking() {
    /*
     * Suspense : la page lit l'univers choisi dans l'adresse
     * (`?univers=location`), et `useSearchParams` impose cette frontiere dans
     * l'App Router. Sans elle, le build bascule toute la page en rendu
     * dynamique sans rien dire.
     */
    return (
        <Suspense fallback={<div className="min-h-svh bg-surface-sunken" />}>
            <PageCommandes ongletInitial="en-cours" />
        </Suspense>
    );
}
