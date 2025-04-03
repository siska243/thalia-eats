"use client"
import useCurrentCommande from '@/hooks/useCurrentCommande'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Route } from '@/helpers/Route'
import { FetchData } from "@/helpers/FetchData";
import Loader from '@/components/Loader/Loader'
import { MdCheckCircle } from "react-icons/md";
import {BiLoader} from "react-icons/bi";

export default function SuccessPage() {
    const { currentCommande, isLoading } = useCurrentCommande()
    const router = useRouter()

    const handlerCheckPayement = async (uid) => {
        try {
            const response = await FetchData.sendData(Route.check_paiement, { uid })
            console.log(response);
        } catch (e) {
            console.log(e);
        }
    }


    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <div className="flex items-center justify-center  h-screen pt-[150px] bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="bg-white box-shadow-custom rounded-lg p-8 max-w-md text-center">
                <div className="flex justify-center mb-4 md:mb-6 ">
                    {/* Icone de succès */}
                    <BiLoader   className="spin-slow w-12 h-12 md:w-16 md:h-16 text-green-500" />
                </div>
                <h2 className=" text-xl md:text-2xl font-bold text-gray-800 mb-2">Paiement est en attente !</h2>
                <p className="text-sm md:text-base text-gray-600  mb-6">
                    Veuillez suivre les instructions envoyées sur votre téléphone par message pour valider votre paiement
                </p>
                {/* Bouton de redirection */}
                <button
                    onClick={() => router.push('/ordering')}
                    className="text-sm md:text-base bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-md transition duration-200"
                >
                    Consulter ma commande
                </button>
            </div>
        </div>
    )
}
