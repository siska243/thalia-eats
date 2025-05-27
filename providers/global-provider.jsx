"use client"
import React, {useEffect} from 'react'
import ReduxProvider from './redux-provider'
import { ReactQueryProvider } from './query-provider'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  RequestPermissionAndGetToken from "@/providers/firebase-messaging-old";
import { Client } from 'appwrite';
import PaymentChecker from "@/components/commons/PaymentChecker";

const API_BASE_URL = process.env.NODE_ENV === 'production' ? "https://thalia.cooceckivu.org/api" : 'http://127.0.0.1:8000/api'

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
