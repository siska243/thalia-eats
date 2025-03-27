"use client"
import React, {useEffect} from 'react'
import ReduxProvider from './redux-provider'
import { ReactQueryProvider } from './query-provider'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  {requestPermissionAndGetToken} from "@/providers/firebase-messaging";
import PusherProvider from "@/providers/PusherProvider";


export default function GlobalProvider({ children }) {

    useEffect(() => {
        requestPermissionAndGetToken();
    }, []);
    return (
        <ReduxProvider>
            <ReactQueryProvider>
                {children}
                <ToastContainer />
            </ReactQueryProvider>
        </ReduxProvider>
    )
}
