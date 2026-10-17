import {RentalVehicleType} from "@/types/rental";

export interface EtatVehicule {
    libre: boolean;
    /** Ce que la pastille affiche. */
    libelle: string;
}

/**
 * Ce qu'une carte de vehicule annonce, et pourquoi.
 *
 * Deux motifs distincts d'indisponibilite, et l'ecran doit dire LEQUEL :
 * « en course » passera, « pas de cette ville » ne passera jamais. Le client
 * n'a pas la meme chose a faire — attendre, ou changer de voiture. Une
 * pastille « indisponible » le laisserait devant une impasse.
 *
 * Hors secteur, le libelle NOMME la ville : c'est l'information qui resout le
 * probleme. Et il prime sur « en course » : un vehicule qui ne viendra jamais
 * ici n'a pas a promettre qu'il se liberera.
 *
 * Les deux drapeaux viennent du serveur, et leur absence vaut « rien ne s'y
 * oppose » : un serveur qui ne les connait pas encore ne change rien a
 * l'ecran.
 *
 * Jumelle de `helpers/etat-vehicule.ts` de l'application mobile : les deux
 * clients doivent dire la meme chose du meme vehicule.
 */
export const etatVehicule = (vehicle: RentalVehicleType): EtatVehicule => {
    if (vehicle.reservable === false) {
        return {
            libre: false,
            libelle: vehicle.city?.title ? `${vehicle.city.title} seulement` : "Autre secteur",
        };
    }

    if (vehicle.available === false) {
        return {libre: false, libelle: "En course"};
    }

    return {libre: true, libelle: "Libre"};
};
