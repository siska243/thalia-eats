import {describe, expect, it} from "vitest";

import {RouteRental} from "@/helpers/Route";

/**
 * T121 — « Dans le filtre il faut ajouter le type de course, également
 * proposer la location, ville, commune (multiple). »
 *
 * Mêmes cas que `helpers/__tests__/catalogue-filtres-test.ts` du mobile.
 */
describe("l'URL du catalogue filtré", () => {
    it("reste celle d'avant quand aucun filtre n'est posé", () => {
        expect(RouteRental.catalogue()).toBe("rental/vehicles");
        expect(RouteRental.catalogue("swift")).toBe("rental/vehicles?search=swift");
    });

    it("porte les communes une par une, parce qu'elles sont multiples", () => {
        expect(RouteRental.catalogue(undefined, undefined, {townIds: [3, 7]})).toBe(
            "rental/vehicles?town_ids[]=3&town_ids[]=7",
        );
    });

    it("écrit la ville, le type et le mode proposé", () => {
        expect(
            RouteRental.catalogue(undefined, undefined, {
                cityId: 1,
                courseTypeId: 4,
                proposes: "daily",
            }),
        ).toBe("rental/vehicles?city_id=1&course_type_id=4&proposes=daily");
    });

    it("n'écrit rien pour un filtre éteint", () => {
        expect(
            RouteRental.catalogue(undefined, undefined, {
                cityId: null,
                townIds: [],
                courseTypeId: null,
                proposes: null,
            }),
        ).toBe("rental/vehicles");
    });
});
