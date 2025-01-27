import Image from "next/image";
import Link from "next/link";

export default function CardRestaurants({ restaurant, defaultImage }) {
  return (
    <Link
      href={`/restaurant/${restaurant.slug}`}
      className="relative w-full overflow-hidden rounded-xl box-shadow-custom"
    >
      <Image
        className="w-full h-full"
        src={restaurant.image || defaultImage}
        alt={restaurant.name}
        width={500}
        height={500}
      />
      <div className="absolute top-0 right-0 w-full h-full bg-custom-gradient">
        <div className="absolute md:bottom-4 bottom-2 left-3 md:left-6">
          <h4 className="text-primaryColor text-sm md:text-base">
            {restaurant.reference}
          </h4>
          <p className="text-white text-base md:text-lg lg:text-xl">
            {restaurant.name}
          </p>
        </div>
      </div>
    </Link>
  );
}
