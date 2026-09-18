"use client";

import {useSelector} from "react-redux";
import LignesPrix from "./LignesPrix";
import {calcul_price} from "@/helpers/calculePrice";

/**
 * Le detail du prix du panier.
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
 *
 * Le rendu des lignes vit maintenant dans `LignesPrix` : la page de paiement
 * d'une pre-commande affiche le meme bloc a partir de montants figes en base,
 * sans panier ni Redux. Ce composant-ci garde la lecture du panier.
 */
export default function Total() {
    const {cart, order} = useSelector((state) => state.shop);

    const chiffrage = order?.data;
    const devise = chiffrage?.pricing?.currency?.code ?? cart?.[0]?.currency?.code;

    const sousTotal = calcul_price(cart ?? []);

    return (
        <div className="border-b border-surface-border px-4 py-4 sm:px-5">
            <LignesPrix
                sousTotal={sousTotal}
                livraison={chiffrage?.pricing?.frais_livraison ?? null}
                service={chiffrage?.pricing?.service_price ?? null}
                total={chiffrage?.total_price ?? sousTotal}
                devise={devise}
                livraisonInconnue={!chiffrage}
            />
        </div>
    );
}
