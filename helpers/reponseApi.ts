/**
 * Extrait la liste d'une reponse de l'API.
 *
 * L'API n'a pas une forme de reponse, elle en a plusieurs :
 *
 *   GET /list-restaurant      -> {data: [...]}          enveloppe ApiResponse
 *   GET /user/commande/past   -> [...]                  tableau nu
 *   GET /user/commande/tracking -> [...]                tableau nu
 *   GET /default              -> {town: [...], ...}     objet a plat
 *   GET /user/commande/current -> {title, message}      sans `data` quand vide
 *
 * Chaque page devinait donc la forme de son cote, et se trompait des qu'un
 * endpoint changeait de famille : lire `.data` sur un tableau nu renvoie
 * `undefined`, et la page affiche « aucune commande » alors que le serveur
 * vient d'en envoyer seize.
 *
 * Cette fonction est le seul endroit ou la question se pose.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const listeDe = <T = any>(reponse: unknown): T[] => {
    if (Array.isArray(reponse)) return reponse as T[];

    const interieur = (reponse as {data?: unknown})?.data;
    if (Array.isArray(interieur)) return interieur as T[];

    return [];
};

/**
 * Transforme en texte simple un champ saisi dans l'editeur riche du back-office.
 *
 * `description`, cote restaurant comme cote plat, arrive avec ses balises :
 * `<p>Gastronomie et cuisine africaine&nbsp;</p>`. Rendu tel quel dans du JSX,
 * React echappe le tout et le visiteur lit les balises en clair sur la page.
 *
 * On retire les balises plutot que d'injecter le HTML : le champ est modifiable
 * depuis l'administration, et `dangerouslySetInnerHTML` sur une valeur venue de
 * la base ouvrirait une injection de script a quiconque peut editer une fiche.
 * Le texte seul suffit a l'usage — une ligne de presentation.
 */
export const enTexte = (html?: string | null): string => {
    if (!html) return "";

    return html
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<\/(p|div|li|h[1-6])>/gi, " ")
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;|&apos;/gi, "'")
        .replace(/\s+/g, " ")
        .trim();
};
