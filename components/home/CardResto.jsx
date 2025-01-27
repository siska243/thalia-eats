import Image from "next/image";

import Link from "next/link";

export default function CardResto({ picture, title, product }) {
  return (
    <Link
      href={`/restaurant/${product[0] ? product[0].restaurant.slug : "#"}`}
      className="overflow-hidden rounded-xl box-shadow-custom w-full h-full bg-white"
    >
      <Image
        src={picture}
        width={300}
        height={100}
        alt={title}
        className="w-full h-[150px] object-cover"
      />
      <div className="p-4">
        <p className="text-primaryColor text-sm font-semibold uppercase text-center">
          {title}
        </p>
      </div>
    </Link>
  );
}
