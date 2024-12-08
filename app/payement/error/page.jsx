"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useCurrentCommande from "@/hooks/useCurrentCommande";
import { FetchData } from "@/helpers/FetchData";
import { Route } from "@/helpers/Route";
import Loader from "@/components/Loader/Loader";
import { MdError } from "react-icons/md";

export default function ErrorPage() {
    const router = useRouter();
    const { currentCommande, isLoading } = useCurrentCommande();

    const handlerCheckPayement = async (uid) => {
        try {
            const response = await FetchData.sendData(Route.check_paiement, { uid });
            console.log(response);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (currentCommande?.uid) {
            handlerCheckPayement(currentCommande.uid);
        }
    }, [currentCommande]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="flex items-center justify-center h-full bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="bg-white box-shadow-custom rounded-lg p-6 sm:p-8 lg:p-10 max-w-xl w-full text-center">
                <div className="flex justify-center mb-6">
                    {/* Icône d'erreur */}
                    <MdError className="w-16 h-16 text-red-500" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">
                    Paiement échoué !
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mb-6">
                    Une erreur s'est produite lors du traitement de votre paiement.
                    Veuillez réessayer ou nous contacter si le problème persiste.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => router.push("/ordering")}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 sm:px-6 rounded-md transition duration-200 text-sm md:text-base shadow-md hover:shadow-lg"
                    >
                        Réessayer le paiement
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
