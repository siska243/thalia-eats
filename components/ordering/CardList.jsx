"use client";

import ImagePlat from "@/components/ui/ImagePlat";
import {MdDeleteForever} from "react-icons/md";
import useCreateOrdering from "@/hooks/useCreateOrdering";
import {formatPrix} from "@/helpers/openingHours";

/**
 * Une ligne du panier.
 *
 * Le bouton de suppression etait masque tant qu'une `currentOrder` existait
 * dans le magasin — quatre conditions enchainees pour decider s'il fallait
 * l'afficher. En pratique, le client se retrouvait avec un panier qu'il ne
 * pouvait plus modifier, sans explication. La suppression reste toujours
 * possible : tant que la commande n'est pas payee, rien n'est fige.
 */
export default function CardList({products}) {
    const {product, quantity} = products;
    const {removeProduct} = useCreateOrdering();

    return (
        <li className="flex items-center gap-3 border-b border-surface-border px-4 py-4 sm:px-5">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-control bg-surface-sunken">
                <ImagePlat
                    src={product?.picture}
                    alt={product?.title ?? ""}
                    fill
                    sizes="56px"
                    className="object-cover"
                />

                <span className="absolute bottom-0 right-0 rounded-tl-control bg-secondaryColor px-1.5 py-0.5 text-caption font-bold text-white">
                    ×{quantity}
                </span>
            </div>

            <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-caption font-semibold text-ink">
                    {product?.title}
                </p>
                <p className="mt-0.5 text-caption text-ink-muted">
                    {formatPrix(product?.price, product?.currency?.code)}
                </p>
            </div>

            <p className="shrink-0 text-caption font-bold text-secondaryColor">
                {formatPrix(product?.price * quantity, product?.currency?.code)}
            </p>

            <button
                type="button"
                onClick={() => removeProduct(product, quantity)}
                aria-label={`Retirer ${product?.title ?? "ce plat"} du panier`}
                className="shrink-0 p-1 text-2xl text-ink-subtle transition-colors duration-150 hover:text-danger"
            >
                <MdDeleteForever />
            </button>
        </li>
    );
}
