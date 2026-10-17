/**
 * L'identité légale de l'éditeur.
 *
 * CE FICHIER EST À COMPLÉTER PAR LE PROPRIÉTAIRE. Les mentions légales
 * engagent l'entreprise : inventer une raison sociale, un numéro RCCM ou une
 * adresse de siège serait une fausse déclaration, et une mention fausse vaut
 * moins que pas de mention.
 *
 * Les champs laissés vides ne sont PAS affichés : la page se complète d'elle
 * même à mesure qu'ils sont renseignés, et rien de faux n'est publié en
 * attendant.
 *
 * Seuls les deux moyens de contact sont remplis : ils figurent déjà dans le
 * pied de page du site, donc ils sont vérifiés.
 */
export interface IdentiteEditeur {
    /** La raison sociale exacte, telle qu'elle est immatriculée. */
    raisonSociale: string;
    /** SARL, SA, établissement… */
    formeJuridique: string;
    /** L'adresse du siège. */
    siege: string;
    /** Le numéro du registre du commerce et du crédit mobilier. */
    rccm: string;
    /** L'identifiant national. */
    idNational: string;
    /** Le numéro d'impôt. */
    numeroImpot: string;
    /** La personne responsable de ce qui est publié. */
    directeurPublication: string;
    /** Qui héberge le site, avec son adresse. */
    hebergeur: string;
    email: string;
    telephone: string;
}

export const IDENTITE_EDITEUR: IdentiteEditeur = {
    raisonSociale: "",
    formeJuridique: "",
    siege: "",
    rccm: "",
    idNational: "",
    numeroImpot: "",
    directeurPublication: "",
    hebergeur: "",
    email: "thaliaeat.original@gmail.com",
    telephone: "+33 6 05 86 42 76",
};

/** Les lignes réellement renseignées, dans l'ordre où on les lit. */
export const lignesIdentite = (
    identite: IdentiteEditeur = IDENTITE_EDITEUR,
): {libelle: string; valeur: string}[] =>
    (
        [
            ["Raison sociale", identite.raisonSociale],
            ["Forme juridique", identite.formeJuridique],
            ["Siège social", identite.siege],
            ["RCCM", identite.rccm],
            ["Identifiant national", identite.idNational],
            ["Numéro d’impôt", identite.numeroImpot],
            ["Directeur de la publication", identite.directeurPublication],
            ["Hébergeur du site", identite.hebergeur],
            ["Courriel", identite.email],
            ["Téléphone", identite.telephone],
        ] as const
    )
        .filter(([, valeur]) => valeur.trim() !== "")
        .map(([libelle, valeur]) => ({libelle, valeur}));
