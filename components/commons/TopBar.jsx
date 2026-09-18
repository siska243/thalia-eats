"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {useSelector} from "react-redux";
import {FaLocationDot} from "react-icons/fa6";
import {FaHistory, FaShoppingBag} from "react-icons/fa";
import {MdLocalShipping} from "react-icons/md";
import Panier from "../popups/Panier";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import {calcul_price, calcul_quantity} from "@/helpers/calculePrice";
import {formatPrix} from "@/helpers/openingHours";

/**
 * La barre du haut : adresse de livraison a gauche, panier a droite.
 *
 * Elle faisait `if (!mounted) return null`, c'est-a-dire qu'elle n'existait pas
 * au premier rendu. L'en-tete naissait donc court, puis grandissait d'une
 * soixantaine de pixels apres l'hydratation, et toute la page sautait vers le
 * bas. Elle se rend maintenant toujours : seuls les chiffres du panier — qui
 * viennent du stockage local et ne peuvent pas etre connus du serveur —
 * attendent le montage, a zero.
 *
 * Le bloc panier etait aussi peint en `#3C8744`, un vert qui n'appartient a
 * aucune palette du produit.
 */
export default function TopBar() {
    const {user} = useGetCurrentUser();
    const {cart: ordering} = useSelector((state) => state.shop);

    const [monte, setMonte] = useState(false);
    const [showPanier, setShowPanier] = useState(false);

    /*
     * Garde d'hydratation : les chiffres du panier viennent du stockage local,
     * que le serveur ne peut pas connaitre. Les rendre au premier passage
     * provoquerait une divergence entre le HTML du serveur et celui du client.
     *
     * React n'offre pas d'autre primitive pour « suis-je hydrate » : c'est le
     * seul `setState` dans un effet qui reste ici, et il est voulu.
     */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setMonte(true), []);

    useEffect(() => {
        if (!showPanier) return;

        const precedent = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = precedent;
        };
    }, [showPanier]);

    const compte = user?.user;
    const aUneAdresse = Boolean(compte?.street);

    /*
     * Le message d'accueil tenait sur trois lignes sur un telephone et poussait
     * l'en-tete a 169 px de haut, un cinquieme de l'ecran. Le tronquer donnait
     * « Commander en t… », ce qui est pire qu'un vide. Il a donc deux versions :
     * la phrase complete a partir de `sm`, une forme courte en dessous, toutes
     * deux sur une seule ligne.
     */
    const adresse = aUneAdresse ? (
        <span className="flex min-w-0 items-center gap-1.5">
            <FaLocationDot className="shrink-0 text-brand-500" />
            <span className="truncate text-caption text-secondaryColor">
                {compte.street}, N°{compte.number_street}, C/ {compte.town_id?.title}
            </span>
        </span>
    ) : (
        <span className="flex min-w-0 items-center gap-2">
            <span aria-hidden>🌟</span>
            <span className="truncate text-caption text-secondaryColor">
                <span className="hidden sm:inline">Commander en toute sécurité, </span>
                <span className="text-primaryColor">Thalia&nbsp;Eats</span>
            </span>
        </span>
    );

    const quantite = monte ? calcul_quantity(ordering ?? []) : 0;

    return (
        <>
            <div className="flex items-center justify-between gap-3 overflow-hidden border bg-fourthColor pl-3 shadow-sm sm:rounded-xl sm:rounded-t-none sm:pl-5">
                <div className="min-w-0 flex-1">{adresse}</div>

                <div className="flex shrink-0 items-center bg-secondaryColor sm:rounded-xl sm:rounded-t-none">
                    <button
                        type="button"
                        onClick={() => setShowPanier(!showPanier)}
                        aria-label={`Ouvrir le panier (${quantite} article${quantite > 1 ? "s" : ""})`}
                        className="relative flex h-full items-center justify-center p-4 text-white"
                    >
                        <FaShoppingBag className="h-5 w-5" />
                        <span className="pointer-events-none absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-pill bg-brand-500 text-caption font-bold text-ink-inverse">
                            {quantite}
                        </span>
                    </button>

                    <p className="border-l border-white/25 p-3 text-caption text-white md:p-4">
                        {monte && ordering?.length
                            ? formatPrix(
                                  calcul_price(ordering),
                                  ordering[0]?.product?.currency?.code
                              )
                            : "0"}
                    </p>

                    <Link
                        href="/tracking"
                        aria-label="Suivre ma commande"
                        className="flex items-center justify-center border-l border-white/25 p-4 text-white"
                    >
                        <MdLocalShipping className="h-5 w-5" />
                    </Link>

                    <Link
                        href="/historique"
                        aria-label="Historique de mes commandes"
                        className="flex items-center justify-center border-l border-white/25 p-4 text-white"
                    >
                        <FaHistory className="h-5 w-5" />
                    </Link>
                </div>
            </div>

            {showPanier ? <Panier toggleShowPanier={() => setShowPanier(false)} /> : null}
        </>
    );
}
