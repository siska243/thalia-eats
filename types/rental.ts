/**
 * Location de vehicule avec chauffeur.
 *
 * Miroir de `services/types/rental.ts` du mobile, qui est lui-meme le miroir
 * des ressources `App\Http\Resources\Rental\*` du backend. Les noms sont ceux
 * du serveur, en anglais : les traduire ici ferait diverger le contrat de ce
 * que l'API envoie reellement.
 *
 * Les types du chauffeur ne sont pas repris : il n'a pas d'ecran web.
 */

import {ModeTarifaire} from "@/helpers/rental";

export type RentalCurrencyType = {
    id?: number;
    title?: string;
    code?: string;
    slug?: string;
};

export type RentalQuoteType = {
    /**
     * Le mode reellement applique par le serveur. Il peut differer de celui
     * demande : un vehicule sans tarif journalier est chiffre a l'heure.
     */
    mode?: "hourly" | "daily";
    /** Le prix d'une unite : une heure, ou une journee. */
    unit_price?: number;
    /** Les unites facturees, entamees comprises. */
    billed_units?: number;
    duration_hours: number;
    /**
     * Le detail du total, pour que la page puisse dire d'ou vient le montant.
     *
     * Le parking entre dans le TOTAL, donc dans l'acompte : le client en paie
     * sa part en ligne. Sans ces deux champs, il la paierait sans la voir.
     *
     * Nuls sur les reservations d'avant les types de course : la page
     * n'affiche alors aucun detail, comme avant.
     */
    base_price?: number | null;
    parking_fee?: number | null;
    total: number;
    deposit: number;
    balance: number;
    currency?: RentalCurrencyType | null;
};

/**
 * Un type de course, tel que le serveur le decrit.
 *
 * **L'ecran ne connait AUCUN code.** Il lit les regles portees par la ligne —
 * duree minimale, mode impose, commentaire exige, option parking — et s'y
 * conforme. C'est la condition pour qu'un quatrieme type cree en
 * administration apparaisse ici sans qu'on relivre le site.
 */
export interface TypeCourse {
    id: number;
    code: string;
    title: string;
    description?: string | null;
    minimum_hours?: number | null;
    forced_mode?: ModeTarifaire | null;
    note_required: boolean;
    parking_option: boolean;
    parking_hourly_fee: number;
}

export type RentalVehicleType = {
    uid: string;
    reference: string;
    slug: string;
    name: string;
    brand: string;
    model: string;
    seats?: number | null;
    description?: string | null;
    image?: string | null;
    hourly_rate: number;
    /**
     * Tarif a la journee, quand le vehicule en propose un. Nul pour ceux qui
     * ne se louent qu'a l'heure : la carte affiche alors « A l'heure » plutot
     * qu'un prix invente.
     */
    daily_rate?: number | null;
    /**
     * Le tarif qui S'APPLIQUE a la course demandee.
     *
     * Les deux champs au-dessus restent le prix habituel du vehicule ; ceux-ci
     * tiennent compte du type choisi, et retombent dessus quand le type n'a
     * pas de tarif propre.
     */
    applied_rates?: {hourly?: number | null; daily?: number | null};
    /**
     * Les types de course que CE vehicule propose.
     *
     * Ceux dont le tarif a ete saisi sur sa fiche, et eux seuls. Vide — le cas
     * de tout le parc existant — l'ecran ne propose aucun type.
     */
    course_types?: TypeCourse[];
    /**
     * Ce que ce vehicule propose, et ce qu'il impose.
     *
     * Les modes sont COCHES en administration : ils ne se deduisent plus de la
     * presence d'un tarif. `minimum_hours` reste nul quand le vehicule
     * n'impose rien — la page ne doit pas annoncer une contrainte qui
     * n'existe pas. `deposit_percentage`, lui, est toujours rempli : c'est
     * celui qui sera preleve, et le client doit savoir ce qu'il paie en ligne.
     */
    allows_hourly?: boolean;
    allows_daily?: boolean;
    minimum_hours?: number | null;
    deposit_percentage?: number;
    currency?: RentalCurrencyType | null;
    /** Present au catalogue seulement : le prix du creneau demande. */
    quote?: RentalQuoteType | null;
    /**
     * Le vehicule est-il libre a cet instant ?
     *
     * Rendu par le catalogue sans creneau. Un vehicule en course reste dans
     * la liste, grise : le retirer laisserait croire qu'il n'existe pas alors
     * qu'il sera peut-etre libre demain.
     */
    available?: boolean;
    /** La ville ou ce vehicule travaille. Nulle : il accepte toutes les villes. */
    city?: {title: string; slug: string} | null;
    /**
     * Ce vehicule peut-il prendre la course demandee ?
     *
     * Calcule par le SERVEUR a partir de la commune de prise en charge : sa
     * ville, et les communes d'ou il sort. Vrai quand on ne sait pas.
     *
     * Le catalogue reste MONDIAL : le vehicule d'ailleurs est rendu et grise,
     * exactement comme celui qui est en course.
     */
    reservable?: boolean;
};

