"use client"
import React from 'react'
import ReduxProvider from './redux-provider'
import { ReactQueryProvider } from './query-provider'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationProvider from "./notification-provider"

export default function GlobalProvider({ children }) {
    return (
        <ReduxProvider>
            <ReactQueryProvider>
                <NotificationProvider />
                {children}
                <ToastContainer />
            </ReactQueryProvider>
        </ReduxProvider>
    )
}
