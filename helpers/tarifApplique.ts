import {RentalVehicleType} from "@/types/rental";

/**
 * Le tarif qui s'applique à la course, par mode.
 *
 * Le serveur l'envoie dans `applied_rates` : le tarif du type choisi, ou
 * celui du véhicule quand le type n'en a pas. Ce repli local ne sert qu'aux
 * réponses d'un serveur qui ne connaît pas encore ce champ.
 *
 * **On ne recalcule rien ici.** La règle vit sur le serveur, une seule fois :
 * deux calculs du même prix finissent par se contredire, et c'est exactement
 * le défaut qu'on corrige — la bascule annonçait un prix, le total en
 * facturait un autre.
 *
 * Jumelle de `helpers/tarif-applique.ts` du mobile.
 */
export const tarifApplique = (
    vehicle: RentalVehicleType | null | undefined,
    mode: "hourly" | "daily",
): number | null | undefined => {
    const applique = mode === "daily"
        ? vehicle?.applied_rates?.daily
        : vehicle?.applied_rates?.hourly;

    if (applique !== undefined && applique !== null) return applique;

    return mode === "daily" ? vehicle?.daily_rate : vehicle?.hourly_rate;
};
