import Image from "next/image";
import partnerImg from "@/public/assets/images/partner.png";
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
      <Image
        className=""
        src={partnerImg}
        alt={title}
        width={900}
        height={400}
      />
      <div className="absolute top-0 right-0 w-full h-full bg-custom-gradient">
        <span className="absolute top-0 left-10 bg-white p-3 text-secondaryColor rounded-b-lg text-base font-medium ">
          {topTitle}
        </span>
        <div className="absolute bottom-5 left-10 pb-5">
          <h5 className="text-primaryColor text-lg font-normal mb-1">
            {secondTitle}
          </h5>
          <h4 className="text-white text-3xl font-bold mb-5">{title}</h4>
          <Link
            href={btnLink}
            className="bg-primaryColor text-white text-lg py-4 px-12 inline-block rounded-full"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
