"use client";

import React from "react";

import {FiltresCatalogue} from "@/helpers/Route";
import {PALIERS_PLACES} from "@/helpers/rental";
import {TypeCourse} from "@/types/rental";

interface Props {
    dispoOnly: boolean;
    onToggleDispo: () => void;
    sortPrice: boolean;
    onToggleSort: () => void;
    placesCounts: Record<number, number>;
    /** Nombre de véhicules chargés, pour la puce « Toutes ». */
    total: number;
    places: number | null;
    onSelectPlaces: (places: number | null) => void;
    actif: boolean;
    onReset: () => void;
    /*
     * Les filtres que le SERVEUR applique : ville, communes, type de course
     * et mode propose. Les trois du dessus trient ce qui est deja descendu ;
     * ceux-ci changent la requete.
     */
    filtres: FiltresCatalogue;
    onFiltres: (filtres: FiltresCatalogue) => void;
    communes: {id: number; title: string}[];
    typesCourse: TypeCourse[];
}

interface PropsPuce {
    libelle: string;
    /** Compteur affiché dans la puce. Absent, la puce n'en porte pas. */
    nombre?: number;
    actif: boolean;
    onClick: () => void;
}

const Puce = ({libelle, nombre, actif, onClick}: PropsPuce) => (
    <button
        type="button"
        onClick={onClick}
        aria-pressed={actif}
        className={`inline-flex min-h-11 items-center gap-1.5 rounded-pill border px-3.5 text-caption font-semibold transition-colors duration-150 ${
            actif
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-surface-border bg-surface text-ink-muted hover:bg-surface-sunken"
        }`}
    >
        {libelle}

        {nombre === undefined ? null : (
            <span
                className={`min-w-4 rounded-pill px-1 text-[11px] font-bold ${
                    actif ? "bg-brand-500 text-ink-inverse" : "bg-surface-sunken text-ink-subtle"
                }`}
            >
                {nombre}
            </span>
        )}
    </button>
);

/**
 * Les filtres du catalogue.
 *
 * Les mêmes trois critères que le mobile — libres seulement, moins cher
 * d'abord, nombre de places — et le même comptage par palier : le parc est
 * petit et très inégal, et un compteur évite de filtrer dans le vide sans le
 * savoir.
 *
 * Rangés dans une feuille sur le téléphone, ils tiennent ici sur une ligne qui
 * passe à la ligne : un navigateur a la largeur que l'application n'avait pas,
 * et une fenêtre modale pour trois interrupteurs se refermerait plus souvent
 * qu'elle ne servirait.
 *
 * Un palier sans véhicule reste proposé, mais s'annonce comme tel plutôt que
 * de renvoyer une liste vide sans explication.
 */
export default function FiltresVehicules({
    dispoOnly,
    onToggleDispo,
    sortPrice,
    onToggleSort,
    placesCounts,
    total,
    places,
    onSelectPlaces,
    actif,
    onReset,
    filtres,
    onFiltres,
    communes,
    typesCourse,
}: Props) {
    const communesChoisies = filtres.townIds ?? [];

    const basculerCommune = (id: number) =>
        onFiltres({
            ...filtres,
            townIds: communesChoisies.includes(id)
                ? communesChoisies.filter((autre) => autre !== id)
                : [...communesChoisies, id],
        });

    return (
        <div className="flex flex-wrap items-center gap-2">
            <Puce libelle="Libres maintenant" actif={dispoOnly} onClick={onToggleDispo} />
            <Puce libelle="Moins cher d’abord" actif={sortPrice} onClick={onToggleSort} />

            <span className="mx-1 hidden h-6 w-px bg-surface-border sm:block" />

            <Puce
                libelle="Tout le parc"
                nombre={total}
                actif={places === null}
                onClick={() => onSelectPlaces(null)}
            />

            {PALIERS_PLACES.map((palier) => (
                <Puce
                    key={palier}
                    libelle={`${palier} personnes`}
                    nombre={placesCounts[palier] ?? 0}
                    actif={places === palier}
                    onClick={() => onSelectPlaces(places === palier ? null : palier)}
                />
            ))}

            <span className="hidden h-6 w-px bg-surface-border sm:block" aria-hidden />

            {/*
              * « Se loue » interroge ce que le vehicule PROPOSE, pas comment
              * il est chiffre : un vehicule sans tarif journalier reste
              * affiche a l'heure, il ne doit pas pour autant disparaitre du
              * filtre « a l'heure ».
              *
              * Un second clic eteint la puce : c'est la seule facon de
              * revenir en arriere sans ajouter un bouton « tous » sur chaque
              * bande.
              */}
            <Puce
                libelle="À l’heure"
                actif={filtres.proposes === "hourly"}
                onClick={() =>
                    onFiltres({
                        ...filtres,
                        proposes: filtres.proposes === "hourly" ? null : "hourly",
                    })
                }
            />
            <Puce
                libelle="À la journée"
                actif={filtres.proposes === "daily"}
                onClick={() =>
                    onFiltres({
                        ...filtres,
                        proposes: filtres.proposes === "daily" ? null : "daily",
                    })
                }
            />

            {/* Une bande sans valeur ne s'affiche pas : proposer un filtre
              * vide laisse croire a une panne. */}
            {typesCourse.length ? (
                <>
                    <span className="hidden h-6 w-px bg-surface-border sm:block" aria-hidden />

                    {typesCourse.map((type) => (
                        <Puce
                            key={type.id}
                            libelle={type.title}
                            actif={filtres.courseTypeId === type.id}
                            onClick={() =>
                                onFiltres({
                                    ...filtres,
                                    courseTypeId:
                                        filtres.courseTypeId === type.id ? null : type.id,
                                })
                            }
                        />
                    ))}
                </>
            ) : null}

            {/* Les communes se cochent a PLUSIEURS, a la demande du
              * proprietaire : on cherche rarement dans une seule. */}
            {communes.length ? (
                <>
                    <span className="hidden h-6 w-px bg-surface-border sm:block" aria-hidden />

                    {communes.map((commune) => (
                        <Puce
                            key={commune.id}
                            libelle={commune.title.trim()}
                            actif={communesChoisies.includes(commune.id)}
                            onClick={() => basculerCommune(commune.id)}
                        />
                    ))}
                </>
            ) : null}

            {actif ? (
                <button
                    type="button"
                    onClick={onReset}
                    className="min-h-11 px-2 text-caption font-semibold text-brand-600 underline-offset-4 hover:underline"
                >
                    Tout afficher
                </button>
            ) : null}
        </div>
    );
}
