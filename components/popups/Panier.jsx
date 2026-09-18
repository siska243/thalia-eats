"use client";

import Link from "next/link";
import {useSelector} from "react-redux";
import {FaCircleArrowRight} from "react-icons/fa6";
import Modal from "./Modal";
import PanierItems from "./PanierItems";
import useCreateOrdering from "@/hooks/useCreateOrdering";
import useCart from "@/hooks/useCart";
import {formatPrix} from "@/helpers/openingHours";

/**
 * Le panier en surcouche.
 *
 * La liste des plats etait haute de `h-[200px] md:[300px]`. La seconde classe
 * n'existe pas — il manque la propriete, Tailwind ne genere rien — donc la
 * liste restait bloquee a 200 pixels sur tous les ecrans, y compris sur un
 * moniteur de bureau.
 *
 * Trois conteneurs imbriques portaient `overflow-y-scroll`, qui affiche une
 * barre de defilement meme quand il n'y a rien a faire defiler : on voyait
 * jusqu'a trois barres empilees pour un seul plat. `overflow-y-auto` ne
 * l'affiche que lorsqu'elle sert.
 */
export default function Panier({toggleShowPanier}) {
    const {calculateTotalPrice} = useCreateOrdering();
    const {cart: ordering} = useSelector((state) => state.shop);
    const {handleAddProductCart, handleRemoveProduct} = useCart();

    if (!ordering?.length) {
        return (
            <Modal toggleModal={toggleShowPanier}>
                <div className="px-6 py-10 text-center">
                    <p className="text-body text-ink-muted">Votre panier est vide.</p>

                    <Link
                        href="/restaurant"
                        onClick={toggleShowPanier}
                        className="mt-5 inline-flex rounded-pill bg-brand-500 px-7 py-3 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600"
                    >
                        Voir les restaurants
                    </Link>
                </div>
            </Modal>
        );
    }

    const devise = ordering[0]?.product?.currency?.code ?? ordering[0]?.currency?.code;

    return (
        <Modal toggleModal={toggleShowPanier}>
            <div className="flex max-h-[85svh] w-full flex-col rounded-card bg-surface">
                <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                    <h2 className="mb-4 text-title font-bold text-secondaryColor">
                        Les plats dans votre panier
                    </h2>

                    <div className="flex flex-col gap-4">
                        {ordering.map((item, index) => (
                            <PanierItems
                                key={index}
                                item={item}
                                handleDecrement={() => handleRemoveProduct(item.product)}
                                handleIncrement={() => handleAddProductCart(item.product)}
                            />
                        ))}
                    </div>
                </div>

                <div className="border-t border-surface-border p-5 sm:px-6">
                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="rounded-control bg-brand-500 px-5 py-3 text-body font-semibold text-ink-inverse">
                            Total&nbsp;: {formatPrix(calculateTotalPrice(ordering), devise)}
                        </p>

                        <p className="text-caption text-ink-muted">
                            La livraison et les frais de service sont calculés à l&apos;étape
                            suivante.
                        </p>
                    </div>

                    <div className="mt-5 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
                        <button
                            type="button"
                            onClick={toggleShowPanier}
                            className="text-caption font-semibold text-ink-muted underline underline-offset-4 sm:px-4"
                        >
                            Continuer mes achats
                        </button>

                        <Link
                            href="/ordering"
                            onClick={toggleShowPanier}
                            className="flex items-center justify-center gap-2 rounded-pill bg-secondaryColor px-7 py-3.5 text-body font-semibold text-white transition-opacity duration-150 hover:opacity-90"
                        >
                            <FaCircleArrowRight />
                            Étape suivante
                        </Link>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
