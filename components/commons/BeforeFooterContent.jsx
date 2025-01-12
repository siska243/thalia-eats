import React from "react";
import ContactInfo from "./ContactInfo";
import Map from "./Map";
import Reviews from "./Reviews";
import SectionPopularResto from "../home/SectionPopularResto";

export default function BeforeFooterContent({ restaurant, infoResto }) {



  const data = restaurant;
  return (
    <section className="py-4 md:py-12">
      <div className="max-w-[1300px] mx-auto px-3 md:px-5">
        {/* <ContactInfo /> */}
        <Map data={data == undefined ? [] : data} infoResto={infoResto} />
      </div>
      {/* reviews */}
      {/* <Reviews /> */}
      <SectionPopularResto />
    </section>
  );
}
