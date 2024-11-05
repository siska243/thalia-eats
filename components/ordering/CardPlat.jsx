import Image from "next/image";
import React from "react";

export default function CardPlat({ plat }) {
  return (
    <div className="shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-5 rounded-xl">
      {/* top section */}
      <div className="flex justify-between items-center">
        {/* left content */}
        <div className="flex flex-col gap-5 w-[50%]">
          <h3 className="text-balck font-semibold text-xl">{plat.name}</h3>
          <p className="text-gray-800 text-sm leading-6">{plat.contenu}</p>
        </div>

        {/* right content */}
        <div className="w-[150px] h-[150px]">
          <Image
            src={plat.image}
            alt={plat.name}
            width={200}
            height={200}
            className="rounded-full object-cover h-full w-full"
          />
        </div>
      </div>
      {/* bottom section */}
      <div className="mt-10 flex gap-4 flex-wrap">
        {Object.entries(plat.prix[0]).map(([taille, prix]) => (
          <button
            key={taille}
            className="p-2 border border-gray-300 flex gap-2 items-center justify-between text-sm min-w-[100px] rounded-md shadow-sm"
          >
            <span className="capitalize font-semibold">{taille}</span>
            <span className="py-1 px-3 bg-green-700 text-white rounded-md ">
              € {prix}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
