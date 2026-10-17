/**
 * Le consentement aux traceurs, en un seul endroit.
 *
 * Demande du propriétaire le 17 octobre : « ajoute le cookies et
 * consentement sur la page web, et CGU et tout, pour une application de
 * telle envergure ».
 *
 * CE QUE LE SITE DÉPOSE VRAIMENT, relevé dans le code avant d'écrire une
 * ligne de bandeau. Un bandeau qui ne commande rien est pire que pas de
 * bandeau : il affirme un contrôle qui n'existe pas.
 *
 * - NÉCESSAIRES, jamais refusables : le cookie de session (`server/
 *   manageToken.ts`), le panier, l'adresse et la commune de livraison
 *   (`localStorage`). Sans eux on ne peut ni se connecter, ni commander.
 *   Ils ne servent qu'au service demandé et ne partent chez personne.
 * - CARTES : Google Maps, chargé sur le choix d'adresse et le suivi d'une
 *   course. C'est un TIERS : il reçoit l'adresse IP du visiteur et pose ses
 *   propres cookies. Refusé, la carte laisse place à un bouton, et l'adresse
 *   se saisit à la main.
 * - NOTIFICATIONS : Firebase Cloud Messaging, qui enregistre un service
 *   worker chez Google et obtient un jeton rattaché au navigateur. Refusé,
 *   rien n'est enregistré — le navigateur demandera de toute façon sa propre
 *   permission par-dessus.
 *
 * AUCUNE MESURE D'AUDIENCE, aucun pixel publicitaire : ni Google Analytics,
 * ni Tag Manager, ni Meta. Il n'y a donc pas de catégorie « statistiques »,
 * et en inventer une ferait promettre un réglage qui ne commanderait rien.
 */

/** Les catégories que le visiteur peut refuser. Les nécessaires n'en sont pas. */
export type CategorieConsentement = "cartes" | "notifications";

export interface Consentement {
    cartes: boolean;
    notifications: boolean;
    /** Quand le choix a été fait, pour pouvoir le redemander un jour. */
    date: string;
    /**
     * La version des finalités au moment du choix.
     *
     * Le jour où un nouveau tiers entre dans le site, ce nombre augmente et
     * le bandeau se repose : un consentement donné pour trois finalités n'en
     * couvre pas une quatrième.
     */
    version: number;
}

export const VERSION_CONSENTEMENT = 1;

export const CLE_CONSENTEMENT = "thalia_consentement";

/** L'événement émis au navigateur quand le choix change, pour que l'écran suive. */
export const EVENEMENT_CONSENTEMENT = "thalia:consentement";

/**
 * Le strict nécessaire d'un `Storage`, pour que la règle se teste sans
 * navigateur.
 *
 * Le lanceur de tests du web tourne en environnement `node` : il n'a pas de
 * `window`. Injecter le stockage évite d'ajouter `jsdom` au dépôt pour
 * vérifier six lignes de lecture — et rend du même coup la règle testable
 * sans rien simuler.
 */
export interface StockageConsentement {
    getItem(cle: string): string | null;
    setItem(cle: string, valeur: string): void;
}

/** Le stockage du navigateur, ou rien quand il n'y en a pas. */
const stockageParDefaut = (): StockageConsentement | null => {
    try {
        return typeof window === "undefined" ? null : window.localStorage;
    } catch {
        return null;
    }
};

/** Tout refusé : l'état par défaut, tant que rien n'a été choisi. */
export const REFUS_PAR_DEFAUT: Omit<Consentement, "date" | "version"> = {
    cartes: false,
    notifications: false,
};

/**
 * Le choix enregistré, ou `null` si le visiteur n'a pas encore répondu.
 *
 * `null` et « tout refusé » ne se valent pas : le premier fait apparaître le
 * bandeau, le second non. Les confondre reposerait la question à chaque
 * visite d'un visiteur qui a justement dit non.
 *
 * Rend `null` côté serveur et quand le stockage est inaccessible — navigation
 * privée, stockage bloqué. Dans ce cas rien n'est chargé : l'absence de
 * preuve de consentement n'est pas un consentement.
 */
export const lireConsentement = (
    stockage: StockageConsentement | null = stockageParDefaut(),
): Consentement | null => {
    if (!stockage) return null;

    try {
        const brut = stockage.getItem(CLE_CONSENTEMENT);

        if (!brut) return null;

        const lu = JSON.parse(brut) as Partial<Consentement>;

        // Une version plus ancienne ne couvre pas les finalités d'aujourd'hui.
        if (lu.version !== VERSION_CONSENTEMENT) return null;

        return {
            cartes: lu.cartes === true,
            notifications: lu.notifications === true,
            date: typeof lu.date === "string" ? lu.date : new Date().toISOString(),
            version: VERSION_CONSENTEMENT,
        };
    } catch {
        return null;
    }
};

/** Enregistre le choix et prévient les écrans ouverts. */
export const enregistrerConsentement = (
    choix: Omit<Consentement, "date" | "version">,
    stockage: StockageConsentement | null = stockageParDefaut(),
): Consentement => {
    const complet: Consentement = {
        cartes: choix.cartes === true,
        notifications: choix.notifications === true,
        date: new Date().toISOString(),
        version: VERSION_CONSENTEMENT,
    };

    try {
        stockage?.setItem(CLE_CONSENTEMENT, JSON.stringify(complet));
    } catch {
        // Stockage refusé : le choix ne vaut que pour cette page. On prévient
        // quand même les composants, pour que la carte s'affiche tout de
        // suite — la question se reposera au prochain chargement.
    }

    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(EVENEMENT_CONSENTEMENT, {detail: complet}));
    }

    return complet;
};

/**
 * Cette catégorie est-elle autorisée ?
 *
 * Sans choix enregistré, c'est NON. Le consentement se donne, il ne se
 * présume pas : charger un tiers en attendant la réponse viderait le
 * bandeau de son sens.
 */
export const categorieAutorisee = (
    consentement: Consentement | null,
    categorie: CategorieConsentement,
): boolean => consentement?.[categorie] === true;
