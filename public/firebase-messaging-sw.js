// Importez Firebase SDK pour les notifications
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