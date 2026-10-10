import React from "react";

import FicheVehicule from "@/app/location/vehicule/[slug]/fiche-vehicule";

/**
 * La fiche d'un véhicule.
 *
 * Même découpage que la fiche d'un restaurant : la page lit son `slug` côté
 * serveur et laisse le corps au composant client, qui a besoin du créneau, du
 * compte du visiteur et de la cotation.
 */
export default async function Page({params}: {params: Promise<{slug: string}>}) {
    const {slug} = await params;

    return <FicheVehicule slug={slug} />;
}
