"use client";

import React, {createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore} from "react";

import {
    CategorieConsentement,
    Consentement,
    EVENEMENT_CONSENTEMENT,
    categorieAutorisee,
    enregistrerConsentement,
    lireConsentement,
} from "@/helpers/consentement";

interface Contexte {
    /** `null` tant que le visiteur n'a pas répondu. */
    consentement: Consentement | null;
    /** Faux tant que la lecture du stockage n'a pas eu lieu, côté navigateur. */
    pret: boolean;
    autorise: (categorie: CategorieConsentement) => boolean;
    poser: (choix: {cartes: boolean; notifications: boolean}) => void;
    /** Rouvre le panneau, depuis le pied de page ou la page Cookies. */
    rouvrir: () => void;
    panneauOuvert: boolean;
    fermerLePanneau: () => void;
}

const ConsentementContexte = createContext<Contexte | null>(null);

/**
 * Le consentement, partagé par toute l'application.
 *
 * Lu APRÈS le montage, jamais au rendu serveur : `localStorage` n'existe pas
 * sur le serveur, et un rendu client différent du rendu serveur déclenche une
 * erreur d'hydratation — le défaut déjà rencontré sur la commune de
 * livraison.
 *
 * `pret` existe pour cette raison : avant lui, on ne sait pas encore si le
 * visiteur a répondu, et afficher le bandeau à ce moment-là le ferait
 * clignoter sur chaque page pour quelqu'un qui a déjà choisi.
 */
export function ConsentementProvider({children}: {children: React.ReactNode}) {
    const [panneauOuvert, setPanneauOuvert] = useState(false);

    /*
     * `useSyncExternalStore` et non un effet qui pose l'etat : c'est le
     * motif deja en place pour la commune de livraison, et la seule facon de
     * lire `localStorage` sans qu'un rendu client differe du rendu serveur.
     *
     * L'abonnement ecoute l'evenement emis par `enregistrerConsentement` :
     * poser un choix sur la page Cookies met a jour le bandeau, et
     * reciproquement.
     */
    const abonner = useCallback((rafraichir: () => void) => {
        window.addEventListener(EVENEMENT_CONSENTEMENT, rafraichir);

        return () => window.removeEventListener(EVENEMENT_CONSENTEMENT, rafraichir);
    }, []);

    /*
     * La valeur doit etre STABLE entre deux rendus sans changement, sinon
     * React boucle. On garde donc la chaine lue, et on ne refait l'objet que
     * lorsqu'elle change.
     */
    const brut = useSyncExternalStore(
        abonner,
        () => JSON.stringify(lireConsentement()),
        () => "null",
    );

    const consentement = useMemo<Consentement | null>(() => JSON.parse(brut), [brut]);

    /*
     * Faux au rendu serveur et au premier rendu client : tant qu'on n'a pas
     * lu le stockage, on ne sait pas si le visiteur a repondu, et afficher
     * le bandeau le ferait clignoter sur chaque page pour quelqu'un qui a
     * deja choisi.
     */
    const pret = useSyncExternalStore(
        abonner,
        () => true,
        () => false,
    );

    const valeur = useMemo<Contexte>(
        () => ({
            consentement,
            pret,
            autorise: (categorie) => categorieAutorisee(consentement, categorie),
            poser: (choix) => {
                // L'ecriture emet l'evenement, et l'abonnement ci-dessus
                // rafraichit tout le monde : rien a poser a la main.
                enregistrerConsentement(choix);
                setPanneauOuvert(false);
            },
            rouvrir: () => setPanneauOuvert(true),
            panneauOuvert,
            fermerLePanneau: () => setPanneauOuvert(false),
        }),
        [consentement, panneauOuvert, pret],
    );

    return (
        <ConsentementContexte.Provider value={valeur}>{children}</ConsentementContexte.Provider>
    );
}

/**
 * Hors du fournisseur, tout est refusé plutôt que de lever une exception.
 *
 * Un composant monté par erreur en dehors ne doit pas faire tomber la page —
 * et surtout pas charger un tiers « parce qu'on ne sait pas ».
 */
export const useConsentement = (): Contexte =>
    useContext(ConsentementContexte) ?? {
        consentement: null,
        pret: false,
        autorise: () => false,
        poser: () => {},
        rouvrir: () => {},
        panneauOuvert: false,
        fermerLePanneau: () => {},
    };
