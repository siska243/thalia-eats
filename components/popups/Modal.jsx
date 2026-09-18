import Image from "next/image";
import {IoClose} from "react-icons/io5";
import logo from "@/public/assets/logo-thalia.png";

/**
 * La fenetre modale du panier.
 *
 * Elle etait positionnee en `absolute top-0` : `absolute` se cale sur le
 * document, pas sur la fenetre. Des qu'on avait fait defiler la page, la
 * modale s'ouvrait tout en haut du document, hors de la zone visible — on
 * cliquait sur le panier et il ne se passait rien a l'ecran. `fixed` la cale
 * sur la fenetre, quel que soit le defilement.
 *
 * Elle portait aussi `overflow-scroll`, qui affiche les deux barres de
 * defilement en permanence, meme sur un panier d'un seul plat.
 */
export default function Modal({children, toggleModal}) {
    return (
        <div
            className="fixed inset-0 z-[99999999] flex items-center justify-center overflow-y-auto bg-black/80 px-4 py-10"
            role="dialog"
            aria-modal="true"
        >
            {/* Cliquer a cote ferme : c'est le geste attendu d'une surcouche. */}
            <button
                type="button"
                aria-label="Fermer"
                onClick={toggleModal}
                className="absolute inset-0 cursor-default"
                tabIndex={-1}
            />

            <div className="relative w-full max-w-xl">
                <button
                    type="button"
                    onClick={toggleModal}
                    aria-label="Fermer le panier"
                    className="absolute -right-2 -top-4 z-10 flex h-10 w-10 items-center justify-center rounded-pill bg-danger text-2xl text-white shadow-raised"
                >
                    <IoClose />
                </button>

                <div className="overflow-hidden rounded-card bg-surface">
                    <div className="flex h-20 w-full items-center justify-center bg-secondaryColor">
                        <Image
                            src={logo}
                            className="h-12 w-auto object-contain"
                            alt="Thalia Eats"
                            width={160}
                            height={48}
                        />
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
