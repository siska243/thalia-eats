"use client"
import useCurrentCommande from '@/hooks/useCurrentCommande'
import React, {useEffect} from 'react'
import {useRouter} from 'next/navigation'
import {Route} from '@/helpers/Route'
import {FetchData} from "@/helpers/FetchData";
import Loader from '@/components/Loader/Loader'
import {MdCancel} from "react-icons/md";
import {useDispatch} from "react-redux";
import {fetchCurrentOrder} from "@/store/reducers/cartSlice";

export default function CancelPage() {
    const router = useRouter();
    const {currentCommande, isLoading, isError, isFetched} = useCurrentCommande()
    const handlerCheckPayement = async (uid) => {
        try {
            const response = await FetchData.sendData(Route.check_paiement, {uid})
            localStorage.removeItem("flex_pay_number_order_thalia_eats")
        } catch (e) {
            console.log(e);
        }
    }

    const dispatch=useDispatch()

    useEffect(() => {
        if (localStorage && typeof window !== "undefined") {
            localStorage.removeItem("flex_pay_number_order_thalia_eats")

            dispatch(fetchCurrentOrder())
        }
    }, [])

    useEffect(() => {
        if (currentCommande?.uid) {
            handlerCheckPayement(currentCommande.uid)
        }
    }, [currentCommande])

    if (isLoading) {
        return (
            <Loader/>
        )
    }

    return (
        <div className="flex items-center justify-center h-screen pt-[150px] bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div data-aos="fade-left"
                 className="bg-white box-shadow-custom rounded-lg p-6 sm:p-8 lg:p-10 max-w-xl w-full text-center">
                <div data-aos="fade-left" className="flex justify-center mb-4 md:mb-6">
                    {/* SVG pour annulation */}
                    <MdCancel className="w-12 h-12 md:w-16 md:h-16 text-yellow-500"/>
                </div>
                <h1 data-aos="fade-left" className="text-xl sm:text-2xl font-bold text-yellow-600 mb-4">
                    Commande annulée !
                </h1>
                <p data-aos="fade-left" className="text-sm sm:text-base text-gray-600 mb-6">
                    Vous avez annulé votre commande. Si c'était une erreur, vous pouvez
                    relancer le processus ou nous contacter pour toute question.
                </p>
                <div data-aos="fade-left" className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => router.push("/restaurants")}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 sm:px-6 rounded-md transition duration-200 text-sm md:text-base shadow-md hover:shadow-lg"
                    >
                        Retourner aux restaurants
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
