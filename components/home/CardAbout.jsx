import Image from "next/image";
import React from "react";
import imageSrc from "@/public/assets/images/aboutImg.png";

export default function cardAbout({ title, content }) {
  return (
    <div className="bg-[#D9D9D9] p-5 rounded-md flex gap-3 flex-col items-center justify-center h-[230px] w-[33%]">
      <p className="text-base font-semibold text-center ">{title}</p>
      <Image alt={'imgsrc'} src={imageSrc} width={100} height={100} />
      <p className="text-center font-light text-sm">{content}</p>
    </div>
  );
}
