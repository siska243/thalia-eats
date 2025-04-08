"use client";
import React, { useEffect, useState } from "react";
import HistoryOrder from "@/components/historique/HistoryOrder";
import { FetchData } from "@/helpers/FetchData";
import { Route } from "@/helpers/Route";
import Loader from "@/components/Loader/Loader";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import Link from "next/link";

export default function page() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  // Récupérer l'utilisateur connecté
  const { user } = useGetCurrentUser();

  // Fonction pour récupérer l'historique des commandes
  const fetchHistorique = async () => {
    try {
      setLoading(true);
      const response = await FetchData.getData(Route.historique_commande);
      if (response?.name === "AxiosError") {
        console.error(response.error);
      } else {
        setData(response);

        console.log('Historique des commandes:', response);
        
      }
    } catch (error) {
      console.error(
        "Erreur lors du chargement de l'historique des commandes :",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorique();
  }, []);

  if (loading) {
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
          href="/restaurants"
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
