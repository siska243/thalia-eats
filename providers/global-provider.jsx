"use client"
import React from 'react'
import ReduxProvider from './redux-provider'
import { ReactQueryProvider } from './query-provider'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  RequestPermissionAndGetToken from "@/providers/firebase-messaging";
import { Client } from 'appwrite';
import PaymentChecker from "@/components/commons/PaymentChecker";

export default function GlobalProvider({ children }) {
    const client = new Client();
    client
        .setEndpoint('https://fra.cloud.appwrite.io/v1')
        .setProject('6833301f0019d34f34b9');
    return (
        <ReduxProvider>
            <ReactQueryProvider>
                {children}
                <RequestPermissionAndGetToken />
                <ToastContainer />
                <PaymentChecker />
            </ReactQueryProvider>
        </ReduxProvider>
    )
}
