// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

/**
 * La route du lien de paiement d'une pre-commande.
 *
 * Ce n'est pas de la pudeur : `signature` EST le moyen d'acces. Elle vaut
 * douze heures et elle suffit, a elle seule, a lire une commande, a figer
 * l'adresse de livraison d'un inconnu et a declencher un debit — il n'y a ni
 * jeton ni session derriere. Une signature qui part chez un tiers, fut-il un
 * outil de supervision, est une cle de paiement qui sort du produit.
 *
 * La page Blade qu'on remplace n'avait aucun SDK navigateur : c'est le
 * deplacement vers le site qui cree cette exposition, et c'est ici qu'il faut
 * la refermer.
 */
const ROUTE_PAIEMENT_PRECOMMANDE = "/paiement/precommande/";

/** Les parametres qui ne doivent jamais quitter le navigateur. */
const PARAMETRES_SECRETS = ["signature", "expires"];

/**
 * Retire `signature` et `expires` de n'importe quelle URL, absolue ou
 * relative, et laisse le reste intact — on veut continuer a voir QUELLE page a
 * plante, juste pas avec sa cle.
 *
 * Volontairement tolerant : Sentry passe ici des chaines qui ne sont pas
 * toujours des URL (descriptions de span, messages de fil d'Ariane). Un
 * remplacement textuel attrape aussi ces cas-la, et rien ne doit jamais faire
 * tomber `Sentry.init`.
 */
const nettoyerUrl = <T,>(valeur: T): T => {
    if (typeof valeur !== "string" || valeur === "") return valeur;

    let sortie: string = valeur;

    try {
        for (const parametre of PARAMETRES_SECRETS) {
            sortie = sortie.replace(
                new RegExp(`([?&]${parametre}=)[^&#\\s"']*`, "gi"),
                "$1[retire]"
            );
        }
    } catch {
        return valeur;
    }

    return sortie as T;
};

/**
 * Passe sur les champs d'un objet qui portent habituellement une URL.
 * Non recursif au-dela d'un niveau : on vise des formes connues, pas un
 * balayage complet qui couterait a chaque evenement.
 */
const nettoyerChamps = (cible: Record<string, unknown> | undefined) => {
    if (!cible) return;

    for (const cle of Object.keys(cible)) {
        if (typeof cible[cle] === "string") {
            cible[cle] = nettoyerUrl(cible[cle] as string);
        }
    }
};

const nettoyerFilsDAriane = (
    fils: Array<{message?: string; data?: Record<string, unknown>}> | undefined
) => {
    fils?.forEach((fil) => {
        if (fil.message) fil.message = nettoyerUrl(fil.message);
        nettoyerChamps(fil.data);
    });
};

/**
 * Le rejeu video n'est pas nettoyable evenement par evenement : il enregistre
 * la session entiere, URL comprise. On ne l'active donc pas du tout sur la
 * page de paiement d'une pre-commande.
 *
 * Le test porte sur l'adresse d'arrivee, et c'est le bon endroit : on atteint
 * cette page par un lien externe recu dans une conversation, jamais par une
 * navigation interne au site.
 */
const surLaPageDePaiement =
    typeof window !== "undefined" &&
    window.location.pathname.includes(ROUTE_PAIEMENT_PRECOMMANDE);

Sentry.init({
  dsn: "https://33ef37cba4df1efa83a74049dde35bc1@o4509719222681600.ingest.us.sentry.io/4509824218038272",

  // Add optional integrations for additional features
  integrations: surLaPageDePaiement ? [] : [
    Sentry.replayIntegration(),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: surLaPageDePaiement ? 0 : 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: surLaPageDePaiement ? 0 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Les trois portes de sortie. `tracesSampleRate: 1` envoie une transaction a
  // CHAQUE affichage de page : sans ce nettoyage, l'URL complete du lien de
  // paiement — signature comprise — partirait a chaque ouverture, plus l'appel
  // XHR vers l'API en span et en fil d'Ariane.
  beforeSend(event) {
    if (event.request?.url) event.request.url = nettoyerUrl(event.request.url);
    if (event.transaction) event.transaction = nettoyerUrl(event.transaction);
    nettoyerFilsDAriane(event.breadcrumbs);

    return event;
  },

  beforeSendTransaction(event) {
    if (event.request?.url) event.request.url = nettoyerUrl(event.request.url);
    if (event.transaction) event.transaction = nettoyerUrl(event.transaction);
    nettoyerFilsDAriane(event.breadcrumbs);

    // Les spans portent l'URL appelee dans `http.url` / `url.full`, et parfois
    // dans leur description.
    event.spans?.forEach((span) => {
      if (span.description) span.description = nettoyerUrl(span.description);
      nettoyerChamps(span.data as Record<string, unknown> | undefined);
    });

    nettoyerChamps(
      event.contexts?.trace?.data as Record<string, unknown> | undefined
    );

    return event;
  },

  beforeBreadcrumb(breadcrumb) {
    if (breadcrumb.message) breadcrumb.message = nettoyerUrl(breadcrumb.message);
    nettoyerChamps(breadcrumb.data);

    return breadcrumb;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
