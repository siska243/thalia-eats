"use client";

import React, {useEffect, useRef, useState} from "react";
import {FaChevronDown} from "react-icons/fa6";

import {FiltresCatalogue} from "@/helpers/Route";
import {PALIERS_PLACES} from "@/helpers/rental";
import {TypeCourse} from "@/types/rental";

interface Props {
    dispoOnly: boolean;
    onToggleDispo: () => void;
    sortPrice: boolean;
    onToggleSort: () => void;
    placesCounts: Record<number, number>;
    /** Nombre de véhicules chargés, pour l'option « toutes ». */
    total: number;
    places: number | null;
    onSelectPlaces: (places: number | null) => void;
    actif: boolean;
    onReset: () => void;
    /*
     * Les filtres que le SERVEUR applique : ville, communes, type de course
     * et mode proposé. Les trois du dessus trient ce qui est déjà descendu ;
     * ceux-ci changent la requête.
     */
    filtres: FiltresCatalogue;
    onFiltres: (filtres: FiltresCatalogue) => void;
    communes: {id: number; title: string}[];
    typesCourse: TypeCourse[];
}

/** Un champ étiqueté, au même gabarit pour tous les filtres de la barre. */
const Champ = ({
    label,
    htmlFor,
    children,
}: {
    label: string;
    htmlFor?: string;
    children: React.ReactNode;
}) => (
    <div className="flex min-w-0 flex-col gap-1.5">
        <label htmlFor={htmlFor} className="text-caption font-semibold text-ink-muted">
            {label}
        </label>
        {children}
    </div>
);

/** Le gabarit commun aux listes déroulantes et au bouton des communes. */
const CONTROLE =
    "min-h-11 w-full rounded-control border border-surface-border bg-surface px-3 text-body text-ink outline-none transition-colors duration-150 focus:border-brand-500";

/**
 * Les communes, à plusieurs, dans un menu qui se replie.
 *
 * Un `<select multiple>` natif affiche toutes ses lignes d'un bloc et se
 * manipule à la souris avec la touche Ctrl : sur vingt-quatre communes, il
 * occupe l'écran et personne ne devine comment en cocher deux. Un bouton qui
 * ouvre une liste de cases donne le même service sans rien demander
 * d'apprendre, et garde la hauteur d'un champ quand il est fermé.
 */
