import Image from "next/image";
import React from "react";
import { FaStar } from "react-icons/fa";
import { CiClock1 } from "react-icons/ci";

export default function CardReviews({ img, name, country, text, date }) {
  return (
    <div className="bg-white p-5 rounded-md">
      <div className="flex justify-between">
        {/* left */}
        <div className="flex gap-3">
          <Image
            src={img}
            width={30}
            height={30}
            className="object-cover rounded-full w-[50px] h-[50px]"
          />
          <div className="border-l-2 border-l-primaryColor pl-3">
            <h5 className="text-black font-semibold text-base">{name}</h5>
            <p className="text-primaryColor text-sm font-extralight">
              {country}
            </p>
          </div>
        </div>
        {/* right */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 text-primaryColor text-base">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>
          <div className="flex items-center gap-2">
            <CiClock1 className="text-primaryColor text-lg" />
            <p className="text-sm text-black font-extralight">{date}</p>
          </div>
        </div>
      </div>
      <p className="py-5 text-justify font-light text-sm">{text}</p>
    </div>
  );
}
