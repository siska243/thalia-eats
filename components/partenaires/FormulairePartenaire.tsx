"use client";

import React, {useState} from "react";
import Link from "next/link";
import {AxiosError} from "axios";

import ChampTexte from "@/components/auth/ChampTexte";
import Button from "@/components/ui/Button";
import {FetchData} from "@/helpers/FetchData";
import {Route} from "@/helpers/Route";

export type TypePartenaire = "restaurant" | "livreur";

export interface ChampPartenaire {
    nom: string;
    label: string;
    placeholder?: string;
    aide?: string;
    type?: string;
    requis?: boolean;
    /** Une liste fermee plutot qu'un texte libre : la prospection se trie. */
    options?: string[];
    /** Un champ long occupe toute la largeur. */
    long?: boolean;
}

interface Props {
    type: TypePartenaire;
    titre: string;
    accroche: string;
    /** Ce que la société fera de la demande, dit avant d'être rempli. */
    promesse: string;
    champs: ChampPartenaire[];
}

/**
 * Le formulaire de prospection, partagé par les deux pages partenaires.
 *
 * Ce n'est **pas une inscription** : rien n'est créé, aucun compte n'est
 * ouvert, aucun accès n'est donné. C'est une prise de contact, et la société
 * rappelle. Les deux boutons de la page d'accueil, « Commencer comme
 * restaurant » et « Roulez avec nous », pointaient sur `/` : ils promettaient
 * une suite qui n'existait pas.
 *
 * Les deux métiers ne demandent pas la même chose, mais ils demandent la même
 * chose au même endroit : un seul formulaire, deux listes de champs. Les
 * écrire deux fois aurait fait diverger la validation, le message d'erreur et
 * l'état de succès au premier ajustement.
 *
 * Le téléphone est le seul champ vraiment obligatoire avec le nom : à
 * Kinshasa, c'est par là que le rappel se fera, et exiger une adresse e-mail
 * ferait perdre des restaurants qui n'en utilisent pas.
 */
export default function FormulairePartenaire({type, titre, accroche, promesse, champs}: Props) {
    const [valeurs, setValeurs] = useState<Record<string, string>>({});
    const [erreur, setErreur] = useState<string | null>(null);
    const [envoi, setEnvoi] = useState(false);
    const [envoye, setEnvoye] = useState(false);

    const poser = (nom: string, valeur: string) => {
        setErreur(null);
        setValeurs((actuelles) => ({...actuelles, [nom]: valeur}));
    };

    const envoyer = async (e: React.FormEvent) => {
        e.preventDefault();
        setErreur(null);

        // Un garde qui arrête doit toujours poser un message : un bouton muet
        // se lit comme une panne.
        const manquant = champs.find(
            (champ) => champ.requis && !(valeurs[champ.nom] ?? "").trim(),
        );

        if (manquant) {
            setErreur(`Renseignez « ${manquant.label} » pour que nous puissions vous rappeler.`);
            return;
        }

        setEnvoi(true);

        try {
            const reponse = await FetchData.sendData(Route.prospect_partenaire, {
                type,
                ...valeurs,
            });

            // Les erreurs axios sont RETOURNÉES par FetchData, jamais levées.
            if (reponse instanceof AxiosError || reponse?.name === "AxiosError") {
                setErreur(
                    reponse?.response?.data?.message ??
                        "Votre demande n'a pas pu être envoyée. Réessayez dans un instant.",
                );
                return;
            }

            setEnvoye(true);
        } finally {
            setEnvoi(false);
        }
    };

    if (envoye) {
        return (
            <div className="rounded-card bg-surface p-8 text-center shadow-card">
                <h2 className="text-heading font-extrabold text-ink">Demande envoyée</h2>

                <p className="mx-auto mt-3 max-w-md text-body leading-7 text-ink-muted">
                    {promesse} Gardez votre téléphone à portée de main.
                </p>

                <Link
                    href="/"
                    className="mt-7 inline-flex justify-center rounded-pill bg-brand-500 px-6 py-3.5 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600"
                >
                    Revenir à l&apos;accueil
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={envoyer} className="rounded-card bg-surface p-6 shadow-card sm:p-8">
            <h1 className="text-display font-extrabold text-secondaryColor">{titre}</h1>
            <p className="mt-3 text-body leading-7 text-ink-muted">{accroche}</p>

            <p className="mt-4 rounded-control bg-surface-sunken px-4 py-3 text-caption text-ink-muted">
                {promesse}
            </p>

            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {champs.map((champ) => {
                    const classe = champ.long ? "sm:col-span-2" : "";

                    if (champ.options) {
                        return (
                            <div key={champ.nom} className={`flex flex-col ${classe}`}>
                                <label
                                    htmlFor={`champ-${champ.nom}`}
                                    className="mb-2 text-caption font-semibold text-ink"
                                >
                                    {champ.label}
                                </label>

                                <select
                                    id={`champ-${champ.nom}`}
                                    value={valeurs[champ.nom] ?? ""}
                                    onChange={(e) => poser(champ.nom, e.target.value)}
                                    required={champ.requis}
                                    className="w-full rounded-control border border-surface-border bg-surface px-4 py-3 text-body text-ink outline-none transition-colors duration-150 focus:border-brand-500"
                                >
                                    <option value="">Choisir</option>
                                    {champ.options.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>

                                {champ.aide ? (
                                    <p className="mt-1.5 text-caption text-ink-muted">
                                        {champ.aide}
                                    </p>
                                ) : null}
                            </div>
                        );
                    }

                    return (
                        <ChampTexte
                            key={champ.nom}
                            className={classe}
                            label={champ.label}
                            type={champ.type ?? "text"}
                            placeholder={champ.placeholder}
                            aide={champ.aide}
                            required={champ.requis}
                            value={valeurs[champ.nom] ?? ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                poser(champ.nom, e.target.value)
                            }
                        />
                    );
                })}
            </div>

            {erreur ? (
                <p
                    role="alert"
                    className="mt-5 rounded-control bg-danger-surface px-4 py-3 text-caption font-semibold text-danger"
                >
                    {erreur}
                </p>
            ) : null}

            <div className="mt-7">
                <Button
                    type="submit"
                    label={envoi ? "Envoi en cours…" : "Envoyer ma demande"}
                    loading={envoi}
                    full
                />
            </div>

            <p className="mt-4 text-caption text-ink-subtle">
                Vos coordonnées servent uniquement à vous rappeler au sujet de ce partenariat.
            </p>
        </form>
    );
}
