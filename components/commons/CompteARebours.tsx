"use client";

import React from "react";
import {FiClock} from "react-icons/fi";

import {compteARebours, TonExpiration} from "@/helpers/expiration";

/**
 * Ce que le client perd si le délai tombe.
 *
 * Le mécanisme est le même des deux côtés — le serveur pose une échéance et
 * défait tout seul ce qui n'est pas payé — mais pas l'enjeu : une commande de
 * repas est annulée, un créneau de location repart à la vente. Les phrases du
 * mobile disent déjà cette différence, et elles sont reprises telles quelles :
 * un seul compte à rebours, deux vocabulaires.
 */
export type SujetExpiration = "commande" | "reservation";

interface Props {
    minutes: number | null;
    ton: TonExpiration | null;
    /** En pastille sur une carte de commande, en bloc sur la page de paiement. */
    compact?: boolean;
    sujet?: SujetExpiration;
}

/** Ce qui change d'un sujet à l'autre : les mots, jamais le délai. */
const phrases: Record<SujetExpiration, Record<TonExpiration, {longue: string; courte: string}> & {
    titre: string;
    expire: string;
}> = {
    commande: {
        titre: "Il reste",
        expire: "Commande expirée",
        calme: {longue: "pour régler cette commande", courte: "pour payer"},
        pressant: {longue: "avant que la commande ne soit annulée", courte: "pour payer"},
        critique: {
            longue: "dernière minute pour régler cette commande",
            courte: "dernière minute",
        },
        ecoule: {
            longue: "la commande a été annulée faute de paiement",
            courte: "commande expirée",
        },
    },
    reservation: {
        titre: "Il reste",
        expire: "Réservation expirée",
        calme: {longue: "pour régler l’acompte et retenir ce véhicule", courte: "pour payer"},
        pressant: {longue: "avant que le créneau ne reparte à la vente", courte: "pour payer"},
        critique: {
            longue: "dernière minute pour retenir ce véhicule",
            courte: "dernière minute",
        },
        ecoule: {longue: "le créneau a été relâché", courte: "créneau relâché"},
    },
};

/**
 * Fond, taille, texte et phrase vont ensemble : un seul endroit les accorde.
 *
 * Même règle de couleur que le mobile : le chiffre est rouge à tous les
 * paliers, parce que c'est la couleur de ce qu'on peut perdre et que le client
 * doit la lire dès l'ouverture, pas à la douzième minute. L'escalade passe par
 * le fond et par la taille, pas par la teinte, qui n'a plus de marge.
 */
const tons: Record<
    TonExpiration,
    {fond: string; fondCompact: string; chiffre: string; taille: string; phraseTon: string}
> = {
    calme: {
        fond: "bg-surface",
        fondCompact: "bg-surface-sunken",
        chiffre: "text-danger",
        taille: "text-heading",
        phraseTon: "text-ink-muted",
    },
    pressant: {
        fond: "bg-danger-surface",
        fondCompact: "bg-danger-surface",
        chiffre: "text-danger",
        taille: "text-display",
        phraseTon: "text-danger",
    },
    critique: {
        fond: "bg-danger-surface border border-danger",
        fondCompact: "bg-danger-surface border border-danger",
        chiffre: "text-danger",
        taille: "text-display",
        phraseTon: "text-danger",
    },
    ecoule: {
        fond: "bg-surface-sunken",
        fondCompact: "bg-surface-sunken",
        chiffre: "text-ink-muted",
        taille: "text-heading",
        phraseTon: "text-ink-muted",
    },
};

/**
 * Le temps qu'il reste pour régler une commande.
 *
 * Il existait sur le téléphone et nulle part sur le web : le même client, sur
 * la même commande, voyait son délai courir d'un côté et découvrait
 * l'annulation de l'autre sans avoir été prévenu.
 *
 * Sans échéance envoyée par le serveur, rien ne s'affiche.
 */
export default function CompteARebours({minutes, ton, compact, sujet = "commande"}: Props) {
    if (ton === null) return null;

    const apparence = tons[ton];
    const mots = phrases[sujet];
    const valeur = compteARebours(minutes);

    if (compact) {
        return (
            <span
                className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 ${apparence.fondCompact}`}
                aria-label={
                    ton === "ecoule" ? mots.expire : `Il reste ${valeur} pour payer`
                }
            >
                <FiClock className={apparence.phraseTon} aria-hidden />

                {ton === "ecoule" ? null : (
                    <span className={`text-caption font-bold tabular-nums ${apparence.chiffre}`}>
                        {valeur}
                    </span>
                )}

                <span className={`text-caption ${apparence.phraseTon}`}>
                    {mots[ton].courte}
                </span>
            </span>
        );
    }

    return (
        <div className={`flex flex-col items-center gap-1 rounded-card px-4 py-5 ${apparence.fond}`}>
            <span className="flex items-center gap-1.5 text-caption font-semibold text-ink-muted">
                <FiClock aria-hidden />
                {ton === "ecoule" ? mots.expire : mots.titre}
            </span>

            {ton === "ecoule" ? null : (
                <strong
                    className={`font-bold tabular-nums ${apparence.taille} ${apparence.chiffre}`}
                    aria-label={`Il reste ${valeur} pour payer`}
                >
                    {valeur}
                </strong>
            )}

            <span className={`text-center text-body ${apparence.phraseTon}`}>
                {mots[ton].longue}
            </span>
        </div>
    );
}
