import React from "react";
import { IoClose } from "react-icons/io5";
import { FaCircleArrowRight } from "react-icons/fa6";

import PizzaImg from "@/public/assets/images/pizzaFood.png";
import PanierItems from "./PanierItems";
import FoodImg from "@/public/assets/images/food.png";
import Image from "next/image";

export default function Panier({ toggleShowPanier }) {
  const panierItems = [
    {
      name: "Margherita",
      img: FoodImg,
    },
    {
      name: "Margherita",
      img: FoodImg,
    },
    {
      name: "Margherita",
      img: FoodImg,
    },
  ];
  return (
    <div className="absolute top-0 left-0 right-0 z-[99999] w-full bg-black/90 h-screen flex justify-center items-center overflow-hidden ">
      <div className="w-[600px] bg-white relative rounded-xl">
        {/* bouton clos popup */}
        <button
          className="absolute -top-5 -right-5 bg-primaryColor w-[40px] h-[40px] rounded-full flex justify-center items-center text-2xl text-white"
          onClick={toggleShowPanier}
        >
          <IoClose />
        </button>
        <div className="w-full h-[150px] overflow-hidden rounded-t-xl">
          <Image src={PizzaImg} className="w-full h-full object-cover" />
        </div>

        <div className="py-4 px-6 ">
          {/* panier items */}
          <p className="mb-5 text-sm text-gray-500">
            Please select your first Pizza
          </p>
          <div className="flex flex-col gap-4 overflow-y-scroll">
            {panierItems.map((item, index) => {
              return <PanierItems key={index} item={item} />;
            })}
          </div>
        </div>

        {/* le prix et la commande */}

        <div className="p-5">
          <div className="flex items-center gap-5 justify-between">
            <p className="bg-primaryColor p-3 rounded-md text-white flex items-center gap-4 text-sm">
              Total to pay <span className="font-medium text-lg">€127.90</span>
            </p>
            <p className="text-sm text-gray-700 font-medium">
              Delivery & Tax will be calculated in the next step
            </p>
          </div>
          {/* **************** */}
          <div className="mt-5 flex items-center gap-5 justify-end">
            <a href="" className="text-sm underline text-gray-600">
              Take me back
            </a>
            <button className="flex gap-5 items-center bg-green-700 text-white py-3 px-9 rounded-md">
              <FaCircleArrowRight />
              <span> Next Step</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
