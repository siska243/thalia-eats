import React from "react";
import ContactInfo from "./ContactInfo";
import Map from "./Map";
import Reviews from "./Reviews";
import SectionPopularResto from "../home/SectionPopularResto";

export default function BeforeFooterContent() {
  return (
    <section className="py-12">
      <div className="max-w-[1300px] mx-auto px-5">
        <ContactInfo />
        <Map />
      </div>
      <Reviews />
      <SectionPopularResto />
    </section>
  );
}
