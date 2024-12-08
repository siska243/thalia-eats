"use client"
import useCurrentCommande from '@/hooks/useCurrentCommande'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Route } from '@/helpers/Route'
import { FetchData } from "@/helpers/FetchData";
import Loader from '@/components/Loader/Loader'
import { MdCheckCircle } from "react-icons/md";

export default function SuccessPage() {
    const { currentCommande, isLoading, isError, isFetched } = useCurrentCommande()
    const router = useRouter()

    const handlerCheckPayement = async (uid) => {
        try {
            const response = await FetchData.sendData(Route.check_paiement, { uid })
            console.log(response);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (currentCommande?.uid) {
            handlerCheckPayement(currentCommande.uid)
        }
    }, [currentCommande])

    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white box-shadow-custom rounded-lg p-8 max-w-md text-center">
                <div className="flex justify-center mb-4 ">
                    {/* Icone de succès */}
                    <MdCheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Paiement réussi !</h2>
                <p className="text-gray-600 mb-6">
                    Votre commande a été confirmée avec succès. Vous pouvez suivre son statut à tout moment.
                </p>
                {/* Bouton de redirection */}
                <button
                    onClick={() => router.push('/tracking')}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-md transition duration-200"
                >
                    Suivre ma commande
                </button>
            </div>
        </div>
    )
}
