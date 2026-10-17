"use client";

import {Suspense, useMemo, useState, useSyncExternalStore} from "react";
import Restaurants from "@/components/restaurants/Restaurants";
import BanniereRestaurants from "@/components/restaurants/BanniereRestaurants";
import SectionAbout from "@/components/home/SectionAbout";
import {Route} from "@/helpers/Route";
import {communeDeLivraison} from "@/helpers/commune-livraison";
import useReferentialData from "@/hooks/useQueryTanStack";
import useDebouncedValue from "@/hooks/useDebouncedValue";

/**
 * La liste des restaurants.
 *
 * La page affichait un `<Loader/>` plein ecran tant que l'API n'avait pas
 * repondu : sur une connexion lente, plusieurs secondes de page blanche alors
 * que la banniere, elle, n'attend aucune donnee. Elle s'affiche donc tout de
 * suite, et seule la grille montre son chargement.
 */
export default function PageRestaurants() {
    /*
     * Lue cote client seulement : `localStorage` n'existe pas sur le serveur,
     * et un rendu client different du rendu serveur declenche une erreur
     * d'hydratation. `useSyncExternalStore` rend `null` au rendu serveur puis
     * la vraie commune une fois dans le navigateur.
     *
     * Rien a surveiller : la commune de livraison ne change pas pendant qu'on
     * parcourt le catalogue, elle se choisit au paiement.
     */
    const commune = useSyncExternalStore(
        () => () => {},
        communeDeLivraison,
        () => null,
    );

    /*
     * La recherche est deleguee au serveur, comme sur le mobile.
     *
     * Elle se faisait ici, sur le nom et l'adresse des restaurants deja
     * charges : chercher « poulet » ne trouvait donc rien, puisque les plats
     * ne sont pas dans cette liste. Le serveur, lui, regarde aussi le titre
     * des plats. Deux lectures de la meme regle avaient deja diverge.
     */
    const [recherche, setRecherche] = useState("");
    const terme = useDebouncedValue(recherche).trim();

    const url = useMemo(() => {
        const parametres = [];

        // La commune deja choisie part avec la requete : c'est elle qui permet
        // au serveur de dire quels restaurants sont hors zone. Absente, le
        // catalogue s'affiche comme avant.
        if (commune) parametres.push(`town=${encodeURIComponent(commune)}`);
        if (terme) parametres.push(`search=${encodeURIComponent(terme)}`);

        return parametres.length
            ? `${Route.list_restaurant}?${parametres.join("&")}`
            : Route.list_restaurant;
    }, [commune, terme]);

    const {data, isLoading} = useReferentialData({
        url,
        queryKey: `query-list-restaurant-${commune ?? "sans-commune"}-${terme}`,
        // La liste precedente reste affichee pendant la frappe : sans cela la
        // grille clignote vers son squelette a chaque lettre.
        placeholderData: (precedent) => precedent,
    });

    return (
        <>
            <div className="bg-surface pt-[var(--header-h)]">
                <BanniereRestaurants nombre={data?.data?.length} />

                <Suspense>
                    <Restaurants
                        data={data ?? []}
                        isLoading={isLoading}
                        recherche={recherche}
                        onRecherche={setRecherche}
                    />
                </Suspense>
            </div>

            <SectionAbout />
        </>
    );
}
