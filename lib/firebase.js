// lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {

    apiKey: "AIzaSyBXu54hKJtNjqd-_JTyA1HjyLwunSuOLlE",
    authDomain: "thalia-eats.firebaseapp.com",
    projectId: "thalia-eats",
    messagingSenderId: "174715865134",
    appId: "1:174715865134:web:b0f2455745c52fb62fb7bf",

    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialiser l'application Firebase (uniquement une fois)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let messaging = null;

// Initialiser Messaging uniquement côté client
if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        if (supported) {
            messaging = getMessaging(app);
        }
    });
}

export { app, messaging };
