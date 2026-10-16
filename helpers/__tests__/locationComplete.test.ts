import {describe, expect, it} from "vitest";

import {minimumAnnonce, minimumLisible, proposeLaJournee, proposeLHeure} from "@/helpers/rental";

/**
 * T117 — « La location par jour c'est combien et le minimum c'est combien de
 * jours : on doit avoir toutes ces informations là, et ça doit être au
 * complet. »
 *
 * Mêmes cas que `helpers/__tests__/location-complete-test.ts` du mobile : le
 * même client, sur le même véhicule, ne peut pas lire deux minimums selon
 * qu'il ouvre son téléphone ou son navigateur.
 */
describe("les modes proposés", () => {
    it("suit ce que le serveur annonce, pas la présence d'un tarif", () => {
        expect(proposeLaJournee({daily_rate: 150, allows_daily: false})).toBe(false);
        expect(proposeLHeure({hourly_rate: 10, allows_hourly: false})).toBe(false);
    });

    it("retombe sur le tarif quand le serveur ne connaît pas le champ", () => {
        expect(proposeLaJournee({daily_rate: 150})).toBe(true);
        expect(proposeLaJournee({daily_rate: null})).toBe(false);
        expect(proposeLHeure({hourly_rate: 10})).toBe(true);
    });
});

describe("le minimum annoncé", () => {
    it("retient le plus contraignant du véhicule et du type", () => {
        expect(minimumAnnonce({minimum_hours: 4}, {minimum_hours: 24})).toBe(24);
        expect(minimumAnnonce({minimum_hours: 48}, {minimum_hours: 4})).toBe(48);
    });

    it("vaut zéro quand rien n'est imposé", () => {
        expect(minimumAnnonce(null, null)).toBe(0);
        expect(minimumAnnonce({minimum_hours: null}, {minimum_hours: null})).toBe(0);
    });

    it("s'exprime en journées dès qu'il en couvre une", () => {
        expect(minimumLisible(48)).toBe("2 jours minimum");
        expect(minimumLisible(24)).toBe("1 jour minimum");
        expect(minimumLisible(3)).toBe("3 heures minimum");
        expect(minimumLisible(1)).toBe("1 heure minimum");
    });

    it("ne dit rien quand rien n'est imposé", () => {
        expect(minimumLisible(0)).toBeNull();
    });
});
