"use client";
import React, { useEffect, useState } from "react";
import HistoryOrder from "@/components/historique/HistoryOrder";
import { FetchData } from "@/helpers/FetchData";
import { Route } from "@/helpers/Route";
import Loader from "@/components/Loader/Loader";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import Link from "next/link";
import useReferentialData from "@/hooks/useQueryTanStack";

export default function page() {

  const {data,isLoading}=useReferentialData({
    url:Route.historique_commande,
    queryKey:"get-historique"
  })

  // Récupérer l'utilisateur connecté
  const { user } = useGetCurrentUser();



  if (isLoading) {
    return <Loader />;
  }

  // Vérification si l'utilisateur est connecté
  // if (!user) {
  //   return (
  //     <div className="max-w-[1300px] mx-auto px-3 md:px-5 flex flex-col items-center justify-center min-h-screen gap-5">
  //       <p data-aos="fade-up" className="text-center text-primaryColor text-base md:text-lg font-semibold">
  //         Veuillez vous connecter pour accéder à votre historique de commandes.
  //       </p>
  //       <Link
  //         data-aos="fade-up"
  //         href="/login"
  //         className="py-3 px-6 bg-primaryColor text-white rounded-full shadow-lg hover:bg-secondaryColor transition-colors"
  //       >
  //         Se connecter
  //       </Link>
  //     </div>
  //   );
  // }

  // S'il n'y a pas d'historique, afficher un message avec un lien vers les restaurants
  if (!data || data.length === 0) {
    return (
      <div className="max-w-[1300px] mx-auto px-3 md:px-5 flex flex-col items-center justify-center min-h-screen gap-5">
        <p data-aos="fade-up" className="text-center text-primaryColor text-base md:text-lg font-semibold">
          Votre historique des commandes est vide.
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
    <div className="h-full pt-[220px] md:pt-[230px]">
      {/* Affiche l'historique des commandes via le composant OrderingTracking */}
      <HistoryOrder data={data} />
    </div>
  );
}
