"use client";

import useSWR from "swr";
import {FetchData} from "@/helpers/FetchData";
import {Route} from "@/helpers/Route";
import {getFlexPayOrder} from "@/server/manageToken";
import {useEffect, useState} from "react";
import Notify from "@/components/toastify/Notify";
import {useRouter} from "next/navigation";


const API_BASE_URL = process.env.NODE_ENV === 'production' ? "https://thalia.cooceckivu.org/api" : 'http://127.0.0.1:8000/api'

const fetcher = async (url: string) => {
    try {
        // Récupérer l'ID de paiement
        const getSessionOrder = localStorage && window != undefined ? localStorage.getItem("flex_pay_number_order_thalia_eats") : null;

        if (!getSessionOrder) {
            throw new Error("Erreur : ID de paiement introuvable");
        }

        // Effectuer la requête API
        const response = await FetchData.getData(Route.swr_check_paiement(getSessionOrder));

        if (response?.name === "AxiosError") {
            throw new Error("Erreur lors de la récupération du paiement");
        }

        return response;
    } catch (error) {
        //console.error("🚨 Erreur fetcher:", error);
        throw error;
    }
};

const UsswrPolling = () => {
    const [paymentId, setPaymentId] = useState<string | null>(null);

    // Construire l'URL dynamiquement

    const url = paymentId ? `${API_BASE_URL}${Route.swr_check_paiement(paymentId)}` : null;

    const router = useRouter()


    useEffect(() => {
        if (localStorage && typeof window !== "undefined") {
            setPaymentId(localStorage.getItem("flex_pay_number_order_thalia_eats"))
        }
    }, []);
    const {data, error, isLoading} = useSWR(
        url,
        fetcher,
        {
            refreshInterval: 20000,
            revalidateOnFocus: true
        }
    );


    if (data) {
        Notify("Status paiement", "success", data.name)
        setPaymentId(null)
        localStorage.removeItem("flex_pay_number_order_thalia_eats")
        let link=null;
        switch (data.code) {
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

        router.replace(link)
    }


    return null;
};

export default UsswrPolling;
