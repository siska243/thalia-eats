import React from "react";

import RestoCard from "./CardResto";
import CardPopularResto from "./CardPopularResto";

export default function SectionPopularResto() {
  const restoData = [
    {
      imageSrc: "@/public/assets/images/food.png", // Les chemins réels de tes images
      title: "Titre 1",
      resto: "21 restaurants",
    },
    {
      imageSrc: "@/public/assets/images/food.png", // Les chemins réels de tes images
      title: "Titre 2",
      resto: "21 restaurants",
    },
    {
      imageSrc: "@/public/assets/images/food.png", // Les chemins réels de tes images
      title: "Titre 3",
      resto: "90 restaurants",
    },
    {
      imageSrc: "@/public/assets/images/food.png", // Les chemins réels de tes images
      title: "Titre 4",
      resto: "10 restaurants",
    },
    {
      imageSrc: "@/public/assets/images/food.png", // Les chemins réels de tes images
      title: "Titre 5",
      resto: "6 restaurants",
    },
    {
      imageSrc: "@/public/assets/images/food.png", // Les chemins réels de tes images
      title: "Titre 6",
      resto: "30 restaurants",
    },
  ];
  return (
    <section className="my-12 max-w-[1300px] mx-auto px-5">
      <div>
        <p className="text-2xl font-semibold text-secondaryColor mb-12">
          Popular Restaurants
        </p>
        <div className="grid grid-cols-6 gap-4">
          {restoData.map(({ imageSrc, title, resto }, index) => {
            return (
              <CardPopularResto key={index} imageSrc={imageSrc} title={title} />
            );
          })}
        </div>
      </div>
    </section>
  );
}
