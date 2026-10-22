"use client";

import { FetchData } from "@/helpers/FetchData";
import { Route } from "@/helpers/Route";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import Link from "next/link";
import React, { useState } from "react";
import {removeToken} from "@/server/manageToken";
import Notify from "@/components/toastify/Notify";

export default function Settings({ isSettingOpen, isMobile }) {
  const [loading, setLoading] = useState(false);
  const { user } = useGetCurrentUser();

  const handlerLogout = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const response = await FetchData.sendData(Route.logout)

      // `response.success` n'existe pas : ce champ venait de la route du
      // paquet rupadana, que ce code appelait par erreur. Notre endpoint
      // repond par l'enveloppe ApiResponse, et FetchData RETOURNE l'erreur
      // axios au lieu de la lever — c'est elle qu'on teste, comme partout
      // ailleurs dans cette application.
      if (response?.name === "AxiosError") {
        // Le jeton est peut-etre deja invalide cote serveur. On ferme la
        // session locale quand meme : sans ca le client reste enferme dans
        // une session qu'aucun clic ne peut plus terminer.
        Notify("Session fermée ici, le serveur n'a pas confirmé", "error");
      }
    } catch {
      Notify("Session fermée ici, le serveur n'a pas confirmé", "error");
    }

    await removeToken()

    // Rechargement complet, et non `router.replace()` + `router.refresh()`.
    // Les cookies de session vivent cote serveur, mais le compte est AUSSI
    // en memoire du navigateur : cache TanStack Query (`query-check-account`)
    // et magasin Redux (slice `account`, panier). Une navigation cliente ne
    // vide ni l'un ni l'autre, l'en-tete continuait donc d'afficher
    // l'utilisateur connecte apres une deconnexion pourtant reussie.
    //
    // La regle Next ci-dessous conseille `useRouter().push()` : suivre ce
    // conseil ICI est precisement ce qui a casse la deconnexion. C'est le
    // seul endroit de l'application ou le rechargement est voulu.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = '/';
  }
  if (isMobile) {
    return (<div
      className={`absolute transition-all duration-300 ${isSettingOpen
        ? "top-full opacity-100 visible w-full px-5"
        : "top-[-100%] opacity-0 invisible"
        } mt-3 rounded-lg p-5 shadow-md flex flex-col w-full z-[9999999] bg-white gap-3 overflow-hidden`}
    >
      <a
        href="/reglages"
        className="text-base text-primaryColor text-center"
      >
        Réglages
      </a>
      {/* button de deconnexion */}
      <button
        onClick={handlerLogout}

        className="text-sm text-white bg-red-500 p-3 rounded-full text-center"
      >
        Déconnexion

      </button>
    </div>)
  }

  return (
    <div
      className={`absolute transition-all duration-300 ${isSettingOpen
        ? "top-full opacity-100 visible"
        : "top-[-100%] opacity-0 invisible"
        } mt-3 rounded-lg p-5 shadow-md flex flex-col w-full z-[999] bg-white gap-3 overflow-hidden`}
    >
      <Link
        href="/reglages"
        className="text-base text-primaryColor text-center"
      >
        Réglages
      </Link>
      {/* button de deconnexion */}
      <button
        onClick={handlerLogout}

        className="text-sm text-white bg-red-500 p-3 rounded-full text-center"
      >
        {
          loading ? "chargement" : "Déconnexion"
        }

      </button>
    </div>
  );
}
