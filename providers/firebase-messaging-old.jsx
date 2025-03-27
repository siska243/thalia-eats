"use client";

import { useEffect } from "react";
import { messaging } from "@/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";

const FirebaseMessaging = () => {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/firebase-messaging-sw.js")
                .then((registration) => {
                    console.log("Service Worker registered: ", registration);
                })
                .catch((error) => {
                    console.error("Service Worker registration failed: ", error);
                });
        }

        // Demander un jeton FCM (Firebase Cloud Messaging)
        getToken(messaging, { vapidKey: "BKgrBwqfFrK0AhcNfdlwutJzqTdwNwCHa3m_Zb_xrwsgNzcFrCjE5PDmqzSjaNNUsn3YpDRcbuvMXkk8enIK7UM" })
            .then((currentToken) => {
                if (currentToken) {
                    console.log("FCM Token:", currentToken);
                    // Envoyez ce jeton à votre serveur pour gérer les notifications push
                } else {
                    console.warn("No registration token available.");
                }
            })
            .catch((error) => {
                console.error("An error occurred while retrieving token. ", error);
            });

        if (messaging) {
            onMessage(messaging, (payload) => {
                console.log("Message received:", payload);
            });
        } else {
            //console.error("Firebase Messaging is not initialized.");
        }

    }, []);

    return null; // Pas de rendu
};

export default FirebaseMessaging;
