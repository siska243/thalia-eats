"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaLocationDot } from "react-icons/fa6";
import { FaShoppingBag } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";
import Panier from "../popups/Panier";
import useCreateOrdering from "@/hooks/useCreateOrdering";

export default function TopBar() {
  const [showPanier, setShowPanier] = useState(false);
  const { ordering } = useCreateOrdering()
  // Empêche le défilement lorsque le popup est visible
  useEffect(() => {
    if (showPanier) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Nettoie l'effet quand le composant est démonté
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPanier]);
  const toggleShowPanier = () => {
    setShowPanier(!showPanier);
  };
  return (
    <>
      <div className="pl-2 sm:pl-5 bg-fourthColor shadow-sm sm:rounded-xl  sm:rounded-t-none border flex items-center justify-between overflow-hidden">
        <div className="flex gap-3 items-center">
          <div>🌟</div>
          <p className="font-[400] text-secondaryColor text-xs md:text-sm">
            Commander en toute securité,
            <span className="text-primaryColor"> Thalia-Eats</span>
          </p>
        </div>
        {/* ************************* */}
        <div className="flex gap-8">
          <div className="hidden md:flex gap-3 items-center">
            <div className="hidden lg:flex items-center gap-1">
              <p className="text-xl">
                <FaLocationDot />
              </p>
              <p className="font-[400] hidden md:block text-secondaryColor text-sm">
                Regent Street, A4, A4201, London
              </p>
            </div>
            {/* ****** */}
            {/* <p className="font-[400] text-primaryColor text-sm underline">
              <Link href="/">Change Location</Link>
            </p> */}
          </div>
          {/* ********************* panier partie */}
          <div className="bg-[#3C8744] sm:rounded-xl sm:rounded-t-none flex items-center">
            {/* le panier */}
            <button
              className="p-4 text-white text-xl md:text-3xl relative"
              onClick={toggleShowPanier}
            >
              <FaShoppingBag />
              <p className="absolute top-[5px] right-0 bg-primaryColor h-5 w-5 p-2 text-xs rounded-full flex items-center justify-center"> <span>{ordering.length} </span></p>
            </button>
            {/* <p className="p-4 text-white border-l text-sm border-gray-300/65">
              23 Items
            </p> */}
            <p className="hidden md:block p-4 text-white border-l text-xs md:text-sm border-gray-300/65">
              GBP 79.89
            </p>

            <Link href="/tracking" className=" p-4 text-white text-3xl border-l border-gray-300/65">
              <MdLocalShipping />
            </Link>
          </div>
        </div>
      </div>
      {showPanier && <Panier toggleShowPanier={toggleShowPanier} />}
    </>
  );
}
