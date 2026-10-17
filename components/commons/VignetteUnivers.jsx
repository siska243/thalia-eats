import Image from "next/image";

import vignetteEats from "@/public/assets/thalia-eats.jpg";
import vignetteTrans from "@/public/assets/thalia-trans.jpg";

/**
 * Le visuel d'un univers : la voiture pour Thalia Trans, le plat pour
 * Thalia Eats.
 *
 * Décalque de `components/commons/vignette-univers.tsx` du mobile, et les
 * mêmes fichiers : les deux clients doivent montrer la même chose de la même
 * marque.
 *
 * Les deux images sont fournies par le propriétaire. Elles remplacent les
 * pictogrammes vectoriels **là où une photo tient** — une vignette de 44 px
 * et les substituts d'image. Les icônes plus petites restent vectorielles :
 * une photo n'y prend pas la couleur de l'état actif, et à cette taille elle
 * n'est plus qu'une tache sombre.
 *
 * Les deux tuiles font exactement la même taille, 640 sur 640, et se rendent
 * toutes deux en `cover` : la voiture était détournée sur fond transparent et
 * paraissait plus petite à côté d'une photo qui remplissait la sienne.
 */
const VIGNETTES = {
    eats: vignetteEats,
    trans: vignetteTrans,
};

export default function VignetteUnivers({univers, taille = 44, className = ""}) {
    return (
        <Image
            src={VIGNETTES[univers]}
            alt=""
            aria-hidden
            width={taille}
            height={taille}
            // 27 % du côté, comme le mobile : le même arrondi des deux côtés.
            style={{borderRadius: Math.round(taille * 0.27)}}
            className={`object-cover ${className}`}
        />
    );
}
