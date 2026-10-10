import type {CommuneType} from "@/types/main";

/**
 * Une adresse enregistrée du carnet.
 *
 * Miroir de `UserAddressResource` côté serveur, et copie du type mobile : les
 * deux clients parlent de la même adresse au même client, ils ne peuvent pas
 * en dire des choses différentes.
 */
export type AdresseEnregistree = {
    uid: string;
    slug: string;
    label?: string | null;
    adresse: string;
    street?: string | null;
    number_street?: string | null;
    reference?: string | null;
    lat?: number | null;
    long?: number | null;
    is_main: boolean;
    town?: CommuneType | null;
};
