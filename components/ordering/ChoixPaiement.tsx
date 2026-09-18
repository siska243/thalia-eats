"use client";

import React from "react";
import Image from "next/image";
import Spinner from "@/components/Loader/Spinner";
import cart from "@/public/assets/images/cart.svg";
import mpesa from "@/public/assets/images/mobile.jpeg";

/**
 * Le choix du moyen de paiement.
 *
 * Extrait de `app/checkout/page.tsx` pour que la page de paiement d'une
 * pre-commande montre les memes deux cartes, et non une imitation : un client
 * qui a commande par la conversation ne doit pas sentir qu'il change de monde
 * en cliquant sur son lien.
 *
 * Deux choses conservees de l'original, parce qu'elles y ont ete corrigees :
 * la mise en page passe par une grille CSS et non par une mesure de la fenetre
 * en JavaScript (qui donnait une valeur fausse au premier rendu et faisait
 * sauter la page d'une colonne a deux apres l'hydratation), et `enCours`
 * distingue les deux boutons — un seul indicateur faisait tourner le bouton
 * mobile money quand on payait par carte.
 *
 * Les libelles des boutons disent ce qui va se passer. La surprise, au moment
 * de payer, coute des commandes.
 */
export type ChoixPaiementProps = {
    enCours: null | "carte" | "mobile";
    onMobile: () => void;
    onCarte: () => void;
    /** Rendue inoperante quand la passerelle refusera la carte (montant trop bas). */
    carteIndisponible?: boolean;
    raisonCarteIndisponible?: string;
};

export default function ChoixPaiement({
    enCours,
    onMobile,
    onCarte,
    carteIndisponible = false,
    raisonCarteIndisponible,
}: ChoixPaiementProps) {
    return (
        <div className="grid gap-5 sm:grid-cols-2">
            <article className="flex flex-col rounded-card bg-surface p-6 shadow-card">
                <h2 className="text-title font-bold text-secondaryColor">Mobile money</h2>

                <div className="my-5 flex flex-1 items-center justify-center">
                    <Image
                        className="h-[160px] w-auto object-contain"
                        src={mpesa}
                        alt=""
                        width={250}
                        height={160}
                    />
                </div>

                <p className="text-body leading-6 text-ink-muted">
                    Réglez depuis votre compte M-Pesa, Orange Money ou Airtel Money. Vous
                    confirmerez le paiement sur votre téléphone.
                </p>

                <button
                    type="button"
                    onClick={onMobile}
                    disabled={enCours === "mobile"}
                    className="mt-5 inline-flex items-center justify-center rounded-pill bg-brand-500 px-6 py-3.5 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-60"
                >
                    {enCours === "mobile" ? <Spinner /> : "Payer par mobile money"}
                </button>
            </article>

            <article className="flex flex-col rounded-card bg-surface p-6 shadow-card">
                <h2 className="text-title font-bold text-secondaryColor">Carte bancaire</h2>

                <div className="my-5 flex flex-1 items-center justify-center">
                    <Image
                        className="h-[160px] w-auto object-contain"
                        src={cart}
                        alt=""
                        width={180}
                        height={160}
                    />
                </div>

                <p className="text-body leading-6 text-ink-muted">
                    Réglez par Visa ou Mastercard, sur la page sécurisée de notre
                    prestataire.
                </p>

                {carteIndisponible && raisonCarteIndisponible ? (
                    <p
                        role="status"
                        className="mt-3 rounded-control bg-warning-surface px-4 py-3 text-caption font-semibold text-warning"
                    >
                        {raisonCarteIndisponible}
                    </p>
                ) : null}

                <button
                    type="button"
                    onClick={onCarte}
                    disabled={enCours === "carte" || carteIndisponible}
                    className="mt-5 inline-flex items-center justify-center rounded-pill border border-secondaryColor px-6 py-3.5 text-body font-semibold text-secondaryColor transition-colors duration-150 hover:bg-secondaryColor hover:text-white disabled:opacity-60"
                >
                    {enCours === "carte" ? <Spinner /> : "Payer par carte"}
                </button>
            </article>
        </div>
    );
}
