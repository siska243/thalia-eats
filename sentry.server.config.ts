// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import {
    nettoyerEvenement,
    nettoyerFilDAriane,
    nettoyerTransaction,
} from "@/helpers/sentry-nettoyage";

Sentry.init({
  dsn: "https://33ef37cba4df1efa83a74049dde35bc1@o4509719222681600.ingest.us.sentry.io/4509824218038272",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // La page de paiement d'une pre-commande est rendue cote serveur
  // (« f /paiement/precommande/[uid] ») : chaque clic sur le lien signe est
  // une requete dont l'URL porte « ?expires=...&signature=... ». Le SDK la
  // place dans request.url, dans request.query_string — que le navigateur
  // n'a pas — et dans les attributs de span url.full / url.query /
  // http.target. Nettoyer le navigateur seul laissait la signature sortir
  // par ici. Meme module que les deux autres configurations : une seule
  // definition, sinon une seule des trois sera corrigee le jour ou un
  // champ s'ajoute.
  beforeSend: nettoyerEvenement,
  beforeSendTransaction: nettoyerTransaction,
  beforeBreadcrumb: nettoyerFilDAriane,
});
