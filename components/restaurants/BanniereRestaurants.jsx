import Image from "next/image";
import fondImage from "@/public/assets/images/foodsImg.png";

/**
 * L'en-tete de la liste.
 *
 * L'ancienne banniere annoncait « Commande minimum : 5 $ » et « Livraison :
 * 20-30 minutes » : deux chiffres ecrits en dur, que rien dans le produit ne
 * garantit. Les frais de livraison sont calcules par distance, et le delai
 * depend du restaurant. Afficher une promesse fausse coute plus cher que de ne
 * rien afficher.
 *
 * Elle montrait aussi le logo Thalia en grand, sur un fond fait du meme logo.
 * Une photo de nourriture dit mieux ce qu'on vient chercher.
 */
export default function BanniereRestaurants({nombre}) {
    return (
        <section className="mx-auto max-w-[1300px] px-4 pt-6 sm:px-5">
            <div className="relative overflow-hidden rounded-card">
                <Image
                    src={fondImage}
                    alt=""
                    aria-hidden
                    fill
                    priority
                    sizes="(max-width: 1300px) 100vw, 1300px"
                    className="object-cover object-center"
                />

                <div
                    className="absolute inset-0 bg-gradient-to-r from-secondaryColor via-secondaryColor/85 to-secondaryColor/30"
                    aria-hidden
                />

                <div className="relative px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
                    <h1 className="max-w-xl text-[30px] font-extrabold leading-tight tracking-tight text-white sm:text-[40px] lg:text-[48px]">
                        Où commande-t-on&nbsp;?
                    </h1>

                    <p className="mt-4 max-w-md text-body leading-7 text-white/80">
                        {nombre
                            ? `${nombre} restaurants de Kinshasa livrent chez vous.`
                            : "Les restaurants de Kinshasa qui livrent chez vous."}
                    </p>
                </div>
            </div>
        </section>
    );
}
