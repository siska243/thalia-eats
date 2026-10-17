import dayjs from "dayjs";
import "dayjs/locale/fr";

import {RentalSuiviType} from "@/types/rental";

/**
 * Thalia Trans : les regles du domaine, portees depuis le mobile.
 *
 * Ce fichier est le decalque de `helpers/rental.ts` de l'application
 * (`front end/thalia-delivery`). Rien n'y est reecrit : le meme client, sur la
 * meme reservation, ne peut pas lire deux creneaux, deux durees facturees ni
 * deux libelles de montant selon qu'il ouvre son telephone ou son navigateur.
 *
 * Aucun montant n'est calcule ici. Total, acompte et solde viennent du serveur
 * et ne font que passer : c'est la regle posee apres la faille de paiement ou
 * le prix etait envoye par le client.
 */

/*
 * Les dates passent par dayjs, deja installe, et la locale est posee PAR
 * APPEL. `dayjs.locale("fr")` est global : la poser ici changerait le format
 * de toutes les autres pages du site, qui ne l'ont jamais demande.
 */
const fr = (date: Date | string) => dayjs(new Date(date)).locale("fr");

/** « 10/10/2026 ». */
export const formatDMY = (date: Date | string): string => fr(date).format("DD/MM/YYYY");

/** « 14:30 ». */
export const formatTime = (date: Date | string): string => fr(date).format("HH:mm");

/** « lun. 10 oct. » : le jour de la semaine compte pour qui organise sa journee. */
export const formatJourCourt = (date: Date | string): string => fr(date).format("ddd D MMM");

/** « samedi 10 octobre 2026 ». */
export const formatDateStringFr = (date: Date | string): string =>
    fr(date).format("dddd DD MMMM YYYY");

/** « samedi 10 octobre 2026 à 14:30 ». */
export const formatDateTimeStringFr = (date: Date | string): string =>
    fr(date).format("dddd DD MMMM YYYY [à] HH:mm");

/**
 * Le format que l'API attend pour un creneau : `Y-m-d H:i:s`, dans l'heure
 * locale du navigateur.
 *
 * Ecrit ici et pas dans un ecran : la reservation, le catalogue et le
 * recapitulatif envoient tous trois le meme creneau, et deux formats
 * differents feraient reserver un autre horaire que celui qui a ete cote.
 */
export const formatApiDateTime = (date: Date): string => dayjs(date).format("YYYY-MM-DD HH:mm:ss");

/**
 * Deballage des reponses de location.
 *
 * Les enveloppes de l'API ne sont pas uniformes : `GET_DATA` rend la charge
 * telle quelle, si bien que certains endpoints repondent `{data: […]}` et
 * d'autres un tableau nu. Supposer une seule forme avait vide l'historique des
 * commandes de ce site.
 *
 * Une erreur axios n'est pas levee par `FetchData`, elle est *retournee* :
 * sans ce controle, le message d'erreur serait traite comme une donnee.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const contenuRental = <T>(reponse: any): T | undefined => {
    if (reponse?.name === "AxiosError") {
        throw new Error(reponse?.response?.data?.message ?? "Chargement impossible");
    }

    const corps = reponse?.data;

    if (corps && typeof corps === "object" && !Array.isArray(corps) && "data" in corps) {
        return corps.data as T;
    }

    return corps as T;
};

/**
 * Le creneau, tel que l'API l'attend.
 *
 * Un depart et une duree en heures, jamais deux dates saisies separement, qui
 * permettraient une fin avant le debut. Le catalogue, la reservation et le
 * recapitulatif s'en servent tous les trois, donc le creneau cote est bien
 * celui qui sera reserve.
 */
export const creneauRental = (startsAt: Date, hours: number) => ({
    debut: formatApiDateTime(startsAt),
    fin: formatApiDateTime(new Date(startsAt.getTime() + hours * 3600 * 1000)),
});

/**
 * Le mode de tarification, tel que le serveur le nomme.
 *
 * Deux modes, aucun melange : a l'heure, toute heure entamee est due ; a la
 * journee, toute journee entamee l'est. C'est le serveur qui applique la regle
 * et qui chiffre, le site ne transporte que le choix.
 */
export type ModeTarifaire = "hourly" | "daily";

