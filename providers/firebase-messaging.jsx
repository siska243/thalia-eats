import {initializeApp} from 'firebase/app';
import {getMessaging, getToken, isSupported, onMessage} from 'firebase/messaging';
import {FetchData} from "@/helpers/FetchData";
import {Route} from "@/helpers/Route";
import {clearLocalStorageOrdering} from "@/helpers/localstorage-data";

const firebaseConfig = {
    apiKey: "AIzaSyBXu54hKJtNjqd-_JTyA1HjyLwunSuOLlE",
    authDomain: "thalia-eats.firebaseapp.com",
    projectId: "thalia-eats",
    messagingSenderId: "174715865134",
    appId: "1:174715865134:web:b0f2455745c52fb62fb7bf"
};

const app = initializeApp(firebaseConfig);

// Vérifie si Firebase messaging est supporté
let messaging = null;
isSupported().then((supported) => {
    if (supported) {
        messaging = getMessaging(app);
    } else {
        console.warn('Firebase messaging non supporté');
    }
});

export const requestPermissionAndGetToken = async () => {

    if (!messaging) {
        console.error("Firebase messaging n'est pas initialisé !");
        return;
    }

    try {

        const token = await getToken(messaging, {vapidKey: 'BKgrBwqfFrK0AhcNfdlwutJzqTdwNwCHa3m_Zb_xrwsgNzcFrCjE5PDmqzSjaNNUsn3YpDRcbuvMXkk8enIK7UM'});

        if (token) {
            await FetchData.sendData(Route.send_expo_token, {expo_token: token})
        }

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

    } catch (error) {
        console.error('Erreur récupération token:', error);
    }
};
