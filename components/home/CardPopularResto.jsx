import Image from "next/image";
import restoImage from "@/public/assets/images/restoPopular.png";
import Link from "next/link";

export default function CardPopularResto({ imageSrc, title }) {
  return (
    <Link href="/" className="overflow-hidden rounded-xl shadow-xl w-full">
      <Image src={restoImage} width={300} height={100} />
      <div className="p-3 bg-primaryColor">
        <p className=" text-base font-semibold text-center text-white">
          {title}
        </p>
      </div>
    </Link>
  );
}