export const HEURES_PAR_JOUR = 24;

/**
 * La journee est-elle proposee ?
 *
 * Le serveur le DIT : le mode se coche en administration, et ne se deduit
 * plus de la presence d'un tarif. Un vehicule qu'on ne veut plus louer a la
 * journee garde son tarif — il sert encore a l'affichage — sans pour autant
 * le proposer.
 *
 * Le repli sur le tarif ne vaut que pour une reponse d'un serveur qui ne
 * connait pas encore le champ : la page se comporte alors comme avant.
 */
export const proposeLaJournee = (
    vehicule?: {daily_rate?: number | null; allows_daily?: boolean} | null,
): boolean =>
    vehicule?.allows_daily !== undefined
        ? vehicule.allows_daily
        : typeof vehicule?.daily_rate === "number" && vehicule.daily_rate > 0;

/** Jumelle de la precedente, pour l'heure. */
export const proposeLHeure = (
    vehicule?: {hourly_rate?: number | null; allows_hourly?: boolean} | null,
): boolean =>
    vehicule?.allows_hourly !== undefined
        ? vehicule.allows_hourly
        : typeof vehicule?.hourly_rate === "number" && vehicule.hourly_rate > 0;

/**
 * La duree minimale annoncee au client, en heures.
 *
 * La plus CONTRAIGNANTE du vehicule et du type de course : le serveur
 * refusera la plus stricte, et annoncer la plus douce ferait composer une
 * demande vouee au refus.
 *
 * Zero quand rien n'impose de minimum : la page n'affiche alors aucune
 * contrainte, plutot qu'une contrainte qui n'existe pas.
 */
export const minimumAnnonce = (
    vehicule?: {minimum_hours?: number | null} | null,
    type?: {minimum_hours?: number | null} | null,
): number => Math.max(vehicule?.minimum_hours ?? 0, type?.minimum_hours ?? 0);

/**
 * Le minimum, dit au client.
 *
 * En JOURNEES des qu'il en couvre une : « 2 jours minimum » se comprend,
 * « 48 heures minimum » se calcule. `null` quand rien n'est impose — une
 * ligne « aucun minimum » occuperait la place pour ne rien dire.
 */
export const minimumLisible = (heures: number): string | null => {
    if (heures >= HEURES_PAR_JOUR) {
        const jours = Math.round(heures / HEURES_PAR_JOUR);

        return `${jours} jour${jours > 1 ? "s" : ""} minimum`;
    }

    return heures > 0 ? `${heures} heure${heures > 1 ? "s" : ""} minimum` : null;
};

/** Le mode lu d'un parametre d'URL. Inconnu ou absent, c'est l'heure. */
export const modeDepuisParam = (valeur?: string | null): ModeTarifaire =>
    valeur === "daily" ? "daily" : "hourly";

/**
 * Les bornes d'une duree, et le delai de prevenance.
 *
 * Elles ne sont pas ecrites ici : le proprietaire les regle en administration,
 * parce que ce sont des regles commerciales, et le serveur les sert par
 * `GET /rental/config`.
 *
 * Ces constantes ne servent que de repli, le temps que la configuration arrive
 * ou si elle ne repond pas. Elles valent ce que le serveur sert par defaut, de
 * sorte que le repli ne change rien a ce que voit le client.
 */
export interface BornesDuree {
    hours_min: number;
    hours_max: number;
    days_min: number;
    days_max: number;
    /** Combien de minutes avant le depart une course doit etre demandee. */
    lead_time_minutes: number;
}

export const BORNES_PAR_DEFAUT: BornesDuree = {
    hours_min: 1,
    hours_max: 23,
    days_min: 1,
    days_max: 30,
    lead_time_minutes: 30,
};

/** Garde une valeur dans ses bornes, sans jamais rendre un intervalle inverse. */
const borner = (valeur: number, min: number, max: number): number =>
    Math.min(Math.max(valeur, min), Math.max(min, max));

/**
 * Les bornes exprimees dans l'unite du mode : des heures, ou des journees.
 *
 * Un seul endroit lit la configuration, pour que le bouton grise, la saisie au
 * clavier et le calcul de la duree ne puissent pas diverger. C'est le motif
 * qui a deja produit deux bugs de production sur ce produit.
 */
