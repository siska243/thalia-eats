import Image from "next/image";
import React from "react";

export default function cardAbout({ title, content, imageSrc }) {
  return (
    <div className="bg-[#D9D9D9] p-10  rounded-md flex gap-3 flex-col items-center justify-center w-full">
      <p className="text-sm lg:text-base font-semibold text-center ">{title}</p>
      <Image src={imageSrc} width={100} height={100} alt={title} />
      <p className="text-center font-light text-xs md:text-sm">{content}</p>
    </div>
  );
}
