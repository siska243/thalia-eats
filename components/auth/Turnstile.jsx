"use client";

import Script from "next/script";
import {useCallback, useEffect, useId, useRef, useState} from "react";

/**
 * Le défi anti-robot de Cloudflare, sur le formulaire d'inscription.
 *
 * Posé après deux inscriptions manifestement automatisées le 17 octobre.
 *
 * IL NE PROTÈGE RIEN À LUI SEUL : c'est le serveur qui vérifie le jeton, et
 * c'est là que la mesure existe. Ce composant ne fait que l'obtenir.
 *
 * SANS CLÉ, IL DISPARAÎT. `NEXT_PUBLIC_TURNSTILE_SITE_KEY` absente, le
 * composant ne rend rien et `onJeton` reçoit `null` : l'inscription se
 * comporte exactement comme avant. C'est volontaire — un widget qui
 * bloquerait le formulaire parce qu'une variable manque fermerait les
 * inscriptions le jour du déploiement, sans prévenir.
 *
 * La clé publique n'est pas un secret : Cloudflare la publie dans la page.
 * Elle passe quand même par l'environnement, pas en dur, pour qu'on puisse
 * changer de site sans redéployer le code.
 */
const CLE_SITE = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function Turnstile({onJeton}) {
    const conteneur = useRef(null);
    const widget = useRef(null);
    const [pret, setPret] = useState(false);
    const id = useId();

    const rendre = useCallback(() => {
        if (!CLE_SITE || !conteneur.current || widget.current !== null) return;
        if (typeof window === "undefined" || !window.turnstile) return;

        widget.current = window.turnstile.render(conteneur.current, {
            sitekey: CLE_SITE,
            // Le français : le reste du formulaire l'est, et un défi en
            // anglais au milieu se lit comme une page étrangère.
            language: "fr",
            callback: (jeton) => onJeton?.(jeton),
            // Un jeton expire au bout de cinq minutes. Sans ces deux
            // rappels, un formulaire rempli lentement partait avec un jeton
            // périmé et se faisait refuser sans explication.
            "expired-callback": () => onJeton?.(null),
            "error-callback": () => onJeton?.(null),
        });
    }, [onJeton]);

    useEffect(() => {
        if (pret) rendre();
    }, [pret, rendre]);

    useEffect(
        () => () => {
            if (widget.current !== null && window.turnstile) {
                window.turnstile.remove(widget.current);
                widget.current = null;
            }
        },
        [],
    );

    if (!CLE_SITE) return null;

    return (
        <>
            <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
                strategy="lazyOnload"
                onReady={() => setPret(true)}
            />
            <div ref={conteneur} id={id} className="min-h-[65px]" />
        </>
    );
}
