import Image from "next/image";
import React from "react";
import mobileImg from "@/public/assets/images/mobileImg.png";
import appleLogo from "@/public/assets/images/apple-logo.jpg";
import googleLogo from "@/public/assets/images/google-logo.png";
import Link from "next/link";

export default function SectionPub() {
  return (
    <section className="mt-24 max-w-[1300px] mx-auto px-5  ">
      <div className="bg-white-grdient shadow-xl rounded-lg flex items-center relative h-[500px] justify-end">
        <Image
          src={mobileImg}
          height={100}
          width={732}
          className="absolute bottom-0 left-0 z-[4]"
          alt={'mobile'}
        />
        <div className="pr-24">
          <div className="mb-3 text-right">
            <h4 className="text-secondaryColor text-5xl font-bold">
              Thalia<span className="text-primaryColor">Eats</span>
              <span className="text-3xl"> is more</span>
            </h4>
          </div>
          <div className="py-4 px-8 relative bg-secondaryColor w-[700px] rounded-full z-[2]">
            <p className="text-2xl font-semibold text-right text-primaryColor">
              <span className="underline">Personalised </span>{" "}
              <span className="text-white">& Instant</span>
            </p>
          </div>
          <div className="w-[450px] ml-auto block mt-4 pl-8">
            <p className="text-center text-secondaryColor">
              Download the Order.uk app for faster ordering
            </p>
            <div className="flex gap-2 mt-3">
              <Link
                href="/"
                className="w-full h-[50px] rounded-lg overflow-hidden"
              >
                <Image src={appleLogo} className="h-full object-cover" />
              </Link>
              <Link
                href="/"
                className="w-full h-[50px] rounded-lg overflow-hidden"
              >
                <Image src={googleLogo} className="h-full object-cover" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
