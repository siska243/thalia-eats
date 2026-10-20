import {describe, expect, it} from "vitest";

import {RouteRental} from "@/helpers/Route";
import {listerFiltresActifs} from "@/helpers/rental";

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

/**
 * T170 — l'entonnoir porte un nombre, et chaque filtre actif une pastille
 * qu'on peut retirer seule.
 *
 * Le compteur et les pastilles sortent de la MÊME liste : deux calculs
 * séparés finiraient par se contredire, un compteur à trois au-dessus de deux
 * pastilles.
 */
describe("la liste des filtres actifs", () => {
    const referentiel = {
        communes: [
            {id: 1, title: "Gombe"},
            {id: 2, title: "Limete"},
            {id: 3, title: "Lemba"},
        ],
        typesCourse: [
            {id: 4, title: "Course urbaine"},
            {id: 5, title: "Aéroport"},
        ],
        villes: [{id: 1, title: "Kinshasa"}],
    };

    it("ne rend rien quand aucun filtre n'est posé", () => {
        expect(listerFiltresActifs({}, referentiel)).toEqual([]);
        expect(
            listerFiltresActifs(
                {dispoOnly: false, sortPrice: false, places: null, filtres: {}},
                referentiel,
            ),
        ).toEqual([]);
    });

    it("compte les communes comme UN filtre, pas comme trois", () => {
        const actifs = listerFiltresActifs({filtres: {townIds: [1, 2, 3]}}, referentiel);

        expect(actifs).toHaveLength(1);
        expect(actifs[0]).toEqual({cle: "communes", libelle: "3 communes"});
    });

    it("nomme la commune quand il n'y en a qu'une", () => {
        const actifs = listerFiltresActifs({filtres: {townIds: [2]}}, referentiel);

        expect(actifs[0]).toEqual({cle: "communes", libelle: "Limete"});
    });

    it("rend le mode avec son nouveau libellé", () => {
        expect(listerFiltresActifs({filtres: {proposes: "daily"}}, referentiel)[0]).toEqual({
            cle: "propose",
            libelle: "Par jour",
        });

        expect(listerFiltresActifs({filtres: {proposes: "hourly"}}, referentiel)[0]).toEqual({
            cle: "propose",
            libelle: "Pour une course",
        });
    });

    it("rend une entrée par filtre, toutes distinctes", () => {
        const actifs = listerFiltresActifs(
            {
                dispoOnly: true,
                sortPrice: true,
                places: 4,
                filtres: {cityId: 1, townIds: [1, 2], courseTypeId: 4, proposes: "hourly"},
            },
            referentiel,
        );

        expect(actifs).toHaveLength(7);
        expect(new Set(actifs.map((item) => item.cle)).size).toBe(7);
    });

    /*
     * Un identifiant qui ne correspond à rien ne produit pas de pastille :
     * une pastille sans libellé serait pire que pas de pastille.
     */
    it("ignore un type ou une commune absents du référentiel", () => {
        expect(listerFiltresActifs({filtres: {courseTypeId: 99}}, referentiel)).toEqual([]);
        expect(listerFiltresActifs({filtres: {townIds: [99]}}, referentiel)).toEqual([]);
        expect(listerFiltresActifs({filtres: {cityId: 99}}, referentiel)).toEqual([]);
    });

    it("se passe d'un référentiel pour les filtres qui n'en ont pas besoin", () => {
        const actifs = listerFiltresActifs({dispoOnly: true, places: 2});

        expect(actifs.map((item) => item.libelle)).toEqual([
            "Libres maintenant",
            "2 personnes et plus",
        ]);
    });
});
