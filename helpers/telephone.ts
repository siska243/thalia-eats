/**
 * Le numéro de téléphone, entre le compte et le composant de saisie.
 *
 * Deux formats coexistent et ne peuvent pas être confondus :
 *
 * - les **comptes** stockent le format local congolais, « 0810000001 ». C'est
 *   ce que le mobile lit, ce que l'administration affiche, et ce que le
 *   chauffeur voit sur sa course ;
 * - `react-phone-input-2` travaille en **international sans le plus**,
 *   « 243810000001 ». Lui passer un numéro local lui ferait comprendre un
 *   autre pays, ou rien du tout.
 *
 * Les deux conversions vivent ici, une fois. Les écrire dans chaque écran
 * ferait diverger la forme enregistrée selon la page qui l'a saisie, et c'est
 * le numéro par lequel on joint un client : il ne peut pas dépendre de l'écran
 * où il a été tapé.
 */

/** L'indicatif de la RDC. Le seul pays desservi aujourd'hui. */
const INDICATIF_RDC = "243";

/** Ne garde que les chiffres : le composant comme le compte peuvent porter espaces et plus. */
const chiffres = (valeur?: string | null) => (valeur ?? "").replace(/\D/g, "");

/**
 * Le numéro du compte, tel que le composant de saisie l'attend.
 *
 * « 0810000001 » devient « 243810000001 ». Un numéro déjà international est
 * rendu tel quel, et une valeur vide reste vide : on ne passe jamais au
 * composant un numéro inventé.
 */
export const pourLaSaisie = (numeroDuCompte?: string | null): string => {
    const brut = chiffres(numeroDuCompte);

    if (!brut) return "";

    if (brut.startsWith(INDICATIF_RDC)) return brut;

    // Le zéro initial est la marque du format local : il cède la place à
    // l'indicatif, il ne s'y ajoute pas.
    return brut.startsWith("0")
        ? `${INDICATIF_RDC}${brut.slice(1)}`
        : `${INDICATIF_RDC}${brut}`;
};

/**
 * Le numéro saisi, tel que le compte le stocke.
 *
 * L'inverse exact : « 243810000001 » redevient « 0810000001 ». Enregistrer la
 * forme internationale casserait la lecture du mobile, qui analyse le numéro
 * en supposant le format local.
 */
export const pourLeCompte = (numeroSaisi?: string | null): string => {
    const brut = chiffres(numeroSaisi);

    if (!brut) return "";

    return brut.startsWith(INDICATIF_RDC) ? `0${brut.slice(INDICATIF_RDC.length)}` : brut;
};
