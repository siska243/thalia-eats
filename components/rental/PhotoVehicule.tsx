"use client";

import React, {useState} from "react";
import Image from "next/image";

import voitureParDefaut from "@/public/assets/thalia-trans.png";

interface Props {
    src?: string | null;
    alt?: string;
}

/**
 * La photo d'un véhicule, avec son repli.
 *
 * Une bonne partie du parc n'a pas encore de photo, et les URL viennent du
 * backend : certaines ne répondent plus. `next/image` ne remplace pas une
 * image cassée, le navigateur affiche alors son texte alternatif en travers de
 * la carte — c'est le défaut déjà corrigé sur les plats.
 *
 * Le repli est la voiture de la marque et non l'assiette de `ImagePlat` : sur
 * un catalogue de location, une photo de plat se lit comme une erreur.
 *
 * Depuis le 16 octobre c'est la photo fournie par le proprietaire, et non plus
 * un pictogramme gris : un vehicule sans photo reste une offre, et c'est ce
 * que le substitut doit montrer. `object-contain` parce qu'elle est detouree
 * sur fond transparent et doit tenir entiere.
 */
export default function PhotoVehicule({src, alt = ""}: Props) {
    const [cassee, setCassee] = useState(false);

    if (!src || cassee) {
        return (
            <span className="flex h-full w-full items-center justify-center bg-surface-sunken p-2">
                <Image
                    src={voitureParDefaut}
                    alt=""
                    aria-hidden
                    className="h-auto w-full object-contain"
                    sizes="(max-width: 640px) 40vw, 240px"
                />
            </span>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 640px) 40vw, 240px"
            className="object-cover"
            onError={() => setCassee(true)}
        />
    );
}
