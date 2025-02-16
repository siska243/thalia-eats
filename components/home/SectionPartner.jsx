import React from "react";
import CardPartner from "./CardPartner";
import partnerImg from "@/public/assets/images/partner.png";
import thalia1 from "@/public/assets/thalia1.jpg";
import thalia2 from "@/public/assets/thalia2.jpg";
// import thalia2 from "@/public/assets/images/thalia2.jpeg";

export default function SectionPartner() {
  const partnerData = [
    {
      imageSrc: thalia1, // Les chemins réels de tes images
      title: "Devenez notre partenaire",
      secondTitle: "Inscrivez-vous en tant qu'entreprise",
      topTitle: "Gagnez plus avec des frais réduits",
      btnLink: "/",
    },
    {
      imageSrc: thalia2, // Les chemins réels de tes images
      title: "Roulez avec nous",
      secondTitle: "Inscrivez-vous en tant que livreur",
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
