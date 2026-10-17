import {describe, expect, it} from "vitest";

import {
    BORNES_PAR_DEFAUT,
    departTropProche,
    lignesDuPrix,
    minimumAnnonce,
    minimumLisible,
    proposeLaJournee,
    proposeLHeure,
} from "@/helpers/rental";

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

/**
 * T124 — « Si le prix du parking est payé dans le total général on doit le
 * voir, et c'est super important. »
 *
 * Mêmes cas que le mobile : le parking entre dans le TOTAL, donc dans
 * l'acompte. Le laisser invisible, c'est le facturer sans le dire.
 */
describe("le détail du total", () => {
    const montants = {base_price: 60, parking_fee: 30, total: 90, deposit: 18, balance: 72};

    it("montre la course et le parking quand il y a un parking", () => {
        const {secondaires} = lignesDuPrix(montants);

        expect(secondaires.map((ligne) => ligne.cle)).toEqual([
            "base",
            "parking",
            "total",
            "balance",
        ]);
        expect(secondaires.find((ligne) => ligne.cle === "parking")?.montant).toBe(30);
        expect(secondaires.find((ligne) => ligne.cle === "base")?.montant).toBe(60);
    });

    it("n'ajoute rien sans parking : la course seule vaut le total", () => {
        const {secondaires} = lignesDuPrix({...montants, parking_fee: 0, total: 60});

        expect(secondaires.map((ligne) => ligne.cle)).toEqual(["total", "balance"]);
    });

    it("ne change rien aux réservations d'avant, qui n'ont aucun détail", () => {
        const {secondaires, accent} = lignesDuPrix({total: 60, deposit: 12, balance: 48});

        expect(secondaires.map((ligne) => ligne.cle)).toEqual(["total", "balance"]);
        expect(accent.cle).toBe("deposit");
    });
});

/**
 * T127 — « On ne peut pas commander à la même heure. Il est 00h07, je ne peux
 * pas commander à 00h07 : le minimum c'est 01h07. Tenir compte heure ET jour.
 * On ne peut commander qu'au futur. »
 *
 * Mêmes cas que le mobile.
 */
describe("un départ trop proche", () => {
    const MIDI = new Date("2026-10-17T12:00:00").getTime();
    const bornes = {...BORNES_PAR_DEFAUT, lead_time_minutes: 60};

    it("refuse la minute présente", () => {
        expect(departTropProche(new Date(MIDI), bornes, MIDI)).toBe(true);
    });

    it("refuse le passé, même du jour même", () => {
        expect(departTropProche(new Date("2026-10-17T00:07:00"), bornes, MIDI)).toBe(true);
    });

    it("refuse une heure dans moins du délai", () => {
        expect(departTropProche(new Date("2026-10-17T12:59:00"), bornes, MIDI)).toBe(true);
    });

    it("accepte pile le délai, et au-delà", () => {
        expect(departTropProche(new Date("2026-10-17T13:00:00"), bornes, MIDI)).toBe(false);
        expect(departTropProche(new Date("2026-10-18T09:00:00"), bornes, MIDI)).toBe(false);
    });
});
