"use client";

import {Suspense} from "react";
import Restaurants from "@/components/restaurants/Restaurants";
import BanniereRestaurants from "@/components/restaurants/BanniereRestaurants";
import SectionAbout from "@/components/home/SectionAbout";
import {Route} from "@/helpers/Route";
import useReferentialData from "@/hooks/useQueryTanStack";

/**
 * La liste des restaurants.
 *
 * La page affichait un `<Loader/>` plein ecran tant que l'API n'avait pas
 * repondu : sur une connexion lente, plusieurs secondes de page blanche alors
 * que la banniere, elle, n'attend aucune donnee. Elle s'affiche donc tout de
 * suite, et seule la grille montre son chargement.
 */
export default function PageRestaurants() {
    const {data, isLoading} = useReferentialData({
        url: Route.list_restaurant,
        queryKey: "query-list-restaurant",
    });

    return (
        <>
            <div className="bg-surface pt-[var(--header-h)]">
                <BanniereRestaurants nombre={data?.data?.length} />

                <Suspense>
                    <Restaurants data={data ?? []} isLoading={isLoading} />
                </Suspense>
            </div>

            <SectionAbout />
        </>
    );
}
