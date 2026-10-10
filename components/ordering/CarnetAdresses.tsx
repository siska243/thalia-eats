"use client";

import React from "react";
import {FiHome, FiMapPin, FiTrash2} from "react-icons/fi";

import type {AdresseEnregistree} from "@/types/adresse";

interface Props {
    adresses: AdresseEnregistree[];
    /** Le slug de celle qui est choisie, ou rien. */
    choisie?: string | null;
    onChoisir: (adresse: AdresseEnregistree) => void;
    onSupprimer: (adresse: AdresseEnregistree) => void;
}

/**
 * Le carnet d'adresses, au moment de commander.
 *
 * Le site faisait ressaisir l'adresse à chaque commande alors que le serveur
 * la gardait et que le téléphone l'affichait : même client, même compte, deux
 * expériences. Décalqué de `SavedAddressList` du mobile, y compris la maison
 * pour l'adresse principale, qui se reconnaît d'un coup d'œil.
 *
 * Une seule ligne par adresse, cible d'au moins 44 px : c'est un écran qu'on
 * utilise au téléphone, souvent debout.
 */
export default function CarnetAdresses({adresses, choisie, onChoisir, onSupprimer}: Props) {
    if (!adresses.length) return null;

    return (
        <div className="flex flex-col gap-2">
            <p className="text-caption font-semibold text-ink">Vos adresses</p>

            <ul className="flex flex-col gap-2">
                {adresses.map((adresse) => {
                    const active = adresse.slug === choisie;

                    return (
                        <li key={adresse.slug}>
                            <div
                                className={`flex items-center gap-3 rounded-card border bg-surface p-3 transition-colors duration-150 ${
                                    active ? "border-brand-500" : "border-surface-border"
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => onChoisir(adresse)}
                                    aria-pressed={active}
                                    className="flex min-h-11 flex-1 items-center gap-3 text-left"
                                >
                                    <span
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-pill ${
                                            active ? "bg-brand-50 text-brand-600" : "bg-surface-sunken text-ink-muted"
                                        }`}
                                    >
                                        {adresse.is_main ? <FiHome /> : <FiMapPin />}
                                    </span>

                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-body font-bold text-ink">
                                            {adresse.label ?? adresse.town?.title?.trim() ?? "Adresse"}
                                        </span>
                                        <span className="block truncate text-caption text-ink-muted">
                                            {adresse.adresse}
                                        </span>
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onSupprimer(adresse)}
                                    aria-label={`Supprimer ${adresse.label ?? adresse.adresse}`}
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill text-ink-subtle transition-colors duration-150 hover:bg-danger-surface hover:text-danger"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
