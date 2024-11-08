"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaLocationDot } from "react-icons/fa6";
import { FaShoppingBag, FaCloudDownloadAlt } from "react-icons/fa";
import Panier from "../popups/Panier";

export default function TopBar() {
  const [showPanier, setShowPanier] = useState(false);
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
      <div className="pl-5 bg-fourthColor shadow-sm rounded-xl  rounded-t-none border flex items-center justify-between overflow-hidden">
        <div className="flex gap-3 items-center">
          <div>🌟</div>
          <p className="font-[400] text-secondaryColor text-sm">
            Get 5% Off your first order,
            <span className="text-primaryColor">Promo: ORDER5</span>
          </p>
        </div>
        {/* ************************* */}
        <div className="flex gap-8">
          <div className="flex gap-4 items-center">
            <p className="text-xl">
              <FaLocationDot />
            </p>
            <p className="font-[400] text-secondaryColor text-sm">
              Regent Street, A4, A4201, London
            </p>
            <p className="font-[400] text-primaryColor text-sm underline">
              <Link href="/">Change Location</Link>
            </p>
          </div>
          {/* ********************* */}
          <div className="bg-[#3C8744] rounded-xl rounded-t-none flex">
            <button
              className="p-4 text-white text-xl"
              onClick={toggleShowPanier}
            >
              <FaShoppingBag />
            </button>
            <p className="p-4 text-white border-l text-sm border-gray-300/65">
              23 Items
            </p>
            <p className="p-4 text-white border-l text-sm border-gray-300/65">
              GBP 79.89
            </p>

            <p className="p-4 text-white text-xl border-l border-gray-300/65">
              <FaCloudDownloadAlt />
            </p>
          </div>
        </div>
      </div>
      {showPanier && <Panier toggleShowPanier={toggleShowPanier} />}
    </>
  );
}
