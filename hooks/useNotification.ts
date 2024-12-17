"use client"
import { getMessaging, getToken } from "firebase/messaging";
import {firebaseApp} from "@/services/firebase/index.config"


const messaging = getMessaging(firebaseApp);

export const requestPermission = async () => {

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register("/firebase-messaging-sw.js") // Chemin au fichier Service Worker
            .then((registration) => {
                console.log("Service Worker enregistré avec succès:", registration);

                // Récupération du Token FCM
                getToken(messaging, {
                    vapidKey: process.env.FIREBASE_MESSAGING_VAPID,
                    serviceWorkerRegistration: registration,
                })
                    .then((token) => {
                        console.log("FCM Token :", token);
                    })
                    .catch((error) => {
                        console.error("Erreur lors de la récupération du token :", error);
                    });
            })
            .catch((err) => {
                console.error("Erreur lors de l'enregistrement du Service Worker :", err);
            });
    } else {
        console.error("Les Service Workers ne sont pas supportés par ce navigateur.");
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
        const token = await getToken(messaging, {
            vapidKey: process.env.FIREBASE_MESSAGING_VAPID,
        });
        console.log("FCM Token:", token);
        return token;
    }
    return null;

};