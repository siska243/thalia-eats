import {beforeEach, describe, expect, it} from "vitest";

import {
    CLE_CONSENTEMENT,
    VERSION_CONSENTEMENT,
    categorieAutorisee,
    enregistrerConsentement,
    lireConsentement,
} from "@/helpers/consentement";
import {lignesIdentite} from "@/helpers/identite-editeur";

/**
 * T132 — le consentement aux traceurs.
 *
 * Le point qui compte : un bandeau qui ne commande rien est pire que pas de
 * bandeau. Ces cas vérifient que le refus est bien l'état par défaut, et
 * qu'un choix périmé ne vaut plus.
 */
/** Un stockage de poche : le lanceur du web tourne sans navigateur. */
const stockageDeTest = () => {
    const contenu = new Map<string, string>();

    return {
        getItem: (cle: string) => contenu.get(cle) ?? null,
        setItem: (cle: string, valeur: string) => void contenu.set(cle, valeur),
    };
};

describe("le consentement", () => {
    let stockage: ReturnType<typeof stockageDeTest>;

    beforeEach(() => {
        stockage = stockageDeTest();
    });

    it("n'existe pas tant que le visiteur n'a pas répondu", () => {
        expect(lireConsentement(stockage)).toBeNull();
    });

    it("refuse tout en l'absence de réponse : le consentement se donne", () => {
        expect(categorieAutorisee(null, "cartes")).toBe(false);
        expect(categorieAutorisee(null, "notifications")).toBe(false);
    });

    it("distingue « pas encore répondu » de « tout refusé »", () => {
        enregistrerConsentement({cartes: false, notifications: false}, stockage);

        // Enregistré : le bandeau ne doit plus reposer la question.
        expect(lireConsentement(stockage)).not.toBeNull();
        expect(categorieAutorisee(lireConsentement(stockage), "cartes")).toBe(false);
    });

    it("retient ce qui a été accepté", () => {
        enregistrerConsentement({cartes: true, notifications: false}, stockage);

        const lu = lireConsentement(stockage);

        expect(categorieAutorisee(lu, "cartes")).toBe(true);
        expect(categorieAutorisee(lu, "notifications")).toBe(false);
        expect(lu?.version).toBe(VERSION_CONSENTEMENT);
    });

    it("oublie un choix donné pour une version plus ancienne des finalités", () => {
        stockage.setItem(
            CLE_CONSENTEMENT,
            JSON.stringify({cartes: true, notifications: true, version: 0, date: "2026-01-01"}),
        );

        // Un consentement donné pour trois finalités n'en couvre pas une
        // quatrième : la question se repose.
        expect(lireConsentement(stockage)).toBeNull();
    });

    it("ne tombe pas sur un stockage illisible", () => {
        stockage.setItem(CLE_CONSENTEMENT, "{ceci n'est pas du JSON");

        expect(lireConsentement(stockage)).toBeNull();
    });

});

/**
 * T132 — les mentions légales n'affichent que ce qui est renseigné.
 *
 * Inventer une raison sociale ou un numéro RCCM serait une fausse
 * déclaration, et une mention fausse vaut moins que pas de mention.
 */
describe("l'identité de l'éditeur", () => {
    const vide = {
        raisonSociale: "",
        formeJuridique: "",
        siege: "",
        rccm: "",
        idNational: "",
        numeroImpot: "",
        directeurPublication: "",
        hebergeur: "",
        email: "contact@exemple.cd",
        telephone: "+243 000 000 000",
    };

    it("ne publie pas une ligne vide", () => {
        const lignes = lignesIdentite(vide);

        expect(lignes.map((ligne) => ligne.libelle)).toEqual(["Courriel", "Téléphone"]);
    });

    it("affiche une ligne dès qu'elle est renseignée", () => {
        const lignes = lignesIdentite({...vide, rccm: "CD/KIN/RCCM/00-X-00000"});

        expect(lignes.map((ligne) => ligne.libelle)).toContain("RCCM");
    });

    it("ignore une valeur faite d'espaces", () => {
        const lignes = lignesIdentite({...vide, siege: "   "});

        expect(lignes.map((ligne) => ligne.libelle)).not.toContain("Siège social");
    });
});
