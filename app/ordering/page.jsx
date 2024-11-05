import BannerResto from "@/components/commons/BannerResto";
import Image from "next/image";
import React from "react";
import searchLogo from "@/public/assets/images/search.png";
import BeforeFooterContent from "@/components/commons/BeforeFooterContent";
import SideMenu from "@/components/ordering/SideMenu";
import MainContent from "@/components/ordering/MainContent";
import Order from "@/components/ordering/Order";

export default function page() {
  return (
    <>
      {/* banner resto section */}
      <BannerResto />
      <section className="mb-10">
        <div className="max-w-[1300px] mx-auto px-5 flex items-center justify-between">
          <p className="text-lg font-semibold">
            Order from Tandoori Pizza London
          </p>
          <div className="flex items-center gap-4 rounded-full border border-secondaryColor py-3 px-6">
            <Image src={searchLogo} width={20} />
            <input
              className="border-none outline-none"
              type="search"
              name=""
              id=""
              placeholder="Search from menu..."
            />
          </div>
        </div>
      </section>
      <section className="max-w-[1300px] mx-auto px-5">
        <div className="grid grid-cols-4 gap-5">
          {/* SideMenu occupe 1/4 de la largeur totale */}
          <div className="col-span-1">
            <SideMenu />
          </div>

          {/* MainContent occupe 1/2 de la largeur totale */}
          <div className="col-span-2 bg-white">
            <MainContent />
          </div>

          {/* Order occupe 1/4 de la largeur totale */}
          <div className="col-span-1">
            <Order />
          </div>
        </div>
      </section>

      {/* beforefootercontent section */}
      <BeforeFooterContent />
    </>
  );
}
