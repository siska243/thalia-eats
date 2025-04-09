"use client"
import React, { useEffect, useState } from 'react';
import OrderingTracking from '@/components/tracking/OrderingTracking';
import { FetchData } from "@/helpers/FetchData";
import { Route } from '@/helpers/Route';
import Loader from '@/components/Loader/Loader';
import useGetCurrentUser from '@/hooks/useGetCurrentUser';
import Link from 'next/link';

export default function Page() {
   const [loading, setLoading] = useState(true);
   const [data, setData] = useState(null);
     // recuperer l'utilisateur connecté
      const { user } = useGetCurrentUser();

   const handlerTraitement = async () => {
      try {
         setLoading(true);
         const response = await FetchData.getData(Route.traitement_commande);
         if (response.name == "AxiosError") {
            console.log(response.error);
         }
         else {
            setData(response);
         }
         setData(response);
      } catch (e) {
         console.error("Erreur lors du traitement :", e);
      } finally {
         // Corrigez ici : passez à `false` après la tentative de récupération des données.
         setLoading(false);
      }
   };

   useEffect(() => {
      handlerTraitement();
   }, []);

   if (loading) {
      return <Loader />;
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

    // Vérifier si les données de commandes sont vides et afficher un message le cas échéant
    if (!data || data.length === 0) {
      return (
        <div className="max-w-[1300px] mx-auto px-3 md:px-5 flex items-center justify-center min-h-screen flex-col gap-5">
          <p data-aos="fade-up" className="text-center text-primaryColor text-base md:text-lg font-semibold">
            Vous n'avez pas de commandes.
          </p>
          <Link
            data-aos="fade-up"
            href="/restaurants"
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
         <OrderingTracking data={data != undefined ? data : []} />
      </div>
   );
}
