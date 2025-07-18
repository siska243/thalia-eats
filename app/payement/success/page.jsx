"use client"
import useCurrentCommande from '@/hooks/useCurrentCommande'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Route } from '@/helpers/Route'
import { FetchData } from "@/helpers/FetchData";
import Loader from '@/components/Loader/Loader'
import { MdCheckCircle } from "react-icons/md";
import Notify from "@/components/toastify/Notify";
import {fetchCurrentOrder, setCurrentOrder} from "@/store/reducers/cartSlice";
import {useDispatch, useSelector} from "react-redux";
import {clearLocalStorageOrdering} from "@/helpers/localstorage-data";

export default function SuccessPage() {
    const { currentCommande, isLoading, isError, isFetched } = useCurrentCommande()
    const router = useRouter()
    const dispatch=useDispatch()

    const handlerCheckPayement = async (uid) => {
        try {
            const response = await FetchData.sendData(Route.check_paiement, { uid })

            dispatch(fetchCurrentOrder())
            if(response?.name==="AxiosError"){
                Notify(response?.response?.data?.title,'error',response?.response?.data?.message)
            }
            else{

                if(localStorage.getItem("flex_pay_number_order_thalia_eats")){
                    clearLocalStorageOrdering()
                    localStorage.removeItem("flex_pay_number_order_thalia_eats")
                    Notify(response.title,'success',response.message)
                }

            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if(typeof window !=="undefined" && localStorage.getItem("flex_pay_number_order_thalia_eats")){
            handlerCheckPayement()
        }

    }, [])

    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <div className="flex items-center justify-center  h-screen pt-[150px] bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div data-aos="fade-left" className="bg-white box-shadow-custom rounded-lg p-8 max-w-md text-center">
                <div className="flex justify-center mb-4 md:mb-6 ">
                    {/* Icone de succès */}
                    <MdCheckCircle data-aos="fade-left" className="w-12 h-12 md:w-16 md:h-16 text-green-500" />
                </div>
                <h2 data-aos="fade-left" className=" text-xl md:text-2xl font-bold text-gray-800 mb-2">Paiement réussi !</h2>
                <p data-aos="fade-left" className="text-sm md:text-base text-gray-600 mb-6">
                    Votre commande a été confirmée avec succès. Vous pouvez suivre son statut à tout moment.
                </p>
                {/* Bouton de redirection */}
                <button data-aos="fade-left"
                    onClick={() => router.push('/tracking')}
                    className="text-sm md:text-base bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-md transition duration-200"
                >
                    Suivre ma commande
                </button>
            </div>
        </div>
    )
}
