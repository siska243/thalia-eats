"use client";

import {useMemo, useState} from "react";
import CardRestaurant from "./CardRestaurant";
import EmptyState from "@/components/ui/EmptyState";

/**
 * La liste des restaurants, avec sa recherche.
 *
 * La grille etait figee : au-dela d'une dizaine d'etablissements il fallait
 * parcourir la page a l'oeil. Le filtre porte sur le nom et sur l'adresse,
 * parce qu'a Kinshasa on cherche autant « Gombe » que « Chez Mado ».
 *
 * Le filtrage est local : la liste complete est deja chargee, un aller-retour
 * serveur par frappe serait du gaspillage sur une connexion mobile.
 */
export default function Restaurants({data = [], isLoading}) {
    const [recherche, setRecherche] = useState("");

    const restaurants = useMemo(() => data?.data ?? [], [data]);

    const filtres = useMemo(() => {
        const terme = recherche.trim().toLowerCase();
        if (!terme) return restaurants;

        return restaurants.filter((r) =>
            `${r?.name ?? ""} ${r?.adresse ?? ""}`.toLowerCase().includes(terme)
        );
    }, [restaurants, recherche]);

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
                    <span className="sr-only">Rechercher un restaurant</span>
                    <input
                        type="search"
                        value={recherche}
                        onChange={(e) => setRecherche(e.target.value)}
                        placeholder="Nom ou quartier…"
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
            ) : filtres.length ? (
                <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {filtres.map((restaurant) => (
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
