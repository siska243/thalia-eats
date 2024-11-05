import Image from "next/image";
import React from "react";

export default function PanierItems({ item }) {
  return (
    <div className="bg-[#D9D9D999]/60 p-4 rounded-lg flex items-center justify-between">
      <div className="flex items-center ">
        <div className="border-r-2 border-gray-300 pr-4 mr-4">
          <Image
            src={item.img}
            alt={item.name}
            width={80}
            height={80}
            className="object-cover rounded-full w-[60px] h-[60px]"
          />
        </div>
        <h3 className="text-secondaryColor text-base font-medium">
          {item.name}
        </h3>
      </div>

      {/* changer le prix */}

      <div className="flex items-center gap-3">
        <button className="w-5 h-5 bg-secondaryColor text-white flex items-center justify-center rounded-full">
          -
        </button>
        <input
          type="number"
          className="w-10 h-10 rounded-md outline-none border border-white bg-white"
        />
        <button className="w-5 h-5 bg-secondaryColor text-white flex items-center justify-center rounded-full">
          +
        </button>
      </div>
    </div>
  );
}
