"use client";

import React, {useState} from "react";
import Image from "next/image";
import {FaCar} from "react-icons/fa6";

interface Props {
    src?: string | null;
    alt?: string;
    /** Taille de l'icône de repli, en pixels. */
    tailleIcone?: number;
}

/**
 * La photo d'un véhicule, avec son repli.
 *
 * Une bonne partie du parc n'a pas encore de photo, et les URL viennent du
 * backend : certaines ne répondent plus. `next/image` ne remplace pas une
 * image cassée, le navigateur affiche alors son texte alternatif en travers de
 * la carte — c'est le défaut déjà corrigé sur les plats.
 *
 * Le repli est une silhouette de voiture et non l'assiette de `ImagePlat` :
 * sur un catalogue de location, une photo de plat se lit comme une erreur.
 */
export default function PhotoVehicule({src, alt = "", tailleIcone = 26}: Props) {
    const [cassee, setCassee] = useState(false);

    if (!src || cassee) {
        return (
            <span className="flex h-full w-full items-center justify-center bg-surface-sunken text-ink-subtle">
                <FaCar size={tailleIcone} aria-hidden />
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
