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

import {parsePhoneNumberFromString} from "libphonenumber-js";

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

/**
 * Ce numéro se compose-t-il vraiment ?
 *
 * Le site ne vérifiait nulle part autre chose que « non vide ». Un `0000`
 * partait en commande, et c'est le livreur qui découvrait sur le terrain
 * qu'il n'avait aucun moyen de joindre le client.
 *
 * `libphonenumber-js` est la bibliothèque qu'utilisent déjà le mobile et le
 * backend — en PHP pour lui, même source. Trois validations maison auraient
 * fini par accepter trois choses différentes du même numéro.
 *
 * Pays par défaut : la RDC. Un numéro tapé « 0810000000 », sans indicatif, est
 * lu comme congolais ; un numéro étranger reste accepté s'il porte le sien.
 *
 * VIDE EST ACCEPTÉ ICI. Cette fonction juge le format, pas la présence :
 * c'est à l'écran de dire si le champ est obligatoire, et de le dire avec ses
 * mots. Mêler les deux afficherait « ce numéro n'est pas valide » devant un
 * champ que l'utilisateur n'a simplement pas encore rempli.
 */
export const estValide = (numero?: string | null): boolean => {
    /*
     * « Vide » se juge sur ce qui a été TAPÉ, pas sur les chiffres qu'il en
     * reste. Compter les chiffres ferait passer « abcdef » pour un champ vide,
     * donc pour un champ valide : la saisie la plus manifestement fausse
     * serait la seule à ne jamais être refusée.
     */
    const saisi = (numero ?? "").trim();

    if (!saisi) return true;

    const brut = chiffres(saisi);

    if (!brut) return false;

    /*
     * Le plus est remis : `react-phone-input-2` rend « 243810000000 » sans
     * lui, et sans le plus la bibliothèque lirait ce numéro comme un numéro
     * congolais local commençant par 243 — qui n'existe pas.
     */
    const parse = parsePhoneNumberFromString(`+${brut}`) ?? parsePhoneNumberFromString(brut, "CD");

    return parse?.isValid() ?? false;
};
