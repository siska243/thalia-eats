"use client";
// Import Swiper core and required modules
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import personImg from "@/public/assets/images/person.png";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CardReviews from "./CardReviews";

export default function Reviews() {
  const personData = [
    {
      name: "St Glx",
      country: "South London",
      img: personImg,
      date: "September",
      text: "The positive aspect was undoubtedly the efficiency of the service. The queue moved quickly, the staff was friendly, and the food was up to the usual McDonald's standard – hot and satisfying.",
    },
    {
      name: "St Glx",
      country: "South London",
      img: personImg,
      date: "September",
      text: "The positive aspect was undoubtedly the efficiency of the service. The queue moved quickly, the staff was friendly, and the food was up to the usual McDonald's standard – hot and satisfying.",
    },
    {
      name: "St Glx",
      country: "South London",
      img: personImg,
      date: "September",
      text: "The positive aspect was undoubtedly the efficiency of the service. The queue moved quickly, the staff was friendly, and the food was up to the usual McDonald's standard – hot and satisfying.",
    },
    {
      name: "St Glx",
      country: "South London",
      img: personImg,
      date: "September",
      text: "The positive aspect was undoubtedly the efficiency of the service. The queue moved quickly, the staff was friendly, and the food was up to the usual McDonald's standard – hot and satisfying.",
    },
  ];
  return (
    <section className="bg-[#D9D9D9] mt-12 py-20">
      <div className="max-w-[1300px] mx-auto px-5">
        {/* Head */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-black">Customer Reviews</h3>
          <div className="flex gap-4">
            <button className="bg-primaryColor p-4 rounded-full text-secondaryColor button-prev">
              <FaArrowLeft className="text-sm" />
            </button>
            <button className="bg-primaryColor p-4 rounded-full text-secondaryColor button-next">
              <FaArrowRight className="text-sm" />
            </button>
          </div>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Navigation, Pagination]} // Modules de navigation et pagination
          spaceBetween={10} // Espace entre les slides
          slidesPerView={1} // Nombre de slides visibles
          navigation={{
            prevEl: ".button-prev",
            nextEl: ".button-next",
          }}
          breakpoints={{
            640: {
              slidesPerView: 2, // 2 slides visibles sur les écrans moyens
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3, // 3 slides visibles sur les écrans larges
              spaceBetween: 30,
            },
          }}
          pagination={{ clickable: true }} // Pagination cliquable
        >
          {personData.map(({ name, country, img, date, text }, index) => {
            return (
              <SwiperSlide key={index}>
                <CardReviews
                  name={name}
                  country={country}
                  img={img}
                  date={date}
                  text={text}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
