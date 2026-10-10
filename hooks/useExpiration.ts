"use client";

import {useEffect, useReducer} from "react";

import {minutesAvantExpiration, tonDeLExpiration} from "@/helpers/expiration";

/**
 * Le temps qu'il reste avant qu'une commande non réglée expire.
 *
 * Le battement vit ici, pas dans le composant : le compte à rebours l'affiche,
 * mais c'est la page qui décide d'après lui si elle propose encore de payer.
 * Deux minuteurs auraient pu se désaccorder, et le bouton « Payer » serait
 * resté actif une poignée de secondes après l'expiration.
 *
 * Il bat à la seconde et s'arrête de lui-même dès que l'échéance est passée ou
 * absente : rien ne tourne sur une commande déjà payée.
 *
 * Porté à l'identique de `hooks/use-expiration.ts` du mobile.
 */
const useExpiration = (expiresAt?: string | null) => {
    const [, battre] = useReducer((n: number) => n + 1, 0);

    const minutes = minutesAvantExpiration(expiresAt);
    const encours = minutes !== null && minutes > 0;

    useEffect(() => {
        if (!encours) return;

        const minuteur = setInterval(battre, 1000);

        return () => clearInterval(minuteur);
    }, [encours]);

    const ecoule = minutes !== null && minutes <= 0;

    return {minutes, ecoule, ton: tonDeLExpiration(minutes)};
};

export default useExpiration;
