"use client"
import React, { useEffect, useState } from 'react';
import OrderingTracking from '@/components/tracking/OrderingTracking';
import { FetchData } from "@/helpers/FetchData";
import { Route } from '@/helpers/Route';
import Loader from '@/components/Loader/Loader';

export default function Page() {
   const [loading, setLoading] = useState(true);
   const [data, setData] = useState(null);

   const handlerTraitement = async () => {
      try {
         setLoading(true);
         const response = await FetchData.getData(Route.traitement_commande);
         if (response.name == "AxiosError") {
            console.log(response.error);
         }
         else {
            console.log("response", response);
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

   return (
      <div className='h-full pt-[220px] md:pt-[230px]'>
         {/* <Banner /> */}
         <OrderingTracking data={data != undefined ? data : []} />
      </div>
   );
}
