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
      <section className="mb-6 md:mb-10">
        <div className="max-w-[1300px] mx-auto px-5 flex flex-col gap-3 items-center justify-between sm:flex-row">
          <p className="text-base lg:text-lg font-semibold">
            All Offers from McDonald’s East London
          </p>
          <form className="flex  items-center gap-4 rounded-full border border-secondaryColor py-2 px-4 md:py-3 md:px-6">
            <Image src={searchLogo} width={20} />
            <input
              className="border-none outline-none"
              type="search"
              name=""
              id=""
              placeholder="Search from menu..."
            />
          </form>
        </div>
      </section>
      {/* ********************** */}
      <section className="bg-primaryColor">
        <div className="max-w-[1300px] mx-auto px-3 md:px-5 flex items-center justify-between py-3 md:py-5 gap-2 md:gap-3 overflow-auto lg:overflow-hidden">
          {/*         */}
          <button className="transition-all duration-300 text-white bg-black py-2 md:px-6 px-4 rounded-full text-sm border border-transparent flex-shrink-0">
            Offers
          </button>
          <button className="transition-all duration-300 text-white py-2 md:px-6 px-4 rounded-full text-sm hover:text-white hover:bg-black border-transparent hover:border-black flex-shrink-0">
            Burgers
          </button>
          <button className="transition-all duration-300 text-white py-2 md:px-6 px-4 rounded-full text-sm hover:text-white hover:bg-black border-transparent hover:border-black flex-shrink-0">
            Fries
          </button>
          <button className="transition-all duration-300 text-white py-2 md:px-6 px-4 rounded-full text-sm hover:text-white hover:bg-black border-transparent hover:border-black flex-shrink-0">
            Snacks
          </button>
          <button className="transition-all duration-300 text-white py-2 md:px-6 px-4 rounded-full text-sm hover:text-white hover:bg-black border-transparent hover:border-black flex-shrink-0">
            Salads
          </button>
          <button className="transition-all duration-300 text-white py-2 md:px-6 px-4 rounded-full text-sm hover:text-white hover:bg-black border-transparent hover:border-black flex-shrink-0">
            Cold drinks
          </button>

          <button className="transition-all duration-300 text-white ppy-2 md:px-6 px-4 rounded-full text-sm hover:text-white hover:bg-black border-transparent hover:border-black flex-shrink-0">
            Orbit®
          </button>
          <button className="transition-all duration-300 text-white py-2 md:px-6 px-4 rounded-full text-sm hover:text-white hover:bg-black border-transparent hover:border-black flex-shrink-0">
            Desserts
          </button>
          <button className="transition-all duration-300 text-white py-2 md:px-6 px-4 rounded-full text-sm hover:text-white hover:bg-black border-transparent hover:border-black flex-shrink-0">
            Sauces
          </button>
        </div>
      </section>
      {/* ********************* */}
      <SectionOffers />
      {/* ********************** */}
      <section className="max-w-[1300px] mx-auto px-3 md:px-5 pb-6 md:pb-12">
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
