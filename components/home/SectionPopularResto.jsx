import React from "react";
import restoImage from "@/public/assets/images/restoPopular.png";
import CardPopularResto from "./CardPopularResto";

export default function SectionPopularResto({ data }) {

    const shuffledProducts = data?.sort(() => 0.5 - Math.random()).slice(0, 10);
  return (
    <section className="my-6 lg:my-12 max-w-[1300px] mx-auto px-3 md:px-5">
      <div>
        <h2 data-aos="fade-up" className="text-xl lg:text-2xl font-semibold text-secondaryColor text-center lg:text-left mb-10">
          Les plats populaires
        </h2>
        <div data-aos="fade-up" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {shuffledProducts?.map((preview) => {
            return (
              <CardPopularResto key={preview.uid} preview={preview} />
            );
          })}
        </div>
      </div>
    </section>
  );
}
