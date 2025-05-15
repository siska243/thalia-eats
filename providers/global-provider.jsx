"use client"
import React, {useEffect} from 'react'
import ReduxProvider from './redux-provider'
import { ReactQueryProvider } from './query-provider'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  RequestPermissionAndGetToken from "@/providers/firebase-messaging-old";
import UsswrPolling from "@/providers/usswr-polling";
import SSEListener from "@/components/commons/SSEClient";
import {Route} from "@/helpers/Route";
import {FetchData} from "@/helpers/FetchData";
import Notify from "@/components/toastify/Notify";

const API_BASE_URL = process.env.NODE_ENV === 'production' ? "https://thalia.cooceckivu.org/api" : 'http://127.0.0.1:8000/api'

export default function GlobalProvider({ children }) {
    const handleFetchData=async (data)=>{
        
        if (localStorage && typeof window !== "undefined") {

           const paymentId=localStorage.getItem("flex_pay_number_order_thalia_eats")
            
            let link=null;

            if(paymentId){
                
                const url=`${API_BASE_URL}${Route.swr_check_paiement(paymentId)}`

                const response=await FetchData.getData(url)

                Notify("Status paiement", "success", data.name)

                localStorage.removeItem("flex_pay_number_order_thalia_eats")

                switch (`${data.code}`) {
                    case "0":
                        link = "/payement/success";
                        break;
                    case "1":
                        link = "/payement/error"
                        break;
                    case "2":
                        link = "/payement/attente"
                        break;
                    default:
                        link = "/payement/cancel"
                        break;
                }

               window.location.href=link
            }
            
        }


    }
    
    return (
        <ReduxProvider>
            <ReactQueryProvider>
                {children}
                <UsswrPolling />
                <RequestPermissionAndGetToken />
                <ToastContainer />
                <SSEListener onEvent={(data) => {
                    if(data?.payload) {
                        if(JSON.parse(data?.payload)?.action==="paiement-check") {
                            handleFetchData(JSON.parse(data?.payload)?.status)
                        }

                    }

                }} />
            </ReactQueryProvider>
        </ReduxProvider>
    )
}
