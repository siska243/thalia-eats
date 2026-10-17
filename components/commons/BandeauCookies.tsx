"use client";

import React, {useState} from "react";
import Link from "next/link";

import {useConsentement} from "@/providers/consentement-provider";

interface LigneProps {
    titre: string;
    detail: string;
    /** Les nécessaires ne se décochent pas : sans eux, pas de service. */
    verrouille?: boolean;
    coche: boolean;
    onChange?: (valeur: boolean) => void;
}

const Ligne = ({titre, detail, verrouille = false, coche, onChange}: LigneProps) => (
    <label
        className={`flex gap-3 rounded-control border border-surface-border p-3 ${
            verrouille ? "bg-surface-sunken" : "cursor-pointer bg-surface hover:bg-surface-sunken"
        }`}
    >
        <input
            type="checkbox"
            checked={coche}
            disabled={verrouille}
            onChange={(e) => onChange?.(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-surface-border text-brand-500 focus:ring-brand-500 disabled:opacity-60"
        />

        <span className="flex flex-col gap-0.5">
            <span className="text-body font-semibold text-ink">
                {titre}
                {verrouille ? (
                    <span className="ml-2 text-caption font-normal text-ink-subtle">
                        toujours actifs
                    </span>
                ) : null}
            </span>
            <span className="text-caption leading-6 text-ink-muted">{detail}</span>
        </span>
    </label>
);

/**
 * Le bandeau de consentement, et son panneau de réglage.
 *
 * Demande du propriétaire : « ajoute le cookies et consentement sur la page
 * web ». Il ne s'affiche que tant que le visiteur n'a pas répondu — « tout
 * refusé » est une réponse, et la reposer à chaque visite serait harceler
 * quelqu'un qui a justement dit non.
 *
 * REFUSER COÛTE UN SEUL CLIC, comme accepter. Un bandeau où « tout accepter »
 * est un bouton et le refus un parcours de trois écrans n'est pas un choix
 * libre, et c'est précisément ce que les autorités sanctionnent.
 *
 * Il ne couvre pas la page : une barre en bas, qui laisse lire et naviguer.
 * Tant qu'on n'a pas répondu, aucun tiers n'est chargé — le refus est l'état
 * de départ, pas l'acceptation.
 */
export default function BandeauCookies() {
    const {pret, consentement, poser, panneauOuvert, rouvrir, fermerLePanneau} =
        useConsentement();

    const [cartes, setCartes] = useState(false);
    const [notifications, setNotifications] = useState(false);

    // Rien avant d'avoir lu le stockage : le bandeau clignoterait sur chaque
    // page pour quelqu'un qui a déjà choisi.
    if (!pret) return null;

    const aRepondu = consentement !== null;

    if (aRepondu && !panneauOuvert) return null;

    const ouvrirLeDetail = () => {
        setCartes(consentement?.cartes ?? false);
        setNotifications(consentement?.notifications ?? false);
        rouvrir();
    };

    return (
        <div
            role="dialog"
            aria-modal={panneauOuvert}
            aria-label="Vos choix de confidentialité"
            className="fixed inset-x-0 bottom-0 z-50 border-t border-surface-border bg-surface shadow-raised"
        >
            <div className="mx-auto flex max-w-[1100px] flex-col gap-4 px-4 py-5 sm:px-6">
                {panneauOuvert ? (
                    <>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-title font-bold text-ink">
                                Choisissez ce que vous autorisez
                            </h2>
                            <p className="text-caption leading-6 text-ink-muted">
                                Ce site ne mesure pas votre audience et n’affiche aucune
                                publicité. Il n’y a donc rien à régler de ce côté.
                            </p>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-3">
                            <Ligne
                                titre="Nécessaires"
                                verrouille
                                coche
                                detail="Votre session, votre panier et votre commune de livraison. Sans eux vous ne pouvez ni vous connecter ni commander. Ils restent sur votre appareil ou sur notre serveur."
                            />
                            <Ligne
                                titre="Cartes"
                                coche={cartes}
                                onChange={setCartes}
                                detail="Google Maps, pour choisir une adresse sur la carte et suivre une course. Google reçoit alors votre adresse IP. Sans, l’adresse se saisit à la main."
                            />
                            <Ligne
                                titre="Notifications"
                                coche={notifications}
                                onChange={setNotifications}
                                detail="Pour être prévenu de l’avancement de votre commande, même hors du site. Votre navigateur vous demandera sa propre permission ensuite."
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={() => poser({cartes, notifications})}
                                className="inline-flex min-h-11 items-center rounded-pill bg-brand-500 px-6 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600"
                            >
                                Enregistrer mes choix
                            </button>

                            {aRepondu ? (
                                <button
                                    type="button"
                                    onClick={fermerLePanneau}
                                    className="min-h-11 px-2 text-caption font-semibold text-ink-muted underline-offset-4 hover:underline"
                                >
                                    Annuler
                                </button>
                            ) : null}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-title font-bold text-ink">
                                Cookies et données
                            </h2>
                            <p className="text-caption leading-6 text-ink-muted">
                                Nous utilisons le strict nécessaire pour vous connecter et tenir
                                votre panier. Deux services extérieurs restent à votre choix :
                                les cartes Google et les notifications.{" "}
                                <Link
                                    href="/cookies"
                                    className="font-semibold text-brand-600 underline-offset-4 hover:underline"
                                >
                                    Le détail
                                </Link>
                                .
                            </p>
                        </div>

                        {/* Les deux boutons ont le même poids : refuser coûte
                            un clic, comme accepter. */}
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={() => poser({cartes: true, notifications: true})}
                                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-pill bg-brand-500 px-6 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600 sm:flex-none"
                            >
                                Tout accepter
                            </button>

                            <button
                                type="button"
                                onClick={() => poser({cartes: false, notifications: false})}
                                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-pill border border-surface-border bg-surface px-6 text-body font-semibold text-ink transition-colors duration-150 hover:bg-surface-sunken sm:flex-none"
                            >
                                Tout refuser
                            </button>

                            <button
                                type="button"
                                onClick={ouvrirLeDetail}
                                className="min-h-11 px-2 text-caption font-semibold text-brand-600 underline-offset-4 hover:underline"
                            >
                                Choisir en détail
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
