"use client";

import {Suspense} from "react";

import PageCommandes from "@/components/commandes/PageCommandes";

/**
 * L'historique des commandes.
 *
 * Meme ecran que `/tracking`, ouvert sur l'onglet « Terminées ». Les deux
 * pages affichaient auparavant deux mises en page differentes pour la meme
 * commande, avec chacune ses defauts.
 */
export default function PageHistorique() {
    /*
     * Suspense : la page lit l'univers choisi dans l'adresse
     * (`?univers=location`), et `useSearchParams` impose cette frontiere dans
     * l'App Router. Sans elle, le build bascule toute la page en rendu
     * dynamique sans rien dire.
     */
    return (
        <Suspense fallback={<div className="min-h-svh bg-surface-sunken" />}>
            <PageCommandes ongletInitial="terminees" />
        </Suspense>
    );
}
