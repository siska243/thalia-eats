"use client"
// Importez Firebase SDK pour les notifications
import {clearLocalStorageOrdering} from "@/helpers/localstorage-data";

importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyBXu54hKJtNjqd-_JTyA1HjyLwunSuOLlE",
    authDomain: "thalia-eats.firebaseapp.com",
    projectId: "thalia-eats",
    storageBucket: "thalia-eats.firebasestorage.app",
    messagingSenderId: "174715865134",
    appId: "1:174715865134:web:b0f2455745c52fb62fb7bf",
    measurementId: "G-GEW26MS1QF"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
if (typeof window !== "undefined") {


// Initialisez Firebase Messaging

    messaging.onBackgroundMessage((payload) => {

        // Personnalisez la notification
        const notificationTitle = payload.notification.title;

        if (payload) {
            const {notification}=payload

            try{
                const parse = JSON.parse(notification.body)
                let link;
                if (parse) {
                    if (parse?.action === "paiement-check") {

                        switch (parse?.status?.code) {
                            case "0":
                                link = "/payement/success";
                                break;
                            case "1":
                                link = "/payement/error"
                                break;
                            case "2":
                                link = "/payement/attente"
                                break;
                            default:
                               link = "/payement/cancel"
                                break;
                        }
                    }

                    const notificationOptions = {
                        body: "Status paiement",
                        icon: "/logo-thalia.png",
                        link
                    };

                    self.registration.showNotification(notificationTitle, notificationOptions);
                }
            }
            catch (e){
                console.log(e)
            }

        }

    });
}