export const bornesDuMode = (
    mode: ModeTarifaire,
    bornes: BornesDuree = BORNES_PAR_DEFAUT,
): {min: number; max: number} =>
    mode === "daily"
        ? {min: Math.max(1, bornes.days_min), max: Math.max(1, bornes.days_max)}
        : {min: Math.max(1, bornes.hours_min), max: Math.max(1, bornes.hours_max)};

/**
 * La duree du creneau, ramenee a ce que le mode sait exprimer.
 *
 * A la journee, le creneau se compte en journees pleines : laisser « 3 h »
 * ferait payer une journee entiere pour un creneau de trois heures, et le
 * client ne verrait l'ecart qu'au recapitulatif. Au retour a l'heure, on
 * replafonne a la duree horaire la plus longue proposee.
 */
export const heuresPourMode = (
    mode: ModeTarifaire,
    heures: number,
    bornes: BornesDuree = BORNES_PAR_DEFAUT,
    modePrecedent?: ModeTarifaire,
): number => {
    const {min, max} = bornesDuMode(mode, bornes);

    if (mode === "daily") {
        const jours = Math.max(1, Math.ceil(heures / HEURES_PAR_JOUR));

        return borner(jours, min, max) * HEURES_PAR_JOUR;
    }

    /*
     * On vient de la journee : le nombre affiche etait un nombre de JOURS, et
     * c'est lui qu'on garde — deux journees deviennent deux heures.
     *
     * Le total en heures etait replafonne au maximum horaire, si bien que
     * 1 jour, 2 jours et 3 jours donnaient TOUS « 23 heures » : un nombre que
     * le client n'avait jamais tape, et le meme quelle que soit sa demande.
     * Une duree en jours ne tient pas en heures, et toute conversion de la
     * duree reelle rend le meme resultat pour des demandes differentes.
     *
     * Sans mode precedent, un multiple de 24 trahit le mode journee : l'heure
     * ne depasse jamais 23.
     */
    const venaitDeLaJournee = modePrecedent
        ? modePrecedent === "daily"
        : heures >= HEURES_PAR_JOUR && heures % HEURES_PAR_JOUR === 0;

    return borner(venaitDeLaJournee ? heures / HEURES_PAR_JOUR : heures, min, max);
};

/**
 * L'heure a partir de laquelle la journee revient moins cher que l'heure.
 *
 * A 10 $ l'heure et 149 $ la journee, 14 h coutent 140 $ et 15 h en coutent
 * 150 : le client paie alors plus cher qu'une journee entiere pour moins de
 * voiture. Le plafond de 23 h ne suffit donc pas a le proteger.
 *
 * Le seuil n'est pas une constante : il depend du rapport entre les deux
 * tarifs du vehicule, qui se regle en administration. Il se calcule.
 *
 * Rend `null` quand il n'y a rien a signaler : pas de tarif journalier, ou
 * seuil au-dela de la plage horaire, auquel cas l'heure reste avantageuse
 * jusqu'au bout.
 */
export const seuilJourneeAvantageuse = (
    vehicle?: {
        hourly_rate?: number | string | null;
        daily_rate?: number | string | null;
    },
    bornes: BornesDuree = BORNES_PAR_DEFAUT,
): number | null => {
    const heure = Number(vehicle?.hourly_rate ?? 0);
    const jour = vehicle?.daily_rate == null ? 0 : Number(vehicle.daily_rate);

    if (!(heure > 0) || !(jour > 0)) return null;

    const {min, max} = bornesDuMode("hourly", bornes);
    const seuil = Math.max(min, Math.ceil(jour / heure));

    return seuil > max ? null : seuil;
};

/** Vrai quand la fin tombe un autre jour que le debut. */
const changeDeJour = (d: Date, f: Date): boolean => formatDMY(d) !== formatDMY(f);

/** Les deux dates valides d'un creneau, ou null. */
const bornesValides = (
    debut?: string | Date | null,
    fin?: string | Date | null,
): {d: Date; f: Date} | null => {
    if (!debut || !fin) return null;

    const d = new Date(debut);
    const f = new Date(fin);

    if (Number.isNaN(d.getTime()) || Number.isNaN(f.getTime())) return null;

    return {d, f};
};

