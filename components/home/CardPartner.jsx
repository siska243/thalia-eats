import Image from "next/image";

import Link from "next/link";

export default function CardPartner({
  imageSrc,
  title,
  secondTitle,
  topTitle,
  btnLink,
}) {
  return (
    <div
      href="/"
      className="relative w-full overflow-hidden rounded-xl shadow-xl"
    >
      <Image className="w-full h-[350px] object-cover" src={imageSrc} alt={title} width={900} height={400} />
      <div className="absolute top-0 right-0 w-full h-full bg-custom-gradient">
        <span className="absolute top-0 left-3 lg:left-10 bg-white p-3 text-secondaryColor rounded-b-lg text-xs lg:text-base font-medium hidden sm:block">
          {topTitle}
        </span>
        <div className="absolute bottom-5 left-3 lg:left-10 md:pb-5">
          <h5 className="text-primaryColor text-sm md:text-lg font-normal mb-1">
            {secondTitle}
          </h5>
          <h4 className="text-white text-base md:text-xl font-bold md:mb-5 mb-3">
            {title}
          </h4>
          <Link
            href={btnLink}
            className="bg-primaryColor text-white text-sm md:text-base lg:py-4 lg:px-8 inline-block rounded-full py-2 px-4"
          >
            Commencez maintenant
          </Link>
        </div>
      </div>
    </div>
  );
}
