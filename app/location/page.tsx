"use client";

import React, {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {FaFilter, FaMagnifyingGlass, FaXmark} from "react-icons/fa6";

import {useNomsCommerciaux, useRentalConfig, useTypesCourse, useVehicleList} from "@/hooks/useRental";
import {listerFiltresActifs, type FiltreActif} from "@/helpers/rental";
import EmptyState from "@/components/ui/EmptyState";
import CarteVehicule from "@/components/rental/CarteVehicule";
import BanniereLocation from "@/components/rental/BanniereLocation";
import FiltresVehicules from "@/components/rental/FiltresVehicules";

/**
 * Le catalogue de véhicules.
 *
 * Décalque de l'écran `(rental)/index.tsx` du mobile : un en-tête avec le
 * titre et la recherche, les filtres, puis la liste, une carte par ligne. La
 * grille à deux colonnes ne laissait la place qu'au nom, alors que le nombre
 * de places et le tarif journalier sont ce qui décide d'un choix.
 *
 * Pas de créneau ici. On regarde les voitures d'abord et on choisit ses dates
 * ensuite, sur la fiche : c'est là qu'un prix devient calculable, et c'est le
 * serveur qui le calcule.
 *
 * Le « voir plus » remplace le défilement infini du téléphone : un pied de
 * page suit la liste sur le web, et une liste qui s'allonge toute seule le
 * repousse indéfiniment hors de portée.
 */
export default function PageCatalogue() {
    const [search, setSearch] = useState("");
    const [term, setTerm] = useState("");

    const noms = useNomsCommerciaux();

    // La recherche part au serveur, comme pour les restaurants : on attend que
    // la frappe se calme plutôt que d'appeler à chaque lettre.
    useEffect(() => {
        const minuteur = setTimeout(() => setTerm(search.trim()), 400);

        return () => clearTimeout(minuteur);
    }, [search]);

    const {
        vehicles,
        sourceCount,
        loadedCount,
        isLoading,
        error,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        dispoOnly,
        setDispoOnly,
        sortPrice,
        setSortPrice,
        places,
        setPlaces,
        placesCounts,
        filtres,
        setFiltres,
        hasActiveFilter,
        resetFilters,
    } = useVehicleList(term);

    /*
     * Les choix offerts par les filtres viennent du serveur : communes
     * desservies et types de course s'ouvrent et se ferment en
     * administration, et les ecrire ici demanderait une livraison a chaque
     * changement.
     */
    const {data: configRental} = useRentalConfig();
    const typesCourse = useTypesCourse();

    const [filtresOuverts, setFiltresOuverts] = useState(false);

    /*
     * Un element par filtre pose. Sert au NOMBRE sur l'entonnoir comme aux
     * PASTILLES qui le retirent : une seule source, sinon le compteur finit
     * par annoncer trois au-dessus de deux pastilles.
     */
    const filtresActifs = useMemo(
        () =>
            listerFiltresActifs(
                {dispoOnly, sortPrice, places, filtres},
                {communes: configRental?.towns ?? [], typesCourse},
            ),
        [dispoOnly, sortPrice, places, filtres, configRental?.towns, typesCourse],
    );

    /** Eteindre un filtre, et lui seul. */
    const retirerFiltre = (cle: FiltreActif["cle"]) => {
        if (cle === "dispo") return setDispoOnly(false);
        if (cle === "tri") return setSortPrice(false);
        if (cle === "places") return setPlaces(null);

        // Les quatre derniers vivent dans le meme objet : on n'eteint que la
        // cle visee, les autres restent posees.
        if (cle === "ville") return setFiltres({...filtres, cityId: null});
        if (cle === "communes") return setFiltres({...filtres, townIds: []});
        if (cle === "type") return setFiltres({...filtres, courseTypeId: null});

        return setFiltres({...filtres, proposes: null});
    };

    const enRecherche = term.length > 0;

    return (
        <div className="min-h-svh bg-surface-sunken pt-[calc(var(--header-h)+24px)]">
            <div className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-5">
                <BanniereLocation nom={noms.rental} nombre={sourceCount} />

                {/*
                  * L'entonnoir À CÔTÉ de la recherche, là où le mobile le met
                  * déjà, en bout de sa barre de recherche.
                  */}
                <div className="mb-4 flex items-center gap-3">
                    <label className="relative block flex-1">
                        <span className="sr-only">Rechercher une marque ou un modèle</span>
                        <FaMagnifyingGlass
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle"
                            aria-hidden
                        />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher une marque ou un modèle"
                            className="min-h-12 w-full rounded-pill border border-surface-border bg-surface pl-11 pr-4 text-body text-ink outline-none transition-colors duration-150 focus:border-brand-500"
                        />
                    </label>

                    {/*
                      * La pastille chiffrée n'est pas une décoration : un
                      * catalogue filtré ressemble à un catalogue vide, et sans
                      * elle le client croit qu'il n'y a pas de véhicule.
                      */}
                    <button
                        type="button"
                        onClick={() => setFiltresOuverts(true)}
                        aria-label={
                            filtresActifs.length
                                ? `Filtrer, ${filtresActifs.length} filtres actifs`
                                : "Filtrer"
                        }
                        className={`relative flex min-h-12 min-w-12 items-center justify-center rounded-pill border transition-colors duration-150 ${
                            filtresActifs.length
                                ? "border-brand-500 bg-brand-50 text-brand-600"
                                : "border-surface-border bg-surface text-ink-muted hover:bg-surface-sunken"
                        }`}
                    >
                        <FaFilter aria-hidden />

                        {filtresActifs.length ? (
                            <span
                                className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-pill bg-brand-500 px-1 text-caption font-bold text-ink-inverse"
                                aria-hidden
                            >
                                {filtresActifs.length}
                            </span>
                        ) : null}
                    </button>
                </div>

                {/*
                  * Les filtres posés, retirables un par un SANS rouvrir la
                  * fenêtre — c'est tout l'intérêt. Le compteur ci-dessus et
                  * ces pastilles sortent de la même liste : deux calculs
                  * séparés finiraient par se contredire.
                  */}
                {filtresActifs.length ? (
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        {filtresActifs.map((filtre) => (
                            <button
                                key={filtre.cle}
                                type="button"
                                onClick={() => retirerFiltre(filtre.cle)}
                                aria-label={`Retirer le filtre ${filtre.libelle}`}
                                className="inline-flex min-h-9 items-center gap-2 rounded-pill border border-surface-border bg-surface px-3 text-caption font-semibold text-ink transition-colors duration-150 hover:bg-surface-sunken"
                            >
                                {filtre.libelle}
                                <FaXmark className="text-ink-subtle" aria-hidden />
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={resetFilters}
                            className="ml-1 min-h-9 text-caption font-semibold text-brand-600 underline-offset-4 hover:underline"
                        >
                            Tout afficher
                        </button>
                    </div>
                ) : null}

                <div className="mb-5">
                    <FiltresVehicules
                        ouvert={filtresOuverts}
                        onFermer={() => setFiltresOuverts(false)}
                        dispoOnly={dispoOnly}
                        onToggleDispo={() => setDispoOnly((valeur) => !valeur)}
                        sortPrice={sortPrice}
                        onToggleSort={() => setSortPrice((valeur) => !valeur)}
                        placesCounts={placesCounts}
                        total={loadedCount}
                        places={places}
                        onSelectPlaces={setPlaces}
                        actif={hasActiveFilter}
                        onReset={resetFilters}
                        filtres={filtres}
                        onFiltres={setFiltres}
                        communes={configRental?.towns ?? []}
                        typesCourse={typesCourse}
                    />
                </div>

                <div className="mb-3 flex items-baseline justify-between gap-3">
                    <h2 className="text-title font-bold text-ink">
                        {enRecherche ? "Résultats" : "Tous les véhicules"}
                    </h2>
                    <span className="text-caption text-ink-muted">
                        {vehicles.length} sur {sourceCount}
                    </span>
                </div>

                {isLoading && loadedCount === 0 ? (
                    <div className="flex flex-col gap-4">
                        {Array.from({length: 4}).map((_, rang) => (
                            <div key={rang} className="h-32 animate-pulse rounded-card bg-surface" />
                        ))}
                    </div>
                ) : error ? (
                    <EmptyState
                        title="Chargement impossible"
                        message={(error as Error).message}
                        action={
                            <button
                                type="button"
                                onClick={() => refetch()}
                                className="inline-flex min-h-11 items-center rounded-pill bg-brand-500 px-7 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600"
                            >
                                Réessayer
                            </button>
                        }
                    />
                ) : vehicles.length ? (
                    <>
                        <ul className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
                            {vehicles.map((vehicle) => (
                                <li key={vehicle.uid}>
                                    <CarteVehicule vehicle={vehicle} />
                                </li>
                            ))}
                        </ul>

                        {hasNextPage ? (
                            <div className="mt-6 flex justify-center">
                                <button
                                    type="button"
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    className="inline-flex min-h-11 items-center rounded-pill border border-surface-border bg-surface px-7 text-body font-semibold text-ink transition-colors duration-150 hover:bg-surface-sunken disabled:opacity-60"
                                >
                                    {isFetchingNextPage ? "Chargement…" : "Voir plus de véhicules"}
                                </button>
                            </div>
                        ) : null}
                    </>
                ) : enRecherche ? (
                    <EmptyState
                        title="Aucun véhicule trouvé"
                        message={`Rien ne correspond à « ${term} ».`}
                        action={
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="inline-flex min-h-11 items-center rounded-pill bg-brand-500 px-7 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600"
                            >
                                Effacer la recherche
                            </button>
                        }
                    />
                ) : hasActiveFilter ? (
                    <EmptyState
                        title="Aucun véhicule ne correspond"
                        message="Essayez de retirer un filtre."
                        action={
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="inline-flex min-h-11 items-center rounded-pill bg-brand-500 px-7 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600"
                            >
                                Tout afficher
                            </button>
                        }
                    />
                ) : (
                    <EmptyState
                        title="Aucun véhicule disponible"
                        message="Revenez un peu plus tard, de nouveaux véhicules arrivent."
                        action={
                            <Link
                                href="/restaurant"
                                className="inline-flex min-h-11 items-center rounded-pill border border-surface-border bg-surface px-7 text-body font-semibold text-ink transition-colors duration-150 hover:bg-surface-sunken"
                            >
                                Découvrir les restaurants
                            </Link>
                        }
                    />
                )}
            </div>
        </div>
    );
}
