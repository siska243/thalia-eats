"use client"

import { useEffect } from "react";

export default function RegisterServiceWorker() {

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/firebase-messaging-sw.js')
                .then((registration) => console.log('scope is: ', registration.scope));
        }
    }, []);

    return <></>
};