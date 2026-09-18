"use client";

import {useState} from "react";
import Image from "next/image";
import imageParDefaut from "@/public/assets/images/food.png";

/**
 * Une image de plat ou de restaurant, avec repli.
 *
 * `next/image` ne remplace pas une image cassee : le navigateur affiche alors
 * le texte alternatif en clair, par-dessus la mise en page. Sur la liste des
 * restaurants, le nom du proprietaire — « Lillith Sandoval » — s'affichait
 * ainsi en travers du badge « Fermé ».
 *
 * Les URL d'images viennent du backend, et toutes ne repondent pas : anciens
 * fichiers supprimes, ou schema `https` sur un backend local en HTTP. Une
 * image manquante ne doit pas defigurer la carte.
 */
export default function ImagePlat({src, alt = "", className = "", repli = imageParDefaut, ...props}) {
    const [cassee, setCassee] = useState(false);

    return (
        <Image
            src={cassee || !src ? repli : src}
            alt={alt}
            onError={() => setCassee(true)}
            className={className}
            {...props}
        />
    );
}
