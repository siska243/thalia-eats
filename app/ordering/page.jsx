import BannerResto from "@/components/commons/BannerResto";
import Image from "next/image";
import React from "react";
import searchLogo from "@/public/assets/images/search.png";
import BeforeFooterContent from "@/components/commons/BeforeFooterContent";
import SideMenu from "@/components/ordering/SideMenu";
import MainContent from "@/components/ordering/MainContent";
import Order from "@/components/ordering/Order";
import cookImg from "@/public/assets/images/cook.png";
import Link from "next/link";

export default function page() {
  const menu = [
    {
      name: "pizzas",
    },
    {
      name: "Garlic Bread",
    },
    {
      name: "Calzone",
    },
    {
      name: "Kebabas",
    },
    {
      name: "Salads",
    },
    {
      name: "Cold drinks",
    },
    {
      name: "Happy Meal",
    },
    {
      name: "Desserts",
    },
    {
      name: "Hot drinks",
    },
    {
      name: "Sauces",
    },
  ];
  return (
    <>
      {/* banner resto section */}
      <BannerResto />
      <section className="mb-10">
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
      <section className="max-w-[1300px] mx-auto px-3 md:px-5">
        {/* choix du menu uniquement visible sur le mobile */}
        <div className="lg:hidden py-5 border rounded-lg border-[#BCBCBC] bg-[#FBFBFB] overflow-hidden mb-4 flex justify-between">
          <div className="flex gap-3 pl-5 items-center">
            <Image src={cookImg} width={30} height={20} />
            <h3 className="text-2xl font-semibold text-black">Menu</h3>
          </div>
          <form className="mr-4">
            <select className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out ">
              <option value="">Choose an option</option>
              {menu.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </form>
        </div>
        {/* ************* */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5">
          {/* SideMenu occupe 1/4 de la largeur totale */}
          <div className="col-span-1 hidden lg:block">
            <SideMenu />
          </div>

          {/* MainContent occupe 1/2 de la largeur totale */}
          <div className="col-span-2 bg-white">
            <MainContent />
          </div>

          {/* Order occupe 1/4 de la largeur totale */}
          <div className="col-span-2 md:col-span-1">
            <Order />
          </div>
        </div>
      </section>

      {/* beforefootercontent section */}
      <BeforeFooterContent />
    </>
  );
}
