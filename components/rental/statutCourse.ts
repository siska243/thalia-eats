import {RentalBookingStatus} from "@/types/rental";

/**
 * Le vocabulaire des statuts de location, ecrit une seule fois.
 *
 * Decalque de `components/rental/booking-status.ts` du mobile. Trois pages les
 * affichent — la liste, le detail, le paiement. Les traduire dans chacune
 * laisserait `lost` dire « perdue » ici et « annulee » la, alors que ce n'est
 * pas la meme chose pour le client : dans un cas on lui doit de l'argent, dans
 * l'autre non.
 */
interface Apparence {
    label: string;
    /** Ce que le client doit comprendre, en une phrase. */
    aide: string;
    texte: string;
    fond: string;
}

const apparences: Record<RentalBookingStatus, Apparence> = {
    pending_payment: {
        label: "À payer",
        aide: "Le véhicule n'est pas encore retenu : il le sera quand l'acompte sera payé.",
        texte: "text-warning",
        fond: "bg-warning-surface",
    },
    confirmed: {
        label: "Confirmée",
        aide: "Le véhicule vous est réservé. Gardez votre code pour le départ.",
        texte: "text-success",
        fond: "bg-success-surface",
    },
    in_progress: {
        label: "En cours",
        aide: "La course a commencé. Le solde se règle en espèces au chauffeur.",
        texte: "text-success",
        fond: "bg-success-surface",
    },
    completed: {
        label: "Terminée",
        aide: "La course est terminée et le solde encaissé.",
        texte: "text-ink-muted",
        fond: "bg-surface-sunken",
    },
    lost: {
        label: "Créneau pris",
        aide: "Quelqu'un a payé avant vous sur ce créneau. Votre acompte vous est remboursé.",
        texte: "text-danger",
        fond: "bg-danger-surface",
    },
    expired: {
        label: "Expirée",
        aide: "L'acompte n'a pas été payé à temps.",
        texte: "text-ink-muted",
        fond: "bg-surface-sunken",
    },
    cancelled: {
        label: "Annulée",
        aide: "Cette réservation a été annulée.",
        texte: "text-ink-muted",
        fond: "bg-surface-sunken",
    },
};

const inconnu: Apparence = {
    label: "En traitement",
    aide: "Nous vérifions l'état de cette réservation.",
    texte: "text-ink-muted",
    fond: "bg-surface-sunken",
};

/** Un statut ajoute cote serveur ne doit pas rendre un libelle vide. */
export const apparenceDuStatut = (statut?: RentalBookingStatus | null): Apparence =>
    (statut && apparences[statut]) || inconnu;

/**
 * De quoi la page de detail est faite, selon l'etat de la course.
 *
 * Une reservation ne se grise pas d'un etat a l'autre : elle se compose
 * autrement. Tant que l'acompte n'est pas paye il n'y a ni voiture attribuee
 * ni chauffeur a montrer — le serveur envoie `null`, et la page n'a donc aucun
 * cadre vide a dessiner. Une fois la course finie, ces informations ne servent
 * plus et disparaissent de la meme facon.
 *
 * Tout cela se decide ici, une seule fois : le repartir dans la page ferait
 * tester le statut a cinq endroits, le motif derriere deux bugs de production
 * de ce produit.
 */
export interface CompositionCourse {
    /** La voiture et la personne qui conduit, des que l'acompte est regle. */
    vehiculeEtChauffeur: boolean;
    /** Le code de depart : entre le paiement et la prise en charge. */
    codePriseEnCharge: boolean;
    /** La somme qui compte a cet instant, mise en avant dans le bloc des prix. */
    accentPrix: "deposit" | "balance" | "total";
    /** L'acompte reste a engager. */
    actionPayer: boolean;
    /**
     * Annulable tant que la course n'a pas commence, la meme regle que le
     * serveur applique. L'elargir ferait proposer un bouton qui echoue.
     */
    annulable: boolean;
    /** La carte de suivi : des que la course est payee. */
    carteSuivi: boolean;
    /**
     * Combien d'etapes de `ETAPES_COURSE` sont franchies, ou `null` quand il
     * n'y a plus de progression a montrer : une course annulee, expiree ou
     * dont le creneau a ete perdu ne suit plus le chemin.
     */
    etapesFranchies: number | null;
}

/**
 * Le chemin d'une course, de la reservation a la descente.
 *
 * Quatre etapes et pas une de plus : le client doit voir ou il en est d'un
 * coup d'oeil, pas lire un journal d'evenements.
 */
export const ETAPES_COURSE = ["Réservée", "Payée", "En cours", "Terminée"] as const;

/** Fini, perdu, expire, annule : il ne reste qu'un recapitulatif. */
const recapitulatif: CompositionCourse = {
    vehiculeEtChauffeur: false,
    codePriseEnCharge: false,
    accentPrix: "total",
    actionPayer: false,
    annulable: false,
    carteSuivi: false,
    etapesFranchies: null,
};

const compositions: Record<RentalBookingStatus, CompositionCourse> = {
    pending_payment: {
        vehiculeEtChauffeur: false,
        codePriseEnCharge: false,
        accentPrix: "deposit",
        actionPayer: true,
        annulable: true,
        carteSuivi: false,
        etapesFranchies: 1,
    },
    confirmed: {
        vehiculeEtChauffeur: true,
        codePriseEnCharge: true,
        accentPrix: "balance",
        actionPayer: false,
        annulable: true,
        carteSuivi: true,
        etapesFranchies: 2,
    },
    in_progress: {
        vehiculeEtChauffeur: true,
        codePriseEnCharge: false,
        accentPrix: "balance",
        actionPayer: false,
        annulable: false,
        carteSuivi: true,
        etapesFranchies: 3,
    },
    /* Terminee : le chemin est parcouru jusqu'au bout, et c'est la seule des
       courses closes a pouvoir le montrer. Annulee, expiree ou perdue se sont
       arretees en route, leur dessiner un parcours serait mentir. */
    completed: {...recapitulatif, etapesFranchies: ETAPES_COURSE.length},
    lost: recapitulatif,
    expired: recapitulatif,
    cancelled: recapitulatif,
};

/**
 * Un statut inconnu se compose comme une course close : on ne devine pas qu'un
 * etat ajoute cote serveur donne droit au telephone du chauffeur.
 */
export const compositionDeLaCourse = (statut?: RentalBookingStatus | null): CompositionCourse =>
    (statut && compositions[statut]) || recapitulatif;
