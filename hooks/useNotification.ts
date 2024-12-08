import { getMessaging, getToken } from "firebase/messaging";
import {firebaseApp} from "@/services/firebase/index.config"

const messaging = getMessaging(firebaseApp);

export const requestPermission = async () => {
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