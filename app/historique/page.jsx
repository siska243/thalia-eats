"use client";

import PageCommandes from "@/components/commandes/PageCommandes";

/**
 * L'historique des commandes.
 *
 * Meme ecran que `/tracking`, ouvert sur l'onglet « Terminées ». Les deux
 * pages affichaient auparavant deux mises en page differentes pour la meme
 * commande, avec chacune ses defauts.
 */
export default function PageHistorique() {
    return <PageCommandes ongletInitial="terminees" />;
}