/**
 * Un creneau en toutes lettres, avec le jour de fin quand il change.
 *
 * « 10/10/2026 · 23:00 a 02:00 » ne dit pas a quel jour appartient 2 h du
 * matin. Sur une reservation payante, cette ambiguite porte sur une nuit
 * entiere de location. Des que la fin tombe un autre jour, sa date est ecrite.
 */
export const creneauLisible = (
    debut?: string | Date | null,
    fin?: string | Date | null,
): string => {
    const bornes = bornesValides(debut, fin);

    if (!bornes) return "";

    const {d, f} = bornes;

    return !changeDeJour(d, f)
        ? `${formatDMY(d)} · ${formatTime(d)} à ${formatTime(f)}`
        : `${formatDMY(d)} ${formatTime(d)} → ${formatDMY(f)} ${formatTime(f)}`;
};

/**
 * Les heures d'un creneau, quand la date de debut est deja ecrite a cote.
 *
 * « 23:00 a 02:00 » laisse croire a trois heures le meme jour. On precise donc
 * le jour de fin des qu'il change.
 */
export const creneauHoraire = (
    debut?: string | Date | null,
    fin?: string | Date | null,
): string => {
    const bornes = bornesValides(debut, fin);

    if (!bornes) return "";

    const {d, f} = bornes;

    return changeDeJour(d, f)
        ? `${formatTime(d)} à ${formatTime(f)} le ${formatDMY(f)}`
        : `${formatTime(d)} à ${formatTime(f)}`;
};

/** L'heure de fin seule, datee des qu'elle tombe un autre jour. */
export const finLisible = (
    debut?: string | Date | null,
    fin?: string | Date | null,
): string => {
    const bornes = bornesValides(debut, fin);

    if (!bornes) return "";

    const {d, f} = bornes;

    return changeDeJour(d, f)
        ? `jusqu'au ${formatDMY(f)} à ${formatTime(f)}`
        : `jusqu'à ${formatTime(f)}`;
};

export interface CreneauChoisi {
    mode: ModeTarifaire;
    heures: number;
}

/** La duree dans l'unite du mode : des heures, ou des journees. */
export const uniteDuMode = (mode: ModeTarifaire, heures: number): number =>
    mode === "daily" ? Math.max(1, Math.round(heures / HEURES_PAR_JOUR)) : heures;

/**
 * Une duree choisie, ramenee dans ses bornes.
 *
 * `valeur` est exprimee dans l'unite du mode courant : des heures en horaire,
 * des journees a la journee. Elle vient d'un bouton plus ou moins, ou d'une
 * saisie au clavier, et les deux passent ici pour que taper un nombre fasse
 * exactement ce que presser le bouton ferait.
 *
 * La duree ne change PAS le mode. Une version precedente basculait a la
 * journee en franchissant 23 h : le prix baissait alors en appuyant sur
 * « plus », ce qui se lisait comme une incoherence. Le proprietaire a tranche :
 * a 23 h le bouton « plus » se grise, et c'est la bascule heure/journee qui
 * change de tarif, explicitement.
 */
export const dureeChoisie = (
    mode: ModeTarifaire,
    valeur: number,
    bornes: BornesDuree = BORNES_PAR_DEFAUT,
): CreneauChoisi => {
    const {min, max} = bornesDuMode(mode, bornes);
    const entier = Number.isFinite(valeur) ? Math.floor(valeur) : min;
    const dansLesBornes = borner(entier, min, max);

    return {
        mode,
        heures: mode === "daily" ? dansLesBornes * HEURES_PAR_JOUR : dansLesBornes,
    };
};

/**
 * La duree facturee, dans l'unite choisie : « 2 jours », et non « 48 heures ».
 *
 * `unites` vient du serveur (`billed_units`) : c'est lui qui arrondit les
 * heures et les journees entamees. Les heures ne servent qu'a afficher quelque
 * chose tant que la cotation n'est pas revenue, jamais a chiffrer.
 */
export const dureeFacturee = (mode: ModeTarifaire, unites?: number | null, heures = 0): string => {
    const brut = unites ?? (mode === "daily" ? Math.max(1, Math.ceil(heures / 24)) : heures);
    const valeur = Number.isInteger(brut) ? brut : Math.round(brut * 10) / 10;
    const unite = mode === "daily" ? "jour" : "heure";

    return `${valeur} ${unite}${valeur > 1 ? "s" : ""}`;
};

