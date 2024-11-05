"use client"

import AOS from 'aos';
import 'aos/dist/aos.css';
import {useEffect} from "react";
const AosInit=()=>{

    useEffect(() => {
        AOS.init({
            duration: 1000, // Durée de l'animation en millisecondes
            once: true,     // L'animation ne se produit qu'une seule fois
        });
    }, []);

    return <div></div>
}

export default AosInit