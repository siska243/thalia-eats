"use client";

import PageCommandes from "@/components/commandes/PageCommandes";

/**
 * Le suivi des commandes.
 *
 * Cette adresse ouvre desormais l'ecran « Commandes », sur l'onglet « En
 * cours ». Elle est conservee telle quelle : elle figure dans la barre du
 * haut, dans le menu, et dans les liens deja partages.
 */
export default function PageTracking() {
    return <PageCommandes ongletInitial="en-cours" />;
}
