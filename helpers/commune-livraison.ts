/**
 * La commune de livraison deja choisie par le client, si elle existe.
 *
 * Elle est posee au moment du paiement, sous la meme cle que `useCart` lit
 * pour rechiffrer une commande. Le catalogue s'en sert pour demander au
 * serveur quels restaurants sont hors de portee : sans elle, il ne peut rien
 * calculer et tout revient livrable.
 *
 * Rend `null` cote serveur et quand rien n'a encore ete choisi — le catalogue
 * s'affiche alors comme avant, sans distances.
 */
export function communeDeLivraison(): string | null {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        const brut = localStorage.getItem("thalia_eat_order_delivery_address");

        if (typeof brut !== "string") {
            return null;
        }

        return JSON.parse(brut)?.town?.slug ?? null;
    } catch {
        // Une valeur corrompue ne doit pas empecher le catalogue de s'afficher.
        return null;
    }
}
