import Image from "next/image";
import restoImage from "@/public/assets/images/resto.png";
import Link from "next/link";

export default function CardResto({ imageSrc, title, resto }) {
  return (
    <Link href="/" className="overflow-hidden rounded-xl shadow-xl w-full">
      <Image src={restoImage} width={300} height={100} />
      <div className="p-3 bg-thirdColor">
        <p className="text-secondaryColor text-lg font-semibold">{title}</p>
        <p className="text-sm text-primaryColor font-light">{resto}</p>
      </div>
    </Link>
  );
}
