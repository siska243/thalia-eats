"use client";

import ImagePlat from "@/components/ui/ImagePlat";
import {FaPlus} from "react-icons/fa6";
import useCart from "@/hooks/useCart";
import {formatPrix} from "@/helpers/openingHours";
import {enTexte} from "@/helpers/reponseApi";

/**
 * Une carte plat. Une seule, pour tout le site.
 *
 * Il en existait trois — CardOffers, CardAll, et la carte de l'accueil — avec
 * trois mises en page, trois formats de prix et trois boutons d'ajout
 * differents. Le meme plat changeait d'apparence selon la page.
 *
 * Le prix passe par `formatPrix` : il etait affiche brut (`12.5 USD`), sans
 * separateur de milliers, ce qui est illisible des qu'on paie en francs
 * congolais.
 */
export default function CardPlat({product, className = ""}) {
    const {handleAddProductCart} = useCart();

    const enPromotion = product?.is_promotional && product?.promotionnalPrice;

    return (
        <article
            className={`group flex h-full flex-col overflow-hidden rounded-card bg-surface shadow-card transition-shadow duration-200 hover:shadow-raised ${className}`}
        >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-sunken">
                <ImagePlat
                    src={product?.picture}
                    alt={product?.title ?? ""}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-200 motion-safe:group-hover:scale-105"
                />

                {enPromotion ? (
                    <span className="absolute left-3 top-3 rounded-pill bg-danger px-2.5 py-1 text-caption font-bold text-white">
                        Promo
                    </span>
                ) : null}
            </div>

            <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-1 text-body font-semibold text-secondaryColor">
                    {product?.title}
                </h3>

                <p className="mt-1 line-clamp-2 text-caption text-ink-muted">
                    {enTexte(product?.description) || "Pas de description pour ce plat"}
                </p>

                <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                    <div>
                        {enPromotion ? (
                            <p className="text-caption text-ink-subtle line-through">
                                {formatPrix(product.price, product?.currency?.code)}
                            </p>
                        ) : null}

                        <p className="text-title font-bold text-secondaryColor">
                            {formatPrix(
                                enPromotion ? product.promotionnalPrice : product?.price,
                                product?.currency?.code
                            )}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleAddProductCart(product)}
                        aria-label={`Ajouter ${product?.title ?? "ce plat"} au panier`}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-brand-500 text-ink-inverse transition-colors duration-150 hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                    >
                        <FaPlus />
                    </button>
                </div>
            </div>
        </article>
    );
}
