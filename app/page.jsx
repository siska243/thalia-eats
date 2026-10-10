"use client";

import {Route} from "@/helpers/Route";
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
    const {data: categories} = useReferentialData({
        url: Route.categorie,
        queryKey: "query-categorie",
    });

    const {data: restaurants} = useReferentialData({
        url: Route.list_restaurant,
        queryKey: "query-list-restaurant",
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
