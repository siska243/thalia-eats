import BannerResto from "@/components/commons/BannerResto";
import React from "react";
import searchLogo from "@/public/assets/images/search.png";
import Image from "next/image";
import SectionOffers from "@/components/restaurants/SectionOffers";
import SectionAll from "@/components/restaurants/SectionAll";
import BeforeFooterContent from "@/components/commons/BeforeFooterContent";

export default function restaurants() {
  return (
    <>
      <BannerResto />
      <section className="mb-10">
        <div className="max-w-[1300px] mx-auto px-5 flex items-center justify-between">
          <p className="text-lg font-semibold">
            All Offers from McDonald’s East London
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
      {/* ********************** */}
      <section className="bg-primaryColor">
        <div className="max-w-[1300px] mx-auto px-5 flex items-center justify-between py-5 gap-3">
          {/*         */}
          <button className="transition-all duration-300 text-white bg-black py-2 px-6 rounded-full text-sm border border-transparent">
            Offers
          </button>
          <button className="transition-all duration-300 text-white py-2 px-6 rounded-full text-sm hover:text-white hover:bg-black border-transparent hover:border-black">
            Burgers
          </button>
          <button className="transition-all duration-300 text-white py-2 px-6 rounded-full text-sm hover:text-white hover:bg-black border-transparent hover:border-black">
            Fries
          </button>
          <button className="transition-all duration-300 text-white py-2 px-6 rounded-full text-sm hover:text-white hover:bg-black border-transparent hover:border-black">
            Snacks
          </button>
          <button className="transition-all duration-300 text-white py-2 px-6 rounded-full text-sm hover:text-white hover:bg-black border-transparent hover:border-black">
            Salads
          </button>
          <button className="transition-all duration-300 text-white py-2 px-6 rounded-full text-sm hover:text-white hover:bg-black border-transparent hover:border-black">
            Cold drinks
          </button>

          <button className="transition-all duration-300 text-white py-2 px-6 rounded-full text-sm hover:text-white hover:bg-black border-transparent hover:border-black">
            Orbit®
          </button>
          <button className="transition-all duration-300 text-white py-2 px-6 rounded-full text-sm hover:text-white hover:bg-black border-transparent hover:border-black">
            Desserts
          </button>
          <button className="transition-all duration-300 text-white py-2 px-6 rounded-full text-sm hover:text-white hover:bg-black border-transparent hover:border-black">
            Sauces
          </button>
        </div>
      </section>
      {/* ********************* */}
      <SectionOffers />
      {/* ********************** */}
      <section className="max-w-[1300px] mx-auto px-5 pb-12">
        <div className="flex flex-col gap-12">
          <SectionAll />
          <SectionAll />
          <SectionAll />
        </div>
      </section>
      {/* before footer content */}
      <BeforeFooterContent />
    </>
  );
}
