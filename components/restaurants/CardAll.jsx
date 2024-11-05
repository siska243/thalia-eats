import Image from "next/image";
import cocaImg from "@/public/assets/images/cocaImg.png";
import { FaCirclePlus } from "react-icons/fa6";

export default function CardAll({ imageSrc, title, other, content }) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex p-5 gap-3">
      <div className="w-1/2 ">
        <h3 className="text-black font-semibold text-base mb-3">{title}</h3>
        <p className="text-black font-normal text-sm mb-3">{content}</p>
        <p className="text-secondaryColor font-bold text-sm">{other}</p>
      </div>
      <div className="w-1/2 h-full">
        <Image
          src={cocaImg}
          className="h-full w-full object-cover rounded-xl"
        />
      </div>
      <div className="absolute bottom-0 right-0 z-10">
        <button className="bg-white p-5 rounded-tl-3xl shadow-2xl">
          <FaCirclePlus className="text-2xl" />
        </button>
      </div>
    </div>
  );
}
