"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaLocationDot } from "react-icons/fa6";
import { FaShoppingBag } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";
import Panier from "../popups/Panier";
import useCreateOrdering from "@/hooks/useCreateOrdering";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import { calcul_price } from "@/helpers/calculePrice";

export default function TopBar() {
  const { user } = useGetCurrentUser();
  const [showPanier, setShowPanier] = useState(false);
  const { ordering } = useCreateOrdering();
  // Empêche le défilement lorsque le popup est visible
  useEffect(() => {
    if (showPanier) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPanier]);

  const toggleShowPanier = () => {
    setShowPanier(!showPanier);
  };

  return (
    <>
      <div className="pl-2 sm:pl-5 bg-fourthColor shadow-sm sm:rounded-xl sm:rounded-t-none border flex items-center justify-between overflow-hidden">
        <div className="hidden md:flex gap-3 items-center">
          <div>🌟</div>
          <p className="font-[400] text-secondaryColor text-xs md:text-sm">
            Commander en toute sécurité,{" "}
            <span className="text-primaryColor">Thalia-Eats</span>
          </p>
        </div>

        {/* Adresse visible sur les petits écrans */}
        <div className="flex md:hidden gap-3 items-center">
          {user ? (
            <div className="flex items-center gap-1">

              {
                user?.user?.street && (
                  <>
                    <p className="text-xl">
                      <FaLocationDot />
                    </p>
                    <p className="font-[400] block text-secondaryColor text-sm">
                      {user?.user?.street}, N°{user?.user?.number_street}, C/{user?.user?.town_id?.title}
                    </p>
                  </>
                )
              }

            </div>
          ) : (
            <div className="flex gap-3 items-center">
              <div>🌟</div>
              <p className="font-[400] text-secondaryColor text-xs md:text-sm">
                Commander en toute sécurité,{" "}
                <span className="text-primaryColor">Thalia-Eats</span>
              </p>
            </div>
          )}
        </div>

        {/* Panier et Tracking */}
        <div className="flex gap-8">
          <div className="hidden md:flex gap-3 items-center">
            {user && (

              // adrrsse visible sur les grands écrans
              <div className="flex items-center gap-1">
                {
                  user?.user?.street && (
                    <>
                      <p className="text-xl">
                        <FaLocationDot />
                      </p>


                      <p className="font-[400] block text-secondaryColor text-sm">
                        {user?.user?.street}, N°{user?.user?.number_street}, C/{user?.user?.town_id?.title}
                      </p>
                    </>
                  )
                }


              </div>
            )}
          </div>

          <div className="bg-[#3C8744] sm:rounded-xl sm:rounded-t-none flex items-center">
            {/* Bouton Panier */}
            <button
              className="relative p-4 h-full flex items-center justify-center text-white text-xl md:text-3xl"
              onClick={toggleShowPanier}
            >
              <FaShoppingBag className="w-6 h-6" />
              <span className="absolute top-[5px] right-[5px] bg-primaryColor h-5 w-5 text-xs rounded-full flex items-center justify-center pointer-events-none">
                {ordering.length}
              </span>
            </button>

            <p className="p-3 md:p-4 text-white border-l text-xs md:text-sm border-gray-300/65">
              {calcul_price(ordering)} {ordering[0]?.product?.currency.code}
            </p>

            <Link
              href="/tracking"
              className="p-4 text-white text-3xl border-l border-gray-300/65 flex items-center justify-center"
            >
              <MdLocalShipping className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>

      {showPanier && <Panier toggleShowPanier={toggleShowPanier} />}
    </>
  );
}
