"use client"
import React from 'react'
import ReduxProvider from './redux-provider'
import { ReactQueryProvider } from './query-provider'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  RequestPermissionAndGetToken from "@/providers/firebase-messaging";
import { Client } from 'appwrite';
import PaymentChecker from "@/components/commons/PaymentChecker";
import {ConsentementProvider} from "@/providers/consentement-provider";
import BandeauCookies from "@/components/commons/BandeauCookies";

export default function GlobalProvider({ children }) {
    const client = new Client();
    client
        .setEndpoint('https://fra.cloud.appwrite.io/v1')
        .setProject('6833301f0019d34f34b9');
    return (
        <ReduxProvider>
            <ReactQueryProvider>
                {/*
                  * Le consentement enveloppe tout : les cartes et les
                  * notifications le consultent la ou elles se chargent, et
                  * le bandeau doit pouvoir le poser depuis n'importe quelle
                  * page.
                  */}
                <ConsentementProvider>
                    {children}

                    {/*
                      * Firebase n'est plus monte d'office : il enregistre un
                      * service worker chez Google et obtient un jeton
                      * rattache au navigateur. Il attend donc le oui, et
                      * decide lui-meme de se taire.
                      */}
                    <RequestPermissionAndGetToken />
                    <ToastContainer />
                    <PaymentChecker />
                    <BandeauCookies />
                </ConsentementProvider>
            </ReactQueryProvider>
        </ReduxProvider>
    )
}
