import React from "react";

import SuiviPaiement from "@/app/location/courses/[uid]/paiement/suivi-paiement";

/**
 * L'ecran d'attente du paiement de l'acompte.
 *
 * C'est ici que la passerelle depose le client, et c'est ici que le mobile
 * money l'envoie : une seule page repond a « est-ce que c'est passe ? ».
 */
export default async function Page({params}: {params: Promise<{uid: string}>}) {
    const {uid} = await params;

    return <SuiviPaiement uid={uid} />;
}
