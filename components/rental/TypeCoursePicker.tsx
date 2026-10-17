"use client";

import React from "react";
import {FaCheck} from "react-icons/fa6";

import {TypeCourse} from "@/hooks/useRental";
import {formatPrix} from "@/helpers/openingHours";

interface Props {
    types: TypeCourse[];
    choisi: TypeCourse | null;
    onChoisir: (type: TypeCourse) => void;
    parking: boolean;
    onParking: (actif: boolean) => void;
    devise?: string;
}

/**
 * Le choix du type de course.
 *
 * Décalque de `type-course-picker.tsx` du mobile, et pour la même raison :
 * **l'écran ne connaît aucun code**. Il affiche ce que le référentiel décrit
 * et obéit aux règles portées par chaque ligne. Un quatrième type créé en
 * administration apparaît ici sans qu'on relivre le site.
 *
 * Une liste verticale et non une bascule : les libellés sont des phrases
 * (« Hors agglomération »), et trois segments côte à côte les tronqueraient.
 *
 * Le parking n'apparaît que si LE TYPE le propose, avec son tarif : une case
 * qui coûte de l'argent doit dire combien avant d'être cochée.
 */
export default function TypeCoursePicker({
    types,
    choisi,
    onChoisir,
    parking,
    onParking,
    devise,
}: Props) {
    if (types.length === 0) return null;

    return (
        <fieldset className="flex flex-col gap-2">
            <legend className="text-caption font-semibold text-ink-muted">Type de course</legend>

            <div className="overflow-hidden rounded-card border border-surface-border bg-surface">
                {types.map((type, rang) => {
                    const actif = choisi?.id === type.id;

                    return (
                        <button
                            key={type.id}
                            type="button"
                            role="radio"
                            aria-checked={actif}
                            onClick={() => onChoisir(type)}
                            className={`flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition-colors duration-150 hover:bg-surface-sunken focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-600 ${
                                rang > 0 ? "border-t border-surface-border" : ""
                            }`}
                        >
                            <span className="flex-1">
                                <span
                                    className={`block text-body ${
                                        actif ? "font-bold text-brand-600" : "text-ink"
                                    }`}
                                >
                                    {type.title}
                                </span>

                                {type.description ? (
                                    <span className="block text-caption text-ink-muted">
                                        {type.description}
                                    </span>
                                ) : null}
                            </span>

                            {actif ? (
                                <FaCheck className="shrink-0 text-brand-600" aria-hidden />
                            ) : null}
                        </button>
                    );
                })}
            </div>

            {choisi?.parking_option ? (
                <label className="flex cursor-pointer items-start gap-3 rounded-control bg-surface-sunken px-3 py-2.5">
                    <input
                        type="checkbox"
                        checked={parking}
                        onChange={(e) => onParking(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-brand-500"
                    />

                    <span className="flex-1">
                        <span className="block text-body text-ink">Entrer dans l’enceinte</span>
                        <span className="block text-caption text-ink-muted">
                            {`Parking facturé ${formatPrix(choisi.parking_hourly_fee, devise)} par heure. Sinon le chauffeur attend à l’extérieur.`}
                        </span>
                    </span>
                </label>
            ) : null}
        </fieldset>
    );
}
