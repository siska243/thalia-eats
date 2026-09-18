// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import {
    nettoyerEvenement,
    nettoyerFilDAriane,
    nettoyerTransaction,
} from "@/helpers/sentry-nettoyage";

/**
 * La route du lien de paiement d'une pre-commande.
 *
 * Le rejeu video n'est pas nettoyable evenement par evenement : il enregistre
 * la session entiere, URL comprise. On ne l'active donc pas du tout sur cette
 * page. Le pourquoi — `signature` est un moyen d'acces, pas une donnee de
 * confort — est ecrit dans `helpers/sentry-nettoyage.ts`.
 *
 * Le test porte sur l'adresse d'arrivee, et c'est le bon endroit : on atteint
 * cette page par un lien externe recu dans une conversation, jamais par une
 * navigation interne au site.
 */
const ROUTE_PAIEMENT_PRECOMMANDE = "/paiement/precommande/";

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

  // Les trois portes de sortie, nettoyees par le module partage.
  beforeSend: nettoyerEvenement,
  beforeSendTransaction: nettoyerTransaction,
  beforeBreadcrumb: nettoyerFilDAriane,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