export type RentalChauffeurType = {
    full_name: string;
    phone: string;
    photo?: string | null;
};

/**
 * Les statuts viennent de `App\Models\Booking`. `lost` est le cas propre a
 * cette ligne de produit : le client a paye, mais un autre a paye avant lui
 * sur le meme creneau — la reservation n'existe plus, le remboursement est du.
 */
export type RentalBookingStatus =
    | "pending_payment"
    | "confirmed"
    | "lost"
    | "expired"
    | "in_progress"
    | "completed"
    | "cancelled";

export type RentalBookingType = {
    uid: string;
    reference: string;
    status: RentalBookingStatus;

    starts_at: string;
    ends_at: string;
    duration_hours: number;
    /** Le mode applique a la reservation, et ce qu'il a facture. */
    pricing_mode?: "hourly" | "daily" | null;
    unit_price?: number | null;
    billed_units?: number | null;

    pickup_location: string;
    pickup_lat?: number | null;
    pickup_lng?: number | null;
    dropoff_location?: string | null;
    dropoff_lat?: number | null;
    dropoff_lng?: number | null;

    hourly_rate: number;
    /** Le detail du total, comme sur le devis : la course, puis le parking. */
    base_price?: number | null;
    parking_fee?: number | null;
    total: number;
    deposit: number;
    balance: number;
    currency?: RentalCurrencyType | null;

    vehicle?: RentalVehicleType | null;
    /** La plaque n'arrive qu'ici : au catalogue, le client n'en a pas besoin. */
    plate_number?: string | null;
    chauffeur?: RentalChauffeurType | null;

    /**
     * Le code que le chauffeur demandera au depart. Nul tant que l'acompte
     * n'est pas paye — avant, il n'y a rien a prouver.
     */
    pickup_code?: string | null;

    /**
     * L'echeance de l'acompte. Au-dela, le serveur relache le creneau : le
     * vehicule n'est retenu par personne tant qu'il n'est pas paye.
     */
    expires_at?: string | null;

    confirmed_at?: string | null;
    picked_up_at?: string | null;
    completed_at?: string | null;
    cancelled_at?: string | null;
    cancellation_reason?: string | null;
    refund_amount?: number | null;
    refunded_at?: string | null;
};

/**
 * Le suivi d'une course : ou se trouve le chauffeur, et ou il doit venir.
 *
 * `chauffeur` peut etre nul — le partage de position n'est pas actif, ou le
 * dernier releve est trop ancien pour valoir quelque chose. Le site n'invente
 * alors aucune voiture sur la carte : un marqueur immobile au mauvais endroit
 * est pire qu'un marqueur absent.
 */
export type RentalSuiviType = {
    chauffeur?: {
        lat: number;
        lng: number;
        /** Horodatage du dernier releve, pour en juger la fraicheur. */
        updated_at?: string | null;
    } | null;
    pickup?: {
        lat: number;
        lng: number;
        label?: string | null;
    } | null;
};
