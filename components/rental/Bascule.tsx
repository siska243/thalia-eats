"use client";

import React from "react";

export interface OngletBascule<T extends string> {
    cle: T;
    libelle: string;
    /** Compteur en pastille. Absent ou nul, rien ne s'affiche. */
    nombre?: number;
    /** Seconde ligne sous le libellé : un tarif, par exemple. */
    detail?: string;
}

interface Props<T extends string> {
    onglets: OngletBascule<T>[];
    choisi: T;
    onChoisir: (cle: T) => void;
    /** Libellé du groupe, lu par les lecteurs d'écran. */
    etiquette: string;
    className?: string;
}

/**
 * Bascule entre deux choix ou plus.
 *
 * Même forme que les onglets de la page Commandes : un fond creux, l'onglet
 * actif en relief, et un compteur qui évite de basculer pour découvrir une
 * liste vide. Elle sert aussi au mode de tarification, où chaque segment porte
 * son prix en seconde ligne. Un second composant aurait fait diverger deux
 * bascules qui doivent se ressembler.
 *
 * Chaque segment fait au moins 44 px de haut : on y tape au doigt.
 */
export default function Bascule<T extends string>({
    onglets,
    choisi,
    onChoisir,
    etiquette,
    className = "",
}: Props<T>) {
    return (
        <div
            role="tablist"
            aria-label={etiquette}
            className={`flex rounded-control bg-surface-sunken p-1 ring-1 ring-surface-border ${className}`}
        >
            {onglets.map((item) => {
                const actif = choisi === item.cle;

                return (
                    <button
                        key={item.cle}
                        type="button"
                        role="tab"
                        aria-selected={actif}
                        onClick={() => onChoisir(item.cle)}
                        className={`flex min-h-11 flex-1 flex-col items-center justify-center rounded-control px-2 py-2 transition-colors duration-150 ${
                            actif ? "bg-surface shadow-card" : "hover:text-ink"
                        }`}
                    >
                        <span className="flex items-center gap-1.5">
                            <span
                                className={`text-body font-bold ${
                                    actif ? "text-ink" : "text-ink-muted"
                                }`}
                            >
                                {item.libelle}
                            </span>

                            {item.nombre ? (
                                <span className="min-w-5 rounded-pill bg-brand-500 px-1.5 text-caption font-bold text-ink-inverse">
                                    {item.nombre}
                                </span>
                            ) : null}
                        </span>

                        {item.detail ? (
                            <span
                                className={`text-caption ${
                                    actif ? "text-brand-700" : "text-ink-subtle"
                                }`}
                            >
                                {item.detail}
                            </span>
                        ) : null}
                    </button>
                );
            })}
        </div>
    );
}
