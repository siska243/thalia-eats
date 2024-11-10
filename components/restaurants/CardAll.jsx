import Image from "next/image";
import cocaImg from "@/public/assets/images/cocaImg.png";
import { FaCirclePlus } from "react-icons/fa6";

export default function CardAll({ imageSrc, title, other, content }) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex p-5 gap-3">
      <div className="w-full sm:w-1/2 flex-shrink-0">
        <h3 className="text-black font-semibold text-[15px] lg:text-base mb-3">
          {title}
        </h3>
        <p className="text-black font-normal text-xs md:text-sm mb-3">
          {content}
        </p>
        <p className="text-secondaryColor font-bold text-sm">{other}</p>
      </div>
      <div className="w-1/3 sm:w-1/2 h-full flex-shrink-0 hidden sm:block">
        <Image
          src={cocaImg}
          className="h-full w-full object-cover rounded-xl"
        />
      </div>
      <div className="absolute bottom-0 right-0 z-10">
        <button className="bg-gray-300 p-3 lg:p-5 rounded-tl-3xl shadow-lg">
          <FaCirclePlus className="text-lg md:text-2xl" />
        </button>
      </div>
    </div>
  );
}
