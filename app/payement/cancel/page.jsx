"use client"
import useCurrentCommande from '@/hooks/useCurrentCommande'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Route } from '@/helpers/Route'
import { FetchData } from "@/helpers/FetchData";
import Loader from '@/components/Loader/Loader'
import { MdCancel } from "react-icons/md";

export default function CancelPage() {
    const router = useRouter();
    const { currentCommande, isLoading, isError, isFetched } = useCurrentCommande()
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
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="bg-white box-shadow-custom rounded-lg p-6 sm:p-8 lg:p-10 max-w-xl w-full text-center">
                <div className="flex justify-center mb-6">
                    {/* SVG pour annulation */}
                    <MdCancel className="w-16 h-16 text-yellow-500" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-yellow-600 mb-4">
                    Commande annulée !
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mb-6">
                    Vous avez annulé votre commande. Si c'était une erreur, vous pouvez
                    relancer le processus ou nous contacter pour toute question.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => router.push("/products")}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 sm:px-6 rounded-md transition duration-200 text-sm md:text-base shadow-md hover:shadow-lg"
                    >
                        Retourner à la boutique
                    </button>
                    <button
                        onClick={() => router.push("/support")}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 sm:px-6 rounded-md transition duration-200 text-sm md:text-base shadow-md hover:shadow-lg"
                    >
                        Contacter le support
                    </button>
                </div>
            </div>
        </div>
    );
}
