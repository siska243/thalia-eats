import React from "react";
import Image from "next/image";
import {FaPhone, FaUser} from "react-icons/fa6";

import {RentalChauffeurType} from "@/types/rental";

interface Props {
    /** La plaque de la voiture envoyée, quand le serveur l'a attribuée. */
    plaque?: string | null;
    chauffeur?: RentalChauffeurType | null;
}

/**
 * La voiture qui vient, et la personne qui la conduit.
 *
 * Deux états de la réservation portent ce bloc — confirmée et en cours — et
 * c'est la même chose qu'ils montrent : la plaque pour reconnaître la voiture
 * qui se gare, le nom pour savoir qui descend, le téléphone pour le joindre
 * quand on ne se trouve pas.
 *
 * Le bloc n'existe pas tant qu'il n'y a rien dedans. Le serveur n'envoie la
 * plaque et le chauffeur que sur une course payée : avant, les champs sont
 * absents, et un cadre vide en attente d'une photo laisserait croire à un
 * chargement qui n'arrivera jamais. On ne masque pas des cases, on ne les
 * dessine pas.
 */
export default function BlocChauffeur({plaque, chauffeur}: Props) {
    if (!plaque && !chauffeur) return null;

    const numero = chauffeur?.phone?.replace(/\s+/g, "");

    return (
        <section className="flex flex-col gap-3 rounded-card bg-surface p-4 shadow-card">
            <h2 className="text-caption font-semibold text-ink-muted">
                Votre voiture et votre chauffeur
            </h2>

            {chauffeur ? (
                <div className="flex items-center gap-3">
                    {chauffeur.photo ? (
                        <Image
                            src={chauffeur.photo}
                            alt=""
                            width={48}
                            height={48}
                            className="h-12 w-12 shrink-0 rounded-pill bg-surface-sunken object-cover"
                        />
                    ) : (
                        /* Pas de cadre vide à la place d'une photo absente :
                           une silhouette dit « personne identifiée, sans
                           portrait », une case grise dit « ça charge ». */
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-pill bg-surface-sunken text-ink-muted">
                            <FaUser aria-hidden />
                        </span>
                    )}

                    <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-body font-bold text-ink">
                            {chauffeur.full_name}
                        </p>
                        {chauffeur.phone ? (
                            <p className="text-caption text-ink-muted">{chauffeur.phone}</p>
                        ) : null}
                    </div>

                    {numero ? (
                        <a
                            href={`tel:${numero}`}
                            aria-label={`Appeler ${chauffeur.full_name}`}
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-brand-500 text-ink-inverse transition-colors duration-150 hover:bg-brand-600"
                        >
                            <FaPhone aria-hidden />
                        </a>
                    ) : null}
                </div>
            ) : null}

            {plaque ? (
                <div className="flex items-center justify-between gap-3 rounded-control bg-surface-sunken px-3 py-2.5">
                    <span className="text-caption text-ink-muted">Plaque d’immatriculation</span>
                    <span className="text-body font-bold tracking-[2px] text-ink">{plaque}</span>
                </div>
            ) : null}
        </section>
    );
}
