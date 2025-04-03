"use client";

import useSWR from "swr";
import { FetchData } from "@/helpers/FetchData";
import { Route } from "@/helpers/Route";
import { getFlexPayOrder } from "@/server/manageToken";
import { useEffect, useState } from "react";


const API_BASE_URL = process.env.NODE_ENV === 'production' ? "https://thalia.cooceckivu.org/api" :'http://127.0.0.1:8000/api'
// Fonction fetcher optimisée
const fetcher = async (url: string) => {
    try {
        // Récupérer l'ID de paiement
        const getSessionOrder = await getFlexPayOrder();

        if (!getSessionOrder) {
            throw new Error("Erreur : ID de paiement introuvable");
        }

        console.log("✅ Paiement ID récupéré :", getSessionOrder);

        // Effectuer la requête API
        const response = await FetchData.getData(Route.swr_check_paiement(getSessionOrder));

        if (response?.name === "AxiosError") {
            throw new Error("Erreur lors de la récupération du paiement");
        }

        return response;
    } catch (error) {
        console.error("🚨 Erreur fetcher:", error);
        throw error;
    }
};

const UsswrPolling = () => {
    const [paymentId, setPaymentId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPaymentId() {
            const sessionOrder = await getFlexPayOrder();
            if (sessionOrder) {
                setPaymentId(sessionOrder);
            }
        }
        fetchPaymentId();
    }, []);

    // Construire l'URL dynamiquement

    const url = paymentId ? `${API_BASE_URL}${Route.swr_check_paiement(paymentId)}` : null;

    const { data, error, isLoading } = useSWR(
        url,
        fetcher,
        {
            refreshInterval: 20000,
            revalidateOnFocus: true
        }
    );

    console.log("polling")
    console.log(data)

    if (data) {
        console.log("✅ Données de paiement :", data);
    }

    console.log(error)

    return null;
};

export default UsswrPolling;
