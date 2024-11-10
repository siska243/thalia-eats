import React from "react";
import CardPartner from "./CardPartner";

export default function SectionPartner() {
  const partnerData = [
    {
      imageSrc: "@/assets/images/food.png", // Les chemins réels de tes images
      title: "Partner with us",
      secondTitle: "Signup as a business",
      topTitle: "Earn more with lower fees",
      btnLink: "/",
    },
    {
      imageSrc: "@/assets/images/food.png", // Les chemins réels de tes images
      title: "Ride with us",
      secondTitle: "Signup as a rider",
      topTitle: "Avail exclusive perks",
      btnLink: "/",
    },
  ];
  return (
    <section className="my-8 md:my-16 max-w-[1300px] mx-auto px-3 md:px-5">
      <div className="w-full bg-white rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
          {partnerData.map(
            ({ imageSrc, title, secondTitle, topTitle, btnLink }, index) => {
              return (
                <CardPartner
                  key={index}
                  imageSrc={imageSrc}
                  title={title}
                  secondTitle={secondTitle}
                  topTitle={topTitle}
                  btnLink={btnLink}
                />
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}
