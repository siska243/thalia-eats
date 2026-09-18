type Creneau = {day?: string; Jour?: string; startAt?: string; endAt?: string};

/** Jours tels qu'ils sont saisis dans le back-office Filament. */
const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

export interface EtatOuverture {
    ouvert: boolean;
    /** Horaire du jour, pret a afficher : « 08:00 – 22:00 ». Null si ferme aujourd'hui. */
    creneau: string | null;
    /**
     * Heure de reouverture, quand le restaurant est ferme mais ouvrira encore
     * aujourd'hui. Null s'il n'ouvrira plus.
     *
     * C'est l'information que le client cherche vraiment : « Ouvre a 9h » lui
     * dit quoi faire, « Ferme » le laisse devant une impasse.
     */
    ouvreA: string | null;
}

const enMinutes = (heure?: string): number | null => {
    if (!heure) return null;

    const [h, m] = heure.split(":");
    const heures = Number(h);
    const minutes = Number(m ?? 0);

    if (Number.isNaN(heures) || Number.isNaN(minutes)) return null;

    return heures * 60 + minutes;
};

const heureCourte = (heure?: string) => (heure ? heure.slice(0, 5) : "");

/**
 * Un restaurant est-il ouvert maintenant ?
 *
 * Meme logique que `getOpeningStatus` de l'application mobile, pour que les
 * deux clients ne disent jamais l'inverse l'un de l'autre sur le meme
 * restaurant au meme moment.
 *
 * Sans horaires saisis, on repond « ouvert » : afficher « ferme » a tort
 * empeche de commander chez quelqu'un qui a simplement oublie de remplir ses
 * horaires.
 *
 * Un creneau dont la fermeture precede l'ouverture passe minuit (22:00 – 02:00),
 * cas courant en restauration.
 */
export const etatOuverture = (
    opens?: Creneau[] | null,
    maintenant = new Date()
): EtatOuverture => {
    if (!opens?.length) return {ouvert: true, creneau: null, ouvreA: null};

    const jour = JOURS[maintenant.getDay()];
    const creneau = opens.find((c) => (c.day ?? c.Jour)?.toLowerCase() === jour);

    if (!creneau) return {ouvert: false, creneau: null, ouvreA: null};

    const debut = enMinutes(creneau.startAt);
    const fin = enMinutes(creneau.endAt);

    if (debut === null || fin === null) return {ouvert: true, creneau: null, ouvreA: null};

    const courant = maintenant.getHours() * 60 + maintenant.getMinutes();

    const ouvert =
        fin >= debut
            ? courant >= debut && courant <= fin
            : courant >= debut || courant <= fin;

    return {
        ouvert,
        creneau: `${heureCourte(creneau.startAt)} – ${heureCourte(creneau.endAt)}`,
        ouvreA: !ouvert && courant < debut ? heureCourte(creneau.startAt) : null,
    };
};

/**
 * Ce qu'on ecrit sous le nom d'un restaurant ferme.
 *
 * « Fermé » seul est une porte close sans indication. L'heure de reouverture
 * transforme le refus en rendez-vous.
 */
export const libelleFermeture = (etat: EtatOuverture) =>
    etat.ouvreA ? `Ouvre à ${etat.ouvreA}` : "Fermé aujourd'hui";

/** « 10 $ » ou « 10 000 FC », selon la devise renvoyee par l'API. */
export const formatPrix = (montant?: number | null, devise?: string | null) => {
    if (montant === null || montant === undefined) return "";

    const valeur = new Intl.NumberFormat("fr-FR", {
        maximumFractionDigits: montant % 1 === 0 ? 0 : 2,
    }).format(montant);

    return devise === "USD" ? `${valeur} $` : `${valeur} ${devise ?? ""}`.trim();
};