const SelectCommunes = ({
    communes,
    choisies,
    onBasculer,
    onVider,
}: {
    communes: {id: number; title: string}[];
    choisies: number[];
    onBasculer: (id: number) => void;
    onVider: () => void;
}) => {
    const [ouvert, setOuvert] = useState(false);
    const conteneur = useRef<HTMLDivElement>(null);

    // Un menu qui ne se referme qu'avec son propre bouton reste ouvert
    // derrière le reste de la page dès qu'on clique ailleurs.
    useEffect(() => {
        if (!ouvert) return;

        const dehors = (evenement: MouseEvent) => {
            if (!conteneur.current?.contains(evenement.target as Node)) setOuvert(false);
        };

        const echap = (evenement: KeyboardEvent) => {
            if (evenement.key === "Escape") setOuvert(false);
        };

        document.addEventListener("mousedown", dehors);
        document.addEventListener("keydown", echap);

        return () => {
            document.removeEventListener("mousedown", dehors);
            document.removeEventListener("keydown", echap);
        };
    }, [ouvert]);

    const resume =
        choisies.length === 0
            ? "Toutes les communes"
            : choisies.length === 1
              ? (communes.find((commune) => commune.id === choisies[0])?.title.trim() ??
                "1 commune")
              : `${choisies.length} communes`;

    return (
        <div ref={conteneur} className="relative">
            <button
                type="button"
                onClick={() => setOuvert((valeur) => !valeur)}
                aria-expanded={ouvert}
                aria-haspopup="listbox"
                className={`${CONTROLE} flex items-center justify-between gap-2 text-left`}
            >
                <span className="truncate">{resume}</span>
                <FaChevronDown
                    aria-hidden
                    className={`shrink-0 text-ink-subtle transition-transform duration-150 ${
                        ouvert ? "rotate-180" : ""
                    }`}
                />
            </button>

            {ouvert ? (
                <div
                    role="listbox"
                    aria-multiselectable
                    className="absolute left-0 right-0 z-20 mt-1 max-h-72 overflow-y-auto rounded-control border border-surface-border bg-surface py-1 shadow-raised"
                >
                    {choisies.length ? (
                        <button
                            type="button"
                            onClick={onVider}
                            className="block w-full px-3 py-2 text-left text-caption font-semibold text-brand-600 hover:bg-surface-sunken"
                        >
                            Toutes les communes
                        </button>
                    ) : null}

                    {communes.map((commune) => (
                        <label
                            key={commune.id}
                            className="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-body text-ink hover:bg-surface-sunken"
                        >
                            <input
                                type="checkbox"
                                checked={choisies.includes(commune.id)}
                                onChange={() => onBasculer(commune.id)}
                                className="h-4 w-4 rounded border-surface-border text-brand-500 focus:ring-brand-500"
                            />
                            <span className="truncate">{commune.title.trim()}</span>
                        </label>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

/**
 * Les filtres du catalogue de location.
 *
 * Le propriétaire, le 17 octobre : « dans le filtre de Trans, il faut que le
 * filtre soit dans le select et non les empiler comme ça, c'est pas pro ».
 *
 * Ils étaient en effet une file de pastilles qui passait à la ligne : sur un
 * parc à plusieurs communes et plusieurs types de course, elle occupait trois
 * rangées avant la première voiture, et rien ne disait où s'arrêtait un
 * critère et où commençait le suivant. Chaque critère est maintenant un champ
 * étiqueté, au gabarit des listes déroulantes déjà utilisées ailleurs sur le
 * site.
 *
 * Les communes gardent leur choix multiple, demandé explicitement : elles
 * passent par un menu à cases plutôt que par un `<select multiple>` natif,
 * illisible au-delà de quelques lignes.
 *
 * « Libres maintenant » et « Moins cher d'abord » restent des interrupteurs :
 * ce sont des oui/non, et les déguiser en listes de deux options ferait
 * cliquer deux fois pour cocher une case.
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
        <div className="flex flex-col gap-4 rounded-card bg-surface p-4 shadow-card">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Champ label="Se loue" htmlFor="filtre-propose">
                    {/*
                      * « Se loue » interroge ce que le véhicule PROPOSE, pas
                      * comment il est chiffré : un véhicule sans tarif
                      * journalier reste affiché à l'heure, il ne doit pas
                      * pour autant disparaître du filtre « à l'heure ».
                      */}
                    <select
                        id="filtre-propose"
                        className={CONTROLE}
                        value={filtres.proposes ?? ""}
                        onChange={(e) =>
                            onFiltres({
                                ...filtres,
                                proposes: (e.target.value || null) as "hourly" | "daily" | null,
                            })
                        }
                    >
                        <option value="">À l’heure ou à la journée</option>
                        <option value="hourly">À l’heure</option>
                        <option value="daily">À la journée</option>
                    </select>
                </Champ>

                {/* Un champ sans valeur ne s'affiche pas : proposer un filtre
                    vide laisse croire à une panne. */}
                {typesCourse.length ? (
                    <Champ label="Type de course" htmlFor="filtre-type">
                        <select
                            id="filtre-type"
                            className={CONTROLE}
                            value={filtres.courseTypeId ?? ""}
                            onChange={(e) =>
                                onFiltres({
                                    ...filtres,
                                    courseTypeId: e.target.value ? Number(e.target.value) : null,
                                })
                            }
                        >
                            <option value="">Tous les types</option>
                            {typesCourse.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.title}
                                </option>
                            ))}
                        </select>
                    </Champ>
                ) : null}

                {communes.length ? (
                    <Champ label="Communes desservies">
                        <SelectCommunes
                            communes={communes}
                            choisies={communesChoisies}
                            onBasculer={basculerCommune}
                            onVider={() => onFiltres({...filtres, townIds: []})}
                        />
                    </Champ>
                ) : null}

                <Champ label="Nombre de personnes" htmlFor="filtre-places">
                    {/*
                      * Le libellé dit « 2 » et le filtre rend les véhicules
                      * de 2 personnes ET PLUS : c'est ce qui a été demandé,
                      * le comportement derrière ne change pas.
                      */}
                    <select
                        id="filtre-places"
                        className={CONTROLE}
                        value={places ?? ""}
                        onChange={(e) =>
                            onSelectPlaces(e.target.value ? Number(e.target.value) : null)
                        }
                    >
                        <option value="">Tout le parc ({total})</option>
                        {PALIERS_PLACES.map((palier) => (
                            <option key={palier} value={palier}>
                                {palier} personnes ({placesCounts[palier] ?? 0})
                            </option>
                        ))}
                    </select>
                </Champ>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {/* Deux oui/non : des cases, et non des listes de deux
                    options qui demanderaient deux clics pour en cocher une. */}
                <label className="flex cursor-pointer items-center gap-2 text-body text-ink">
                    <input
                        type="checkbox"
                        checked={dispoOnly}
                        onChange={onToggleDispo}
                        className="h-4 w-4 rounded border-surface-border text-brand-500 focus:ring-brand-500"
                    />
                    Libres maintenant
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-body text-ink">
                    <input
                        type="checkbox"
                        checked={sortPrice}
                        onChange={onToggleSort}
                        className="h-4 w-4 rounded border-surface-border text-brand-500 focus:ring-brand-500"
                    />
                    Moins cher d’abord
                </label>

                {actif ? (
                    <button
                        type="button"
                        onClick={onReset}
                        className="ml-auto min-h-11 text-caption font-semibold text-brand-600 underline-offset-4 hover:underline"
                    >
                        Tout afficher
                    </button>
                ) : null}
            </div>
        </div>
    );
}
