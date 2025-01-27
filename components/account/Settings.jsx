import { FetchData } from "@/helpers/FetchData";
import { Route } from "@/helpers/Route";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import Link from "next/link";
import React, { useState } from "react";

export default function Settings({ isSettingOpen, isMobile }) {
  const [loading, setLoading] = useState(false);
  const { user } = useGetCurrentUser();

  const handlerLogout = async () => {
    if (user) {
      try {
        setLoading(true);
        const response = await FetchData.getData(Route.logout)

        if (response.status == "success") {
          console.log(response);
          window.location.href = '/';
        } else {
          console.log("oups");

        }
      } catch (error) {
      } finally {
        setLoading(false);
      }

    }

  }
  if (isMobile) {
    return (<div
      className={`absolute transition-all duration-300 ${isSettingOpen
        ? "top-full opacity-100 visible w-full px-5"
        : "top-[-100%] opacity-0 invisible"
        } mt-3 rounded-lg p-5 shadow-md flex flex-col w-full z-[9999999] bg-white gap-3 overflow-hidden`}
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
