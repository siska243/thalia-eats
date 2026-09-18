"use client";

import Link from "next/link";
import Info from "./Info";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";

/**
 * Le recapitulatif du compte.
 *
 * Les quatre informations etaient alignees en `flex-row` sur desktop, sans
 * limite de largeur : un email long poussait les autres hors du cadre. Une
 * grille leur donne des colonnes egales qui se replient toutes seules.
 */
export default function Information() {
    const {user} = useGetCurrentUser();

    if (!user?.user) {
        return (
            <div className="p-6 text-center">
                <p className="text-body text-ink-muted">
                    Connectez-vous pour voir vos informations.
                </p>
                <Link
                    href="/login"
                    className="mt-4 inline-flex rounded-pill bg-brand-500 px-6 py-3 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600"
                >
                    Se connecter
                </Link>
            </div>
        );
    }

    return (
        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4 lg:p-8">
            <Info titre="Nom complet" content={user.user.full_name} />
            <Info titre="Email" content={user.user.email} />
            <Info titre="Téléphone" content={user.user.phone} />
            <Info titre="Adresse" user={user.user} street />
        </div>
    );
}