/** Le mode, tel qu'on le nomme au client. Jamais « hourly » a l'ecran. */
export const libelleDuMode = (mode: ModeTarifaire): string =>
    mode === "daily" ? "À la journée" : "À l'heure";

/**
 * Le premier depart que le serveur acceptera.
 *
 * Le delai de prevenance se regle en administration et arrive par
 * `/rental/config` : une course demande qu'on joigne un chauffeur et qu'il
 * roule. Ecrit ici plutot que dans le selecteur, parce que la fiche s'en sert
 * aussi pour poser son depart par defaut : les deux doivent repondre la meme
 * minute, sans quoi la fiche proposerait un creneau que son propre selecteur
 * refuse.
 */
export const departLePlusTot = (
    bornes: BornesDuree = BORNES_PAR_DEFAUT,
    maintenant: number = Date.now(),
): Date => new Date(maintenant + Math.max(0, bornes.lead_time_minutes) * 60000);

/**
 * Ce depart est-il trop proche pour etre reserve ?
 *
 * Le proprietaire, le 17 octobre : « on ne peut pas commander a la meme
 * heure, le minimum c'est 1 h avant. Il est 00h07, je ne peux pas commander
 * a 00h07 : le minimum c'est 01h07. Donc tenir compte heure ET jour. On ne
 * peut commander qu'au futur. »
 *
 * Compare des INSTANTS, pas des dates : un garde qui ne regarderait que le
 * jour laisserait passer 00h07, puisque le jour est bien aujourd'hui. C'est
 * exactement ce que l'attribut `min` d'un champ `time` ne sait pas faire —
 * il ignore la date qui l'accompagne.
 *
 * La question se repose a chaque instant : un creneau compose a 23h50 pour
 * 00h30 devient trop proche en restant a l'ecran.
 */
export const departTropProche = (
    depart: Date,
    bornes: BornesDuree = BORNES_PAR_DEFAUT,
    maintenant: number = Date.now(),
): boolean => depart.getTime() < departLePlusTot(bornes, maintenant).getTime();

/** Paliers de places proposes au filtre. « 7+ » couvre les minibus. */
export const PALIERS_PLACES = [2, 4, 5, 7];

export interface CriteresCatalogue {
    /** Ne garder que les vehicules libres a cet instant. */
    dispoOnly?: boolean;
    /** Nombre de places minimum, ou null pour tous. */
    places?: number | null;
    /** Trier du moins cher au plus cher. */
    sortPrice?: boolean;
}

/**
 * Filtre et trie le catalogue.
 *
 * Ecrit ici et pas dans la page : la recherche est deleguee au serveur, mais
 * ces trois criteres s'appliquent cote client, et c'est le genre de logique
 * qui se duplique ensuite dans chaque liste qui affiche des vehicules.
 *
 * Un vehicule sans nombre de places declare est ecarte du filtre : mieux vaut
 * le cacher que de le proposer pour sept personnes sans rien en savoir, le
 * client le decouvrirait au moment de monter.
 */
export const filtrerVehicules = <
    T extends {seats?: number | null; available?: boolean; hourly_rate: number},
>(
    vehicules: T[],
    {dispoOnly = false, places = null, sortPrice = false}: CriteresCatalogue = {},
): T[] => {
    let liste = vehicules;

    if (dispoOnly) {
        liste = liste.filter((vehicule) => vehicule.available !== false);
    }

    if (places !== null) {
        liste = liste.filter((vehicule) => (vehicule.seats ?? 0) >= places);
    }

    if (sortPrice) {
        liste = [...liste].sort((a, b) => a.hourly_rate - b.hourly_rate);
    }

    return liste;
};

/** Nombre de vehicules atteignant chaque palier de places. */
export const compterParPlaces = <T extends {seats?: number | null}>(
    vehicules: T[],
): Record<number, number> =>
    Object.fromEntries(
        PALIERS_PLACES.map((palier) => [
            palier,
            vehicules.filter((vehicule) => (vehicule.seats ?? 0) >= palier).length,
        ]),
    );

