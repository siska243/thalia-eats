"use client"
import React, {useEffect, useState} from 'react';
import OrderingTracking from '@/components/tracking/OrderingTracking';
import {FetchData} from "@/helpers/FetchData";
import {Route} from '@/helpers/Route';
import Loader from '@/components/Loader/Loader';
import useGetCurrentUser from '@/hooks/useGetCurrentUser';
import Link from 'next/link';
import useReferentialData from "@/hooks/useQueryTanStack";
import TrackingPage from "@/components/ordering/Map";

export default function Page() {


    const {data, isLoading,refetch} = useReferentialData({
        url: Route.tracking_commande,
        queryKey: 'track-order'
    })

    const {user} = useGetCurrentUser();


    if (isLoading) {
        return <Loader/>;
    }

    // 1. Vérification de la connexion en premier
//   if (!user) {
//     return (
//       <div className="max-w-[1300px] mx-auto px-3 md:px-5 flex items-center justify-center min-h-screen flex-col gap-5">
//         <p data-aos="fade-up" className="text-center text-primaryColor text-base md:text-lg font-semibold">
//           Veuillez vous connecter pour accéder à vos commandes.
//         </p>
//         <Link 
//           data-aos="fade-up" 
//           href="/login" // Adapte le chemin selon ta route de connexion
//           className="py-3 px-6 bg-primaryColor text-white rounded-full shadow-lg hover:bg-secondaryColor transition-colors"
//         >
//           Se connecter
//         </Link>
//       </div>
//     )
//   }


    if (!data || data.length === 0) {
        return (
            <div
                className="max-w-[1300px] mx-auto px-3 md:px-5 flex items-center justify-center min-h-screen flex-col gap-5">
                <p data-aos="fade-up" className="text-center text-primaryColor text-base md:text-lg font-semibold">
                    Vous n'avez pas de commandes.
                </p>
                <Link
                    data-aos="fade-up"
                    href="/restaurant"
                    className="py-3 px-6 bg-primaryColor text-white rounded-full shadow-lg hover:bg-secondaryColor transition-colors"
                >
                    Consulter les restaurants
                </Link>
            </div>
        );
    }

    return (
        <div className='h-full pt-[220px] md:pt-[230px]'>
            {/* <Banner /> */}
            <OrderingTracking data={data ?? []} refetch={refetch}/>
        </div>
    );
}
