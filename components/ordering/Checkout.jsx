"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {FaCircleArrowRight} from "react-icons/fa6";
import Spinner from "@/components/Loader/Spinner";
import {API_BASE_URL} from "@/helpers/FetchData";

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
    const {order} = useSelector((state) => state.shop);
    const router = useRouter();

    const handlerCheckPayement = () => {
        if (!order?.data) return;

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