/**
 * Dans quel groupe ranger une reservation ?
 *
 * « A payer » attend l'acompte : le vehicule n'est retenu par personne tant
 * qu'il n'est pas arrive. « En cours » est acquis : le creneau est gagne, ou
 * la course roule. Le reste appartient a l'historique.
 *
 * Un creneau perdu va a l'historique et pas aux courses vivantes : le client a
 * paye, mais un autre a paye avant lui, et l'y laisser lui ferait attendre un
 * chauffeur qui ne viendra pas.
 *
 * Un statut inconnu est traite comme termine : un ajout cote serveur ne doit
 * pas atterrir tout seul parmi les courses vivantes.
 */
export type GroupeCourse = "a-payer" | "en-cours" | "terminees";

export const groupeDeLaCourse = (statut?: string | null): GroupeCourse => {
    if (statut === "pending_payment") return "a-payer";
    if (statut === "confirmed" || statut === "in_progress") return "en-cours";

    return "terminees";
};

/**
 * Repartit les reservations en trois groupes, en preservant l'ordre.
 *
 * Ecrit ici et pas dans la page : le meme decoupage sert aux trois onglets, a
 * leurs compteurs et a leurs etats vides. Le repartir a chaque endroit ferait
 * diverger les comptes de ce qui est affiche.
 */
export const separerCourses = <T extends {status?: string | null}>(reservations: T[]) => ({
    aPayer: reservations.filter((item) => groupeDeLaCourse(item.status) === "a-payer"),
    enCours: reservations.filter((item) => groupeDeLaCourse(item.status) === "en-cours"),
    terminees: reservations.filter((item) => groupeDeLaCourse(item.status) === "terminees"),
});

