import React from "react";
import restoImage from "@/public/assets/images/restoPopular.png";
import CardPopularResto from "./CardPopularResto";

export default function SectionPopularResto({ data }) {
  const restoData = [
    {
      imageSrc: restoImage, // Les chemins réels de tes images
      title: "Titre 1",
      resto: "21 restaurants",
    },
    {
      imageSrc: restoImage, // Les chemins réels de tes images
      title: "Titre 2",
      resto: "21 restaurants",
    },
    {
      imageSrc: restoImage, // Les chemins réels de tes images
      title: "Titre 3",
      resto: "90 restaurants",
    },
    {
      imageSrc: restoImage, // Les chemins réels de tes images
      title: "Titre 4",
      resto: "10 restaurants",
    },
    {
      imageSrc: restoImage, // Les chemins réels de tes images
      title: "Titre 5",
      resto: "6 restaurants",
    },
    {
      imageSrc: restoImage, // Les chemins réels de tes images
      title: "Titre 6",
      resto: "30 restaurants",
    },
  ];

  console.log("previews", data);


  return (
    <section className="my-6 lg:my-12 max-w-[1300px] mx-auto px-3 md:px-5">
      <div>
        <h2 data-aos="fade-up" className="text-xl lg:text-2xl font-semibold text-secondaryColor text-center lg:text-left mb-10">
          Les plats populaires
        </h2>
        <div data-aos="fade-up" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {data?.data?.map((preview) => {
            return (
              <CardPopularResto key={preview.uid} preview={preview} />
            );
          })}
        </div>
      </div>
    </section>
  );
}
