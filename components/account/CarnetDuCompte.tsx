"use client";

import React, {useState} from "react";
import Link from "next/link";

import useAdresses from "@/hooks/useAdresses";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import CarnetAdresses from "@/components/ordering/CarnetAdresses";
import type {AdresseEnregistree} from "@/types/adresse";

/**
 * Le carnet d'adresses, dans « Mon compte ».
 *
 * Il n'existait qu'au moment de commander, caché derrière le crayon de
 * l'adresse de livraison : le propriétaire ne l'a pas trouvé, et il avait
 * raison de chercher ailleurs. Le téléphone le montre dans le compte, c'est
 * là qu'on va pour gérer ses adresses quand on ne commande pas.
 *
 * Il se consulte et se supprime ici ; il s'alimente en commandant, là où
 * l'adresse est de toute façon saisie. Un second formulaire de création
 * aurait fait deux chemins à tenir d'accord pour la même adresse.
 */
export default function CarnetDuCompte() {
    const {user} = useGetCurrentUser();
    const carnet = useAdresses(!!user);
    const [erreur, setErreur] = useState<string | null>(null);

    if (!user) return null;

    const supprimer = async (adresse: AdresseEnregistree) => {
        setErreur(null);

        try {
            await carnet.supprimer.mutateAsync(adresse.slug);
        } catch (e) {
            setErreur((e as Error).message);
        }
    };

    return (
        <section className="rounded-card bg-surface p-5 shadow-card sm:p-6">
            <h2 className="text-title font-bold text-secondaryColor">Mes adresses</h2>
            <p className="mt-1 text-caption text-ink-muted">
                Les adresses que vous avez enregistrées. Elles vous sont proposées au moment de
                commander.
            </p>

            <div className="mt-5">
                {carnet.isLoading ? (
                    <div className="h-20 animate-pulse rounded-card bg-surface-sunken" />
                ) : carnet.adresses.length ? (
                    <CarnetAdresses
                        adresses={carnet.adresses}
                        choisie={null}
                        onChoisir={() => undefined}
                        onSupprimer={supprimer}
                    />
                ) : (
                    <p className="rounded-control bg-surface-sunken px-4 py-3 text-caption text-ink-muted">
                        Aucune adresse enregistrée pour l&apos;instant. Au moment de commander,
                        cochez « Enregistrer cette adresse » et elle apparaîtra ici.
                    </p>
                )}

                {erreur ? (
                    <p
                        role="alert"
                        className="mt-3 rounded-control bg-danger-surface px-4 py-3 text-caption font-semibold text-danger"
                    >
                        {erreur}
                    </p>
                ) : null}
            </div>

            <Link
                href="/ordering"
                className="mt-5 inline-flex min-h-11 items-center text-body font-semibold text-brand-600 underline-offset-4 hover:underline"
            >
                Ajouter une adresse en commandant
            </Link>
        </section>
    );
}