/** La pagination Laravel, telle que le catalogue la renvoie. */
export interface MetaPagination {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

/**
 * Quelle page demander apres celle-ci ?
 *
 * Une reponse sans `meta` — un endpoint non pagine, ou une erreur deballee —
 * rend `undefined` plutot que 2 : mieux vaut s'arreter que boucler sur une
 * page qui n'existe pas.
 */
export const pageSuivante = (meta?: Partial<MetaPagination> | null): number | undefined => {
    const courante = meta?.current_page;
    const derniere = meta?.last_page;

    if (typeof courante !== "number" || typeof derniere !== "number") return undefined;

    return courante < derniere ? courante + 1 : undefined;
};

/**
 * Les trois montants d'une location, dans l'ordre ou le client les lit.
 *
 * Total, acompte, solde : la fiche, le paiement et le suivi affichaient le
 * meme trio, recopie trois fois, avec trois libelles qui ont deja diverge
 * (« Acompte maintenant » ici, « Acompte » la). Un libelle qui change de sens
 * d'un ecran a l'autre sur une somme d'argent, c'est le genre d'ecart qui
 * finit en reclamation.
 *
 * Aucun calcul ici : les montants viennent du serveur et ne font que passer.
 */
export interface MontantsRental {
    /** La course seule, avant toute option. */
    base_price?: number | null;
    /** Le parking, quand le type le propose et que le client l'a coche. */
    parking_fee?: number | null;
    total?: number | null;
    deposit?: number | null;
    balance?: number | null;
}

export interface LignePrix {
    cle: "base" | "parking" | "total" | "deposit" | "balance";
    libelle: string;
    montant?: number | null;
}

/**
 * `accent` designe la somme qui compte a cet instant : l'acompte tant qu'il
 * reste a payer, le solde une fois la reservation acquise. Mettre les trois
 * lignes au meme poids laissait le client chercher ce qu'il devait sortir.
 *
 * `accent` vaut « total » quand la course est close : plus rien n'est du, et
 * les libelles passent au passe. Annoncer « Acompte a payer maintenant » sur
 * une course terminee laissait croire a une somme encore reclamee.
 */
export const lignesDuPrix = (
    montants?: MontantsRental | null,
    accent: LignePrix["cle"] = "deposit",
) => {
    const close = accent === "total";

    /*
     * Le parking entre dans le TOTAL, et donc dans l'acompte : le client en
     * paie sa part en ligne. Le laisser invisible, c'est lui facturer sans le
     * dire — « si le prix du parking est paye dans le total general on doit le
     * voir, et c'est super important ».
     *
     * Les deux lignes de detail n'apparaissent QUE s'il y a un parking a
     * facturer. Sans option, la course seule vaut le total, et une ligne qui
     * repete le total en-dessous se lit comme une double facturation.
     */
    const parking = montants?.parking_fee ?? 0;
    const detaille = parking > 0;

    const toutes: LignePrix[] = [
        ...(detaille
            ? [
                  {
                      cle: "base" as const,
                      libelle: "Course",
                      montant: montants?.base_price,
                  },
                  {cle: "parking" as const, libelle: "Parking", montant: parking},
              ]
            : []),
        {cle: "total", libelle: "Total de la course", montant: montants?.total},
        {
            cle: "deposit",
            libelle: close ? "Acompte réglé" : "Acompte à payer maintenant",
            montant: montants?.deposit,
        },
        {
            cle: "balance",
            libelle: close ? "Solde au chauffeur" : "Solde en espèces au chauffeur",
            montant: montants?.balance,
        },
    ];

    return {
        secondaires: toutes.filter((ligne) => ligne.cle !== accent),
        accent: toutes.find((ligne) => ligne.cle === accent) as LignePrix,
    };
};

export interface PointCarte {
    lat: number;
    lng: number;
}

/**
 * La position du chauffeur et le point de rendez-vous, en coordonnees carte.
 *
 * Un point incomplet rend `null` plutot qu'une coordonnee a moitie definie,
 * qui aurait pose un marqueur au large du golfe de Guinee.
 */
export const pointCarte = (
    point?: {lat?: number | null; lng?: number | null} | null,
): PointCarte | null =>
    typeof point?.lat === "number" && typeof point?.lng === "number"
        ? {lat: point.lat, lng: point.lng}
        : null;

/** Distance a vol d'oiseau, en kilometres. */
const distanceKm = (a: PointCarte, b: PointCarte): number => {
    const R = 6371;
    const rad = (valeur: number) => (valeur * Math.PI) / 180;

    const dLat = rad(b.lat - a.lat);
    const dLng = rad(b.lng - a.lng);

    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;

    return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
};

/**
 * A quelle distance se trouve le chauffeur du point de prise en charge.
 *
 * A vol d'oiseau, et c'est assez : le client veut savoir si la voiture est au
 * coin de la rue ou a l'autre bout de Kinshasa, pas l'itineraire exact.
 * Demander un trajet routier a chaque releve ferait un appel facture toutes
 * les dix secondes, par course suivie.
 *
 * `null` quand l'un des deux points manque : sans position du chauffeur, il
 * n'y a pas de distance a annoncer, et surtout pas une distance approchee.
 */
export const distanceDuChauffeur = (suivi?: RentalSuiviType | null): string | null => {
    const chauffeur = pointCarte(suivi?.chauffeur);
    const pickup = pointCarte(suivi?.pickup);

    if (!chauffeur || !pickup) return null;

    const km = distanceKm(chauffeur, pickup);

    return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
};

/**
 * La commune de prise en charge est-elle desservie ?
 *
 * La location se fait avec chauffeur et uniquement dans Kinshasa : les
 * communes ouvertes sont reglees en administration et servies par
 * `/rental/config`. Hors de cette liste, le site ne propose pas de reserver,
 * il renvoie vers le service par WhatsApp.
 *
 * Trois reponses, et pas deux. « On ne sait pas » n'est pas « hors zone » :
 * tant que la configuration n'est pas arrivee, ou qu'une adresse ne porte
 * aucune commune, refuser la reservation bloquerait un client parfaitement
 * dans la zone. La page laisse alors passer, et c'est le serveur qui tranche.
 */
export type ZonePriseEnCharge =
    | {etat: "inconnue"}
    | {etat: "desservie"; townId: number}
    | {etat: "hors-zone"};

export const zonePriseEnCharge = (
    slugCommune?: string | null,
    communes?: {id: number; slug: string}[] | null,
): ZonePriseEnCharge => {
    if (!slugCommune || !communes?.length) return {etat: "inconnue"};

    const trouvee = communes.find((commune) => commune.slug === slugCommune);

    return trouvee ? {etat: "desservie", townId: trouvee.id} : {etat: "hors-zone"};
};
