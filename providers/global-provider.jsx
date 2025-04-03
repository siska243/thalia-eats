"use client"
import React, {useEffect} from 'react'
import ReduxProvider from './redux-provider'
import { ReactQueryProvider } from './query-provider'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  RequestPermissionAndGetToken from "@/providers/firebase-messaging-old";
import UsswrPolling from "@/providers/usswr-polling";


export default function GlobalProvider({ children }) {


    return (
        <ReduxProvider>
            <ReactQueryProvider>
                {children}
                <UsswrPolling />
                <RequestPermissionAndGetToken />
                <ToastContainer />
            </ReactQueryProvider>
        </ReduxProvider>
    )
}
