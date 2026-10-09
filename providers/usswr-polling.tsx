"use client";

import useSWR from "swr";
import {API_BASE_URL, FetchData} from "@/helpers/FetchData";
import {Route} from "@/helpers/Route";
import {useEffect, useState} from "react";
import Notify from "@/components/toastify/Notify";
import {useRouter} from "next/navigation";


const fetcher = async () => {
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
        throw error;
    }
};

const UsswrPolling = () => {
    const [paymentId, setPaymentId] = useState<string | null>(null);

    // Construire l'URL dynamiquement

    /*
     * Sert de cle de cache SWR : le fetcher passe par FetchData, qui porte sa
     * propre base. Le fichier redefinissait pourtant cette base, et sur
     * l'ancien domaine `thalia.cooceckivu.org` en production. Une seconde
     * definition de la meme adresse, et celle-ci etait perimee.
     */
    const url = paymentId ? `${API_BASE_URL}/${Route.swr_check_paiement(paymentId)}` : null;

    const router = useRouter()


    /*
     * Lecture du stockage local apres montage. Le serveur ne connait pas cette
     * valeur : la lire au premier rendu ferait diverger le HTML du serveur et
     * celui du client. React n'offre pas d'autre primitive pour attendre
     * l'hydratation.
     */
    useEffect(() => {
        if (typeof window === "undefined") return
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPaymentId(localStorage.getItem("flex_pay_number_order_thalia_eats"))
    }, []);
    const {data} = useSWR(
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
