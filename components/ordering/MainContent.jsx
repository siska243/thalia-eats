import React from "react";
import { FaRegArrowAltCircleDown } from "react-icons/fa";
import CardPlat from "./CardPlat";
import PizzaImg from "@/public/assets/images/pizzaFood.png";

export default function MainContent() {
  const plats = [
    {
      name: "Farm House Xtreme Pizza",
      contenu:
        "1 McChicken™, 1 Big Mac™,  1 Royal Cheeseburger, 3 medium sized French Fries , 3 cold drinks",
      image: PizzaImg,
      prix: [
        {
          small: 21.9,
          meduim: 25.9,
          large: 27.9,
          xl: 32.9,
        },
      ],
    },
    {
      name: "Farm House Xtreme Pizza",
      contenu:
        "1 McChicken™, 1 Big Mac™,  1 Royal Cheeseburger, 3 medium sized French Fries , 3 cold drinks",
      image: PizzaImg,
      prix: [
        {
          small: 21.9,
          meduim: 25.9,
          large: 27.9,
          xl: 32.9,
        },
      ],
    },
    {
      name: "Farm House Xtreme Pizza",
      contenu:
        "1 McChicken™, 1 Big Mac™,  1 Royal Cheeseburger, 3 medium sized French Fries , 3 cold drinks",
      image: PizzaImg,
      prix: [
        {
          small: 21.9,
          meduim: 25.9,
          large: 27.9,
          xl: 32.9,
        },
      ],
    },
  ];
  return (
    <section className="py-5">
      {/* contenu d'un menu selectionné */}
      <div className="flex items-center justify-between mb-16">
        <h2 className="text-3xl text-primaryColor font-semibold">Pizza</h2>
        <form
          action=""
          className="flex items-center justify-between rounded-full bg-[#F6F6F6] p-3 pl-8 border border-gray-300 w-[250px] "
        >
          <input
            type="text"
            className="border-none outline-none bg-transparent placeholder:text-gray-800 placeholder:text-sm placeholder:font-normal"
            placeholder="Sort by Pricing"
          />
          <button>
            <FaRegArrowAltCircleDown className="text-2xl text-gray-700" />
          </button>
        </form>
      </div>

      {/* card menu selectionné */}
      <div className="flex flex-col gap-8">
        {plats.map((plat, index) => {
          return <CardPlat key={index} plat={plat} />;
        })}
      </div>
    </section>
  );
}
