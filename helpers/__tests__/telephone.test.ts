import {describe, expect, it} from "vitest";

import {estValide, pourLaSaisie, pourLeCompte} from "@/helpers/telephone";

/**
 * Le numéro de téléphone : conversions et validité.
 *
 * `helpers/telephone.ts` n'avait aucun test alors qu'il porte la seule
 * définition de la forme enregistrée d'un numéro. C'est par lui que passe le
 * numéro écrit sur le compte depuis la réservation d'une course : s'il se
 * trompe, le chauffeur appelle dans le vide.
 */
describe("estValide", () => {
    it("refuse ce qui ne se compose pas", () => {
        expect(estValide("0000")).toBe(false);
        expect(estValide("12")).toBe(false);
        expect(estValide("081000")).toBe(false);
        expect(estValide("abcdef")).toBe(false);
    });

    it("accepte les trois formes qu'un écran peut produire", () => {
        // Local, tel que le compte le stocke.
        expect(estValide("0810000000")).toBe(true);
        // International sans le plus, ce que rend react-phone-input-2.
        expect(estValide("243810000000")).toBe(true);
        // International avec le plus, saisi à la main.
        expect(estValide("+243810000000")).toBe(true);
    });

    it("accepte un numéro étranger écrit au format international", () => {
        expect(estValide("+33612345678")).toBe(true);
    });

    /*
     * Vide est ACCEPTÉ : la fonction juge le format, pas la présence. C'est
     * l'écran qui dit si le champ est obligatoire, avec ses propres mots.
     */
    it("laisse passer un champ vide", () => {
        expect(estValide("")).toBe(true);
        expect(estValide(null)).toBe(true);
        expect(estValide(undefined)).toBe(true);
    });
});

describe("conversions entre le compte et la saisie", () => {
    it("ajoute l'indicatif et retire le zéro initial", () => {
        expect(pourLaSaisie("0810000001")).toBe("243810000001");
    });

    it("laisse tel quel un numéro déjà international", () => {
        expect(pourLaSaisie("243810000001")).toBe("243810000001");
    });

    it("rend le format local que le mobile sait lire", () => {
        expect(pourLeCompte("243810000001")).toBe("0810000001");
    });

    it("fait l'aller-retour sans rien perdre", () => {
        expect(pourLeCompte(pourLaSaisie("0810000001"))).toBe("0810000001");
    });

    it("ne fabrique jamais un numéro à partir de rien", () => {
        expect(pourLaSaisie("")).toBe("");
        expect(pourLeCompte(null)).toBe("");
    });
});
