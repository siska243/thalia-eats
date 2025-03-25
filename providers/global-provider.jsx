"use client"
import React from 'react'
import ReduxProvider from './redux-provider'
import { ReactQueryProvider } from './query-provider'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FirebaseMessaging from "@/providers/firebase-messaging";


export default function GlobalProvider({ children }) {
    return (
        <ReduxProvider>
            <ReactQueryProvider>
                {children}
                <ToastContainer />
                <FirebaseMessaging />
            </ReactQueryProvider>
        </ReduxProvider>
    )
}
