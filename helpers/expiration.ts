export type TonExpiration = "calme" | "pressant" | "critique" | "ecoule";

/**
 * Le délai de règlement, porté à l'identique depuis le mobile.
 *
 * Les trois fonctions sont la copie de `helpers/rental.ts` côté application :
 * le même client, sur la même commande, ne peut pas lire deux échéances
 * différentes selon qu'il ouvre son téléphone ou son navigateur. Les paliers
 * valent donc exactement les mêmes minutes des deux côtés.
 *
 * **Aucune durée par défaut n'est écrite ici.** Le délai se règle en
 * administration, le serveur envoie une échéance, et sans échéance rien ne
 * s'affiche : les commandes antérieures à cette règle n'en portent pas, et un
 * compte à rebours inventé serait pire que pas de compte à rebours du tout.
 */
export const minutesAvantExpiration = (
    expiresAt?: string | null,
    maintenant: number = Date.now(),
): number | null => {
    if (!expiresAt) return null;

    const echeance = Date.parse(expiresAt);

    if (Number.isNaN(echeance)) return null;

    return Math.max(0, (echeance - maintenant) / 60000);
};

/** « 04:38 ». Minutes et secondes, parce qu'un délai figé n'a pas l'air de courir. */
export const compteARebours = (minutes?: number | null): string | null => {
    if (minutes === null || minutes === undefined || !Number.isFinite(minutes)) return null;

    const secondes = Math.max(0, Math.round(minutes * 60));

    return `${String(Math.floor(secondes / 60)).padStart(2, "0")}:${String(
        secondes % 60,
    ).padStart(2, "0")}`;
};

export const tonDeLExpiration = (minutes?: number | null): TonExpiration | null => {
    if (minutes === null || minutes === undefined || !Number.isFinite(minutes)) return null;

    if (minutes <= 0) return "ecoule";
    if (minutes < 2) return "critique";
    if (minutes < 5) return "pressant";

    return "calme";
};
