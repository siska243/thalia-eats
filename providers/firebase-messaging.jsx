"use client";

import { useEffect } from "react";
import { messaging } from "@/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";
import {FetchData} from "@/helpers/FetchData";
import {Route} from "@/helpers/Route";
import {clearLocalStorageOrdering} from "@/helpers/localstorage-data";

const FirebaseMessaging = () => {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/firebase-messaging-sw.js")
                .then((registration) => {
                    //console.log("Service Worker registered: ", registration);
                })
                .catch((error) => {
                    console.error("Service Worker registration failed: ", error);
                });
        }

        // Demander un jeton FCM (Firebase Cloud Messaging)
        getToken(messaging, { vapidKey: "BKgrBwqfFrK0AhcNfdlwutJzqTdwNwCHa3m_Zb_xrwsgNzcFrCjE5PDmqzSjaNNUsn3YpDRcbuvMXkk8enIK7UM" })
            .then((currentToken) => {
                if (currentToken) {
                    FetchData.sendData(Route.send_expo_token, {expo_token: currentToken})
                } else {
                    console.warn("No registration token available.");
                }
            })
            .catch((error) => {
                console.error("An error occurred while retrieving token. ", error);
            });

        if (messaging) {
            onMessage(messaging, (payload) => {
                if (payload) {
                    const {notification}=payload

                    try{
                        const parse = JSON.parse(notification.body)

                        if (parse) {
                            if (parse?.action === "paiement-check") {

                                switch (parse?.status?.code) {
                                    case "0":
                                        window.location.href = "/payement/success";
                                        clearLocalStorageOrdering()
                                        break;
                                    case "1":
                                        window.location.href = "/payement/error"
                                        break;
                                    case "2":
                                        window.location.href = "/payement/attente"
                                        break;
                                    default:
                                        window.location.href = "/payement/cancel"
                                        break;
                                }
                            }
                        }
                    }
                    catch (e){
                        console.log(e)
                    }

                }
            });
        } else {
            //console.error("Firebase Messaging is not initialized.");
        }

    }, []);

    return null; // Pas de rendu
};

export default FirebaseMessaging;
