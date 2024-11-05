import Image from "next/image";
import food from "@/public/assets/images/food.png";
import Link from "next/link";

export default function CardDeals({ imageSrc, title, percent }) {
  return (
    <Link
      href="/"
      className="relative w-full overflow-hidden rounded-xl shadow-xl"
    >
      <Image className="" src={food} alt={title} width={500} height={500} />
      <div className="absolute top-0 right-0 w-full h-full bg-custom-gradient">
        <span className="absolute top-0 right-4 bg-black p-3 text-white rounded-b-lg text-sm">
          {percent}
        </span>
        <div className="absolute bottom-4 left-6">
          <h4 className="text-primaryColor text-base">Restaurant</h4>
          <p className="text-white text-xl">{title}</p>
        </div>
      </div>
    </Link>
  );
}
