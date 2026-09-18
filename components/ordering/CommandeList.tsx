"use client";

import Link from "next/link";
import {IoBagCheck} from "react-icons/io5";
import {FaStore} from "react-icons/fa6";
import OrderingDisplay from "@/components/ordering/OrderingDisplay";
import useCart from "@/hooks/useCart";
import {ProductType, ShopType} from "@/types/main";

interface Props {
    ordering: ShopType[];
    removeProduct: (produit: ProductType) => void;
}

/**
 * Le panier.
 *
 * Aligne sur l'ecran panier du mobile : l'en-tete porte « Tout vider », et une
 * ligne rappelle chez quel restaurant on commande avec un raccourci pour y
 * ajouter d'autres plats. Le web obligeait a revenir en arriere par le menu.
 *
 * L'en-tete etait une bande verte de 120 pixels de haut, la seule du site : le
 * vert n'appartient a aucune palette du produit, et cette hauteur fixe mangeait
 * un tiers de l'ecran sur un telephone.
 */
export default function CommandeList({ordering, removeProduct}: Props) {
    const {handleDeleteAll} = useCart();

    const restaurant = ordering?.[0]?.restaurant ?? null;

    return (
        <div className="overflow-hidden rounded-card bg-surface shadow-card">
            <div className="flex items-center gap-3 border-b border-surface-border px-4 py-4 sm:px-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-brand-50 text-xl text-brand-600">
                    <IoBagCheck />
                </span>

                <div className="min-w-0 flex-1">
                    <p className="text-caption text-ink-muted">Votre commande</p>
                    <h2 className="text-title font-bold text-secondaryColor">Panier</h2>
                </div>

                {ordering?.length ? (
                    <button
                        type="button"
                        onClick={handleDeleteAll}
                        className="shrink-0 text-caption font-semibold text-danger"
                    >
                        Tout vider
                    </button>
                ) : null}
            </div>

            {ordering?.length > 0 ? (
                <>
                    {restaurant ? (
                        <Link
                            href={`/restaurant/${restaurant.slug}`}
                            className="flex items-center gap-2.5 border-b border-surface-border px-4 py-3 sm:px-5"
                        >
                            <FaStore className="shrink-0 text-ink-muted" />
                            <span className="line-clamp-1 flex-1 text-caption text-ink">
                                Commande chez{" "}
                                <span className="font-bold">{restaurant.name}</span>
                            </span>
                            <span className="shrink-0 text-caption font-semibold text-brand-600">
                                Ajouter
                            </span>
                        </Link>
                    ) : null}

                    <OrderingDisplay ordering={ordering} removeProduct={removeProduct} />
                </>
            ) : (
                <p className="px-4 py-8 text-center text-body text-ink-muted sm:px-5">
                    Votre panier est vide.
                </p>
            )}
        </div>
    );
}
