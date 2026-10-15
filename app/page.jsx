"use client";

import {useSyncExternalStore} from "react";

import {Route} from "@/helpers/Route";
import {communeDeLivraison} from "@/helpers/commune-livraison";
import useReferentialData from "@/hooks/useQueryTanStack";

import Hero from "@/components/home/Hero";
import SectionCategories from "@/components/home/SectionCategories";
import SectionFeatured from "@/components/home/SectionFeatured";
import SectionRestaurants from "@/components/home/SectionRestaurants";
import SectionPartner from "@/components/home/SectionPartner";
import SectionAbout from "@/components/home/SectionAbout";

/**
 * L'accueil.
 *
 * Trois defauts corriges au passage.
 *
 * Un `shuffle()` melangeait restaurants et categories A CHAQUE RENDU : le
 * contenu sautait sous le curseur, et deux visiteurs ne voyaient jamais la
 * meme page. L'ordre vient desormais de l'API.
 *
 * Un `if (isLoading) return <Loader/>` masquait la page entiere tant que les
 * categories n'etaient pas arrivees — un ecran blanc sur reseau lent, alors
 * que le hero et les restaurants n'attendent pas cette requete. Chaque section
 * se tait maintenant tant qu'elle n'a rien, et le reste s'affiche.
 *
 * Le decalage de l'en-tete fixe est desormais porte par le hero, qui occupe
 * toute la hauteur d'ecran. Neuf autres pages le portent encore en dur, avec
 * trois valeurs differentes : elles seront reprises a leur tour.
 */
export default function Home() {
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

    const {data: categories} = useReferentialData({
        url: Route.categorie,
        queryKey: "query-categorie",
    });

    const {data: restaurants} = useReferentialData({
        // La commune deja choisie part avec la requete : c'est elle qui permet
        // au serveur de dire quels restaurants sont hors zone. Absente, le
        // catalogue s'affiche comme avant.
        url: commune ? `${Route.list_restaurant}?town=${encodeURIComponent(commune)}` : Route.list_restaurant,
        queryKey: `query-list-restaurant-${commune ?? "sans-commune"}`,
    });

    const {data: previews} = useReferentialData({
        url: Route.produits_a_la_une,
        queryKey: "query-preview",
    });

    const plats = previews?.data ?? [];

    return (
        <div className="bg-surface pb-12">
            <Hero previews={plats} />

            <SectionCategories categories={categories?.data ?? []} />
            <SectionFeatured previews={plats} />
            <SectionRestaurants restaurants={restaurants?.data ?? []} />

            <SectionPartner />
            <SectionAbout />
        </div>
    );
}
