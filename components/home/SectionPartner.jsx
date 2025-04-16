import React from "react";
import CardPartner from "./CardPartner";
import partnerImg from "@/public/assets/images/partner.png";
import thalia1 from "@/public/assets/images/resto-image.jpeg";
import thalia2 from "@/public/assets/thalia2.jpg";
// import thalia2 from "@/public/assets/images/thalia2.jpeg";

export default function SectionPartner() {
  const partnerData = [
    {
      imageSrc: thalia1, // Les chemins réels de tes images
      title: "Commencer comme restaurant",
      secondTitle: "Inscrivez-vous en tant que restaurant",
      topTitle: "Gagnez plus de client",
      btnLink: "/",
    },
    {
      imageSrc: thalia2, // Les chemins réels de tes images
      title: "Roulez avec nous",
      secondTitle: "Inscrivez-vous en tant que livreur",
      topTitle: "Roulez à votre rythme",
      btnLink: "/",
    },
  ];
  return (
    <section className="my-8 md:my-16 max-w-[1300px] mx-auto px-3 md:px-5">
      <div className="w-full bg-white rounded-xl">
        <div data-aos="fade-up" className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
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
