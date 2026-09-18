"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {getToken, onMessage} from "firebase/messaging";
import {messaging} from "@/lib/firebase";
import {FetchData} from "@/helpers/FetchData";
import {Route} from "@/helpers/Route";
import {clearLocalStorageOrdering} from "@/helpers/localstorage-data";

/**
 * Notifications Firebase, et redirection sur retour de paiement.
 *
 * Ce fichier s'appelait `firebase-messaging-old.jsx`, et c'etait pourtant lui
 * que `global-provider` chargeait. Deux autres versions dormaient a cote —
 * `firebase-messaging.jsx` et `firebase-messaging-old2.jsx` — importees nulle
 * part, et toutes deux portaient la configuration Firebase ecrite en dur
 * (apiKey, appId, messagingSenderId) la ou celle-ci la lit depuis
 * `@/lib/firebase`. Les deux copies mortes sont supprimees, et le fichier
 * vivant a repris le nom sans suffixe.
 *
 * La navigation passait par `window.location.href`, qui recharge toute
 * l'application : le panier Redux, la session et le cache TanStack Query sont
 * reconstruits depuis zero a l'arrivee sur la page de paiement. `router.push`
 * navigue sans quitter l'application.
 *
 * Le code vidait aussi le panier *apres* avoir lance la redirection. Cela
 * fonctionnait par chance — l'assignation de `location.href` ne stoppe pas
 * l'execution — mais rien ne le garantissait. Le panier est vide d'abord.
 */
const FirebaseMessaging = () => {
    const router = useRouter();

    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/firebase-messaging-sw.js").catch(() => {
                // L'enregistrement echoue en navigation privee et sur http :
                // les notifications sont alors indisponibles, sans consequence
                // pour le reste de l'application.
            });
        }

        getToken(messaging, {
            vapidKey:
                "BKgrBwqfFrK0AhcNfdlwutJzqTdwNwCHa3m_Zb_xrwsgNzcFrCjE5PDmqzSjaNNUsn3YpDRcbuvMXkk8enIK7UM",
        })
            .then((jeton) => {
                if (jeton) FetchData.sendData(Route.send_expo_token, {expo_token: jeton});
            })
            .catch(() => {
                // Permission refusee ou bloquee par le navigateur. C'est un
                // choix de l'utilisateur, pas une panne : on n'encombre pas la
                // console d'une erreur a chaque chargement de page.
            });

        if (!messaging) return;

        onMessage(messaging, (payload) => {
            if (!payload?.notification?.body) return;

            let avis;

            try {
                avis = JSON.parse(payload.notification.body);
            } catch {
                // Toutes les notifications ne transportent pas du JSON : une
                // notification lisible par un humain arrive ici, et n'a rien a
                // declencher.
                return;
            }

            if (avis?.action !== "paiement-check") return;

            const destinations = {
                0: "/payement/success",
                1: "/payement/error",
                2: "/payement/attente",
            };

            if (String(avis?.status?.code) === "0") clearLocalStorageOrdering();

            router.push(destinations[String(avis?.status?.code)] ?? "/payement/cancel");
        });
    }, [router]);

    return null;
};

export default FirebaseMessaging;
