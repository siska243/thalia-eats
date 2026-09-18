import ImagePlat from "@/components/ui/ImagePlat";
import {MdDeleteForever} from "react-icons/md";
import {formatPrix} from "@/helpers/openingHours";

/**
 * Une ligne du panier, avec ses boutons de quantite.
 *
 * Les boutons « + » et « - » mesuraient 20 pixels de cote. Sur un telephone,
 * la cible tactile recommandee est de 44 pixels : on visait la quantite et on
 * touchait a cote, voire sur la corbeille juste a gauche.
 */
export default function PanierItems({item, handleDecrement, handleIncrement}) {
    const {product, quantity} = item;

    return (
        <div className="flex flex-wrap items-center gap-3 rounded-card bg-surface-sunken p-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-pill">
                <ImagePlat
                    src={product?.picture}
                    alt={product?.title ?? ""}
                    fill
                    sizes="56px"
                    className="object-cover"
                />
            </div>

            <div className="min-w-0 flex-1">
                <h3 className="line-clamp-1 text-body font-semibold text-secondaryColor">
                    {product?.title}
                </h3>
                <p className="mt-0.5 text-caption font-bold text-brand-600">
                    {formatPrix(product?.price, product?.currency?.code)}
                </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <button
                    type="button"
                    onClick={handleDecrement}
                    aria-label={
                        quantity > 1
                            ? `Retirer un ${product?.title}`
                            : `Supprimer ${product?.title} du panier`
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-pill bg-surface text-xl text-ink transition-colors duration-150 hover:bg-surface-sunken"
                >
                    {quantity > 1 ? "−" : <MdDeleteForever className="text-danger" />}
                </button>

                <span
                    aria-live="polite"
                    className="w-10 text-center text-body font-bold text-secondaryColor"
                >
                    {quantity}
                </span>

                <button
                    type="button"
                    onClick={handleIncrement}
                    aria-label={`Ajouter un ${product?.title}`}
                    className="flex h-11 w-11 items-center justify-center rounded-pill bg-secondaryColor text-xl text-white transition-opacity duration-150 hover:opacity-90"
                >
                    +
                </button>
            </div>
        </div>
    );
}
