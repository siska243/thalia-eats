"use client";

import {useSelector} from "react-redux";
import {calcul_price} from "@/helpers/calculePrice";
import {formatPrix} from "@/helpers/openingHours";

/**
 * Le detail du prix.
 *
 * Repris de `components/cart/price-summary.tsx` du mobile, lignes et libelles
 * compris : le meme panier doit se lire pareil sur les deux clients.
 *
 * Les frais de livraison lisaient leur devise dans `data.currency.code`, quand
 * les autres lignes la lisaient dans `data.pricing.currency.code`.
 * `data.currency` n'existe pas : la ligne livraison affichait un montant nu,
 * sans devise, a cote de deux lignes qui en avaient une.
 *
 * Tant qu'aucune commune n'est choisie, la livraison affiche « à confirmer »
 * plutot qu'un zero : zero est un prix, et il serait faux.
 */
const Ligne = ({libelle, valeur, fort}) => (
    <div className="flex items-baseline justify-between gap-3">
        <dt className={fort ? "text-body font-bold text-ink" : "text-body text-ink-muted"}>
            {libelle}
        </dt>
        <dd className={fort ? "text-title font-bold text-ink" : "text-body text-ink"}>
            {valeur}
        </dd>
    </div>
);

export default function Total() {
    const {cart, order} = useSelector((state) => state.shop);

    const chiffrage = order?.data;
    const devise = chiffrage?.pricing?.currency?.code ?? cart?.[0]?.currency?.code;

    const sousTotal = calcul_price(cart ?? []);
    const livraison = chiffrage?.pricing?.frais_livraison ?? null;
    const service = chiffrage?.pricing?.service_price ?? null;

    const livraisonInconnue = !chiffrage;
    const total = chiffrage?.total_price ?? sousTotal;

    return (
        <div className="border-b border-surface-border px-4 py-4 sm:px-5">
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

                <Ligne libelle="Total" valeur={formatPrix(total, devise)} fort />
            </dl>

            {livraisonInconnue ? (
                <p className="mt-2 text-caption text-warning">
                    Les frais de livraison seront confirmés une fois votre adresse
                    renseignée.
                </p>
            ) : null}
        </div>
    );
}
