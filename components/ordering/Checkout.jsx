"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {FaCircleArrowRight} from "react-icons/fa6";
import Spinner from "@/components/Loader/Spinner";
import {API_BASE_URL} from "@/helpers/FetchData";
import {calcul_price} from "@/helpers/calculePrice";
import {formatPrix} from "@/helpers/openingHours";
import useDefaultData from "@/hooks/useCommandeData";

/**
 * Le passage au paiement.
 *
 * Deux corrections :
 *
 * - `callback_url` — l'adresse a laquelle FlexPay notifie le resultat du
 *   paiement — etait ecrite en dur sur `https://thalia.cooceckivu.org`,
 *   l'ancien domaine du backend. Un webhook envoye a la mauvaise machine ne
 *   revient jamais, et la commande reste en attente de reglement pour
 *   toujours. Elle est deduite de `API_BASE_URL`, la meme adresse que toutes
 *   les autres requetes.
 * - le composant lisait `window.location.origin` dans son corps. Une page
 *   « use client » est quand meme rendue une fois sur le serveur, ou `window`
 *   n'existe pas : la page ne tenait que parce qu'un ecran de chargement
 *   passait devant au premier rendu. Les URLs sont maintenant construites au
 *   moment du clic, cote navigateur.
 *
 * Le rendu etait enfin duplique dans une condition `isLargeScreen ? A : B` ou
 * A et B etaient identiques, au caractere pres.
 */
export default function Checkout() {
    const [loading, setLoading] = useState(false);
    const {order, cart} = useSelector((state) => state.shop);
    const {data: defaut} = useDefaultData();
    const router = useRouter();

    /*
     * Le panier minimum, decide en administration et servi par /default
     * sous `reglages.montant_minimum_commande`. Zero signifie « aucun
     * minimum », et c'est aussi le repli tant que la reponse n'est pas la :
     * on ne bloque pas une commande sur une supposition.
     *
     * La comparaison porte sur le TOTAL GENERAL, livraison et service
     * compris, comme cote serveur depuis l'arbitrage du 28 octobre : « non
     * pas sous-total mais le total general ». Le total vient du chiffrage du
     * SERVEUR, deja recu avec l'adresse confirmee — pas d'une somme
     * recalculee ici, qui pourrait differer de celle qui fait foi.
     */
    const montantMinimum = Number(defaut?.reglages?.montant_minimum_commande ?? 0) || 0;
    const total = Number(order?.data?.total_price ?? calcul_price(cart ?? [])) || 0;
    const devise = order?.data?.pricing?.currency?.code ?? cart?.[0]?.currency?.code;
    const sousLeMinimum = montantMinimum > 0 && total < montantMinimum;

    const handlerCheckPayement = () => {
        if (!order?.data || sousLeMinimum) return;

        setLoading(true);

        const origine = window.location.origin;

        const donnees = {
            success_url: `${origine}/payement/success`,
            error_url: `${origine}/payement/error`,
            cancel_url: `${origine}/payement/cancel`,
            webhook_sse_url: `${origine}/api/events`,
            callback_url: `${API_BASE_URL}/webhook-paiement-flexpay`,
            order: order.data,
        };

        router.push("/checkout?params=" + btoa(JSON.stringify(donnees)));
    };

    if (!order?.data?.adresse?.town?.slug) {
        return (
            <div className="p-5">
                <p className="rounded-control bg-warning-surface px-4 py-3 text-caption font-semibold text-warning">
                    Confirmez votre adresse de livraison pour continuer.
                </p>
            </div>
        );
    }

    /*
     * Le blocage se pose ICI, apres l'adresse confirmee et le prix calcule :
     * c'est le moment ou le client s'engage. Le panier, lui, se contente de
     * prevenir.
     */
    if (sousLeMinimum) {
        return (
            <div className="p-5">
                <p className="rounded-control bg-warning-surface px-4 py-3 text-caption font-semibold text-warning">
                    {`Commande à partir de ${formatPrix(montantMinimum, devise)}, livraison comprise. Il vous manque ${formatPrix(montantMinimum - total, devise)} pour continuer.`}
                </p>
            </div>
        );
    }

    return (
        <div className="p-5">
            <button
                type="button"
                onClick={handlerCheckPayement}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-pill bg-brand-500 px-6 py-4 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        <FaCircleArrowRight />
                        Passer au paiement
                    </>
                )}
            </button>
        </div>
    );
}
