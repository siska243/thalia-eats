import Image from "next/image";
import food from "@/public/assets/images/food.png";
import { FaCirclePlus } from "react-icons/fa6";

export default function CardOffers({ imageSrc, title, percent, content }) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl shadow-xl">
      <Image className="" src={food} alt={title} width={500} height={500} />
      <div className="absolute top-0 right-0 w-full h-full bg-custom-gradient">
        <span className="absolute top-0 right-4 bg-black p-3 text-white rounded-b-lg text-sm">
          {percent}
        </span>
        <div className="absolute bottom-4 left-6">
          <h4 className="text-primaryColor text-base">{content}</h4>
          <p className="text-white text-xl">{title}</p>
        </div>
      </div>
      <div className="absolute bottom-0 right-0">
        <button className="bg-white p-5 rounded-tl-3xl shadow-2xl">
          <FaCirclePlus className="text-2xl" />
        </button>
      </div>
    </div>
  );
}
