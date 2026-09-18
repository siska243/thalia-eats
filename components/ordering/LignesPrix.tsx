"use client";

import {formatPrix} from "@/helpers/openingHours";

/**
 * Le detail du prix d'une commande.
 *
 * Extrait de `Total.jsx`, qui lisait le panier dans Redux : la page de
 * paiement d'une pre-commande n'a pas de panier — ses montants sont figes en
 * base — mais le client doit lire exactement les memes lignes, dans le meme
 * ordre et avec les memes libelles. Deux implementations du meme bloc
 * divergeraient, et le client verrait un recapitulatif different selon la
 * porte par laquelle il est entre.
 *
 * `Total.jsx` garde la lecture du panier et ne fait plus que passer ses
 * valeurs ici.
 */
export type LignesPrixProps = {
    sousTotal?: number | null;
    livraison?: number | null;
    service?: number | null;
    total?: number | null;
    devise?: string | null;
    /** Aucune commune choisie : la livraison n'est pas encore chiffree. */
    livraisonInconnue?: boolean;
    /**
     * Le total est le chiffre que le client cherche au moment de payer. Sur la
     * page de paiement il domine ; dans le panier il reste a sa taille
     * d'origine, pour ne rien changer a un ecran qui marche.
     */
    totalDominant?: boolean;
};

const Ligne = ({
    libelle,
    valeur,
    fort,
    dominant,
}: {
    libelle: string;
    valeur: string;
    fort?: boolean;
    dominant?: boolean;
}) => (
    <div className="flex items-baseline justify-between gap-3">
        <dt
            className={
                fort
                    ? `font-bold text-ink ${dominant ? "text-title" : "text-body"}`
                    : "text-body text-ink-muted"
            }
        >
            {libelle}
        </dt>
        <dd
            className={
                fort
                    ? `font-bold text-ink ${dominant ? "text-display" : "text-title"}`
                    : "text-body text-ink"
            }
        >
            {valeur}
        </dd>
    </div>
);

export default function LignesPrix({
    sousTotal,
    livraison,
    service,
    total,
    devise,
    livraisonInconnue = false,
    totalDominant = false,
}: LignesPrixProps) {
    return (
        <>
            <dl className="flex flex-col gap-2">
                <Ligne libelle="Sous-total" valeur={formatPrix(sousTotal, devise)} />

                <Ligne
                    libelle="Livraison"
                    valeur={
                        livraisonInconnue ? "à confirmer" : formatPrix(livraison ?? 0, devise)
                    }
                />

                {service ? (
                    <Ligne libelle="Frais de service" valeur={formatPrix(service, devise)} />
                ) : null}

                <div className="my-1 h-px bg-surface-border" />

                <Ligne
                    libelle="Total"
                    valeur={formatPrix(total, devise)}
                    fort
                    dominant={totalDominant}
                />
            </dl>

            {livraisonInconnue ? (
                <p className="mt-2 text-caption text-warning">
                    Les frais de livraison seront confirmés une fois votre adresse
                    renseignée.
                </p>
            ) : null}
        </>
    );
}
