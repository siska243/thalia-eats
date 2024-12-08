import Image from "next/image";
import Link from "next/link";
import resto from "@/public/assets/images/resto.png";

export default function CardCategory({ cat }) {
  return (
    <Link href="/" className="overflow-hidden rounded-xl shadow-xl w-full">
      <Image src={resto} width={300} height={100} alt={cat.title} />
      <div className="p-3 bg-thirdColor">
        <p className="text-secondaryColor text-lg font-semibold">{cat.title}</p>
        <p className="text-sm text-primaryColor font-light">{cat.resto}</p>
      </div>
    </Link>
  );
}
