"use client";

import {useMemo} from "react";
import CardRestaurant from "./CardRestaurant";
import EmptyState from "@/components/ui/EmptyState";

/**
 * La liste des restaurants, avec sa recherche.
 *
 * La recherche appartient a la page, qui la transmet au serveur : il regarde
 * le nom, la description ET le titre des plats. Elle se faisait ici, sur le
 * nom et l'adresse des seules lignes deja chargees — chercher « poulet » ne
 * pouvait donc rien trouver.
 */
export default function Restaurants({data = [], isLoading, recherche = "", onRecherche}) {
    const restaurants = useMemo(() => data?.data ?? [], [data]);

    return (
        <section className="mx-auto max-w-[1300px] px-4 py-8 sm:px-5 md:py-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-display font-bold text-secondaryColor">
                        Tous nos restaurants
                    </h2>
                    <p className="mt-1 text-caption text-ink-muted">
                        {restaurants.length} établissement
                        {restaurants.length > 1 ? "s" : ""} à Kinshasa
                    </p>
                </div>

                <label className="relative w-full sm:max-w-xs">
                    <span className="sr-only">Rechercher un restaurant ou un plat</span>
                    <input
                        type="search"
                        value={recherche}
                        onChange={(e) => onRecherche?.(e.target.value)}
                        placeholder="Nom du restaurant ou d'un plat…"
                        className="w-full rounded-pill border border-surface-border bg-surface px-5 py-3 text-body text-ink outline-none transition-colors duration-150 placeholder:text-ink-subtle focus:border-brand-500"
                    />
                </label>
            </div>

            {isLoading ? (
                <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({length: 6}).map((_, i) => (
                        <li
                            key={i}
                            className="h-72 animate-pulse rounded-card bg-surface-sunken"
                        />
                    ))}
                </ul>
            ) : restaurants.length ? (
                <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {restaurants.map((restaurant) => (
                        <li key={restaurant.slug}>
                            <CardRestaurant restaurant={restaurant} />
                        </li>
                    ))}
                </ul>
            ) : (
                <EmptyState
                    title="Aucun restaurant trouvé"
                    message={
                        recherche
                            ? `Rien ne correspond à « ${recherche} ».`
                            : "La liste est vide pour le moment."
                    }
                />
            )}
        </section>
    );
}
