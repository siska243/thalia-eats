// Importez Firebase SDK pour les notifications
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging.js");

import { firebaseConfig } from "@/services/firebase/index.config"

firebase.initializeApp(firebaseConfig);

// Initialisez Firebase Messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
        "[firebase-messaging-sw.js] Received background message ",
        payload
    );
    // Personnalisez la notification
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "/firebase-logo.png", // Remplacez par votre icône
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});