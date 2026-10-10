"use client";

import {Analytics} from "@vercel/analytics/react";
import {nettoyerUrl} from "@/helpers/sentry-nettoyage";

/**
 * Vercel Web Analytics, avec la signature du lien de paiement retiree.
 *
 * Sans prop `route`, le suivi automatique releve les pages vues depuis
 * `location.href` — chaine de requete comprise. Chaque ouverture d'un lien de
 * paiement expediait donc la signature vivante dans un magasin d'analytique a
 * longue retention. Douze heures de validite, de quoi figer l'adresse de
 * livraison d'un inconnu et lancer un debit.
 *
 * Aucune des defenses posees jusqu'ici ne l'attrapait : les crochets Sentry ne
 * voient pas cette charge utile, et `strict-origin` ne s'applique pas — ce
 * n'est pas un `Referer`, c'est l'URL de la page elle-meme dans l'evenement.
 *
 * On nettoie plutot que d'exclure `<Analytics/>` de la route : le nettoyage
 * protege aussi les liens qui fuiraient par une route qu'on n'a pas prevue, et
 * la page reste comptee comme les autres.
 *
 * `nettoyerUrl` est la meme fonction que celle des trois configurations
 * Sentry — une seule definition de « ce qui doit disparaitre d'une URL ».
 *
 * CE COMPOSANT EXISTE POUR UNE SEULE RAISON : `beforeSend` est une fonction, et
 * un composant serveur ne peut pas en passer une a un composant client. Sans ce
 * « use client », le build casse.
 */
export default function AnalytiqueNettoyee() {
    return <Analytics beforeSend={(evenement) => ({...evenement, url: nettoyerUrl(evenement.url)})} />;
}
