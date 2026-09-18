/**
 * Retirer la signature du lien de paiement de tout ce qui part vers Sentry.
 *
 * Ce n'est pas de la pudeur : `signature` EST le moyen d'acces. Elle vaut
 * douze heures et elle suffit, a elle seule, a lire une commande, a figer
 * l'adresse de livraison d'un inconnu et a declencher un debit — il n'y a ni
 * jeton ni session derriere. Une signature qui part chez un tiers, fut-il un
 * outil de supervision, est une cle de paiement qui sort du produit.
 *
 * La page Blade qu'on remplace n'avait aucun SDK : c'est le deplacement vers
 * le site qui cree cette exposition, des DEUX cotes.
 *
 * - Navigateur : `tracesSampleRate: 1` envoie une transaction a chaque
 *   affichage, avec l'URL de la page et l'appel XHR vers l'API en span et en
 *   fil d'Ariane.
 * - Serveur et edge : la page est rendue cote serveur
 *   (`ƒ /paiement/precommande/[uid]`). Chaque clic sur le lien est donc une
 *   requete serveur dont l'URL porte `?expires=…&signature=…`, que le SDK Node
 *   place dans `request.url`, dans `request.query_string` — que le navigateur
 *   n'a pas — et dans les attributs de span `url.full`, `url.query`,
 *   `http.target`.
 *
 * D'ou ce module partage : une seule definition du nettoyage, branchee sur les
 * trois configurations. En avoir trois copies, c'est garantir qu'une seule
 * sera corrigee le jour ou un champ s'ajoute.
 */

/** Les parametres qui ne doivent jamais quitter le produit. */
export const PARAMETRES_SECRETS = ["signature", "expires"];

/**
 * Retire `signature` et `expires` de n'importe quelle URL, absolue ou
 * relative, et laisse le reste intact — on veut continuer a voir QUELLE page a
 * plante, juste pas avec sa cle.
 *
 * Deux formes sont traitees : `?signature=…` au sein d'une URL, et une chaine
 * de requete nue (`signature=…&expires=…`), telle que le SDK Node la range
 * dans `request.query_string`.
 *
 * Volontairement tolerant : Sentry passe ici des chaines qui ne sont pas
 * toujours des URL (descriptions de span, messages de fil d'Ariane). Un
 * remplacement textuel attrape aussi ces cas-la, et rien ne doit jamais faire
 * tomber `Sentry.init`.
 */
export const nettoyerUrl = <T,>(valeur: T): T => {
    if (typeof valeur !== "string" || valeur === "") return valeur;

    let sortie: string = valeur;

    try {
        for (const parametre of PARAMETRES_SECRETS) {
            sortie = sortie.replace(
                // Precede d'un « ? », d'un « & », ou en tout debut de chaine :
                // ce dernier cas est celui de `request.query_string`, qui
                // n'a pas de « ? » devant lui.
                new RegExp(`(^|[?&])(${parametre}=)[^&#\\s"']*`, "gi"),
                "$1$2[retire]"
            );
        }
    } catch {
        return valeur;
    }

    return sortie as T;
};

/**
 * Passe sur les champs d'un objet qui portent habituellement une URL
 * (`url.full`, `url.query`, `http.target`, `http.url`, `from`, `to`…).
 *
 * Non recursif au-dela d'un niveau : on vise des formes connues, pas un
 * balayage complet qui couterait a chaque evenement.
 */
export const nettoyerChamps = (cible: Record<string, unknown> | undefined) => {
    if (!cible) return;

    for (const cle of Object.keys(cible)) {
        if (typeof cible[cle] === "string") {
            cible[cle] = nettoyerUrl(cible[cle] as string);
        }
    }
};

type FilDAriane = {message?: string; data?: Record<string, unknown>};

export const nettoyerFilDAriane = <T extends FilDAriane>(fil: T): T => {
    if (fil.message) fil.message = nettoyerUrl(fil.message);
    nettoyerChamps(fil.data);

    return fil;
};

type EvenementSentry = {
    transaction?: string;
    request?: {url?: string; query_string?: unknown; headers?: Record<string, unknown>};
    breadcrumbs?: FilDAriane[];
    contexts?: {trace?: {data?: Record<string, unknown>}};
    spans?: Array<{description?: string; data?: Record<string, unknown>}>;
};

/**
 * Le nettoyage commun aux erreurs et aux transactions.
 *
 * `contexts.trace.data` en fait partie, y compris pour une erreur : un
 * evenement d'erreur emporte les donnees du span actif, qui peuvent contenir
 * `http.url` ou `url.full`.
 */
export const nettoyerEvenement = <T extends EvenementSentry>(evenement: T): T => {
    if (evenement.request?.url) {
        evenement.request.url = nettoyerUrl(evenement.request.url);
    }

    // `query_string` n'existe que cote serveur. Le SDK Node la range tantot en
    // chaine, tantot en objet de paires : on traite les deux.
    const requete = evenement.request;

    if (requete && typeof requete.query_string === "string") {
        requete.query_string = nettoyerUrl(requete.query_string);
    } else if (requete?.query_string && typeof requete.query_string === "object") {
        nettoyerChamps(requete.query_string as Record<string, unknown>);
    }

    // Les en-tetes de requete. Le SDK les attache TOUS des que `sendDefaultPii`
    // est faux, et il n'en retire que les cookies et les en-tetes d'adresse IP :
    // `referer` n'est pas dans sa liste. Or un navigateur envoie l'URL COMPLETE
    // en Referer sur une navigation de meme origine — et cette page propose
    // justement « Retour a l'accueil », le clic attendu apres une initiation en
    // mobile money. La signature vivante partait donc au saut suivant, la ou
    // aucune de nos mesures ne regardait.
    nettoyerChamps(evenement.request?.headers);

    if (evenement.transaction) {
        evenement.transaction = nettoyerUrl(evenement.transaction);
    }

    evenement.breadcrumbs?.forEach(nettoyerFilDAriane);
    nettoyerChamps(evenement.contexts?.trace?.data);

    return evenement;
};

/**
 * Une transaction porte en plus ses spans, dont l'URL appelee vit dans
 * `http.url` / `url.full`, et parfois dans la description.
 */
export const nettoyerTransaction = <T extends EvenementSentry>(evenement: T): T => {
    nettoyerEvenement(evenement);

    evenement.spans?.forEach((span) => {
        if (span.description) span.description = nettoyerUrl(span.description);
        nettoyerChamps(span.data);
    });

    return evenement;
};
