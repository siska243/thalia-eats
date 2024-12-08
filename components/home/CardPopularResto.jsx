import Image from "next/image";
import Link from "next/link";

export default function CardPopularResto({ preview }) {

  return (
    <Link
      href={`/restaurant/${preview.restaurant.slug}`}
      className="overflow-hidden rounded-xl box-shadow-custom w-full"
    >
      <Image src={preview.picture} width={300} height={100} alt={preview.title} className="w-full h-[150px] object-cover" />
      <div className="p-3 bg-primaryColor">
        <p className=" text-base font-semibold text-center text-white">
          {preview.title}
        </p>
      </div>
    </Link>
  );
}
