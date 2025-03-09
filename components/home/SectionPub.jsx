import Image from "next/image";
import React from "react";
import mobileImg from "@/public/assets/images/mobileImg.png";
import appleLogo from "@/public/assets/images/apple-logo.jpg";
import googleLogo from "@/public/assets/images/google-logo.png";
import Link from "next/link";

export default function SectionPub() {
  return (
    <section className="mt-8 md:mt-16 lg:mt-24 max-w-[1300px] mx-auto px-3 md:px-5 ">
      <div className="bg-white-gradient shadow-xl rounded-lg flex flex-col xl:flex-row items-center relative xl:h-[500px] xl:justify-end pt-10 lg:pt-20 gap-4 xl:gap-0 ">
        {/* image visible sur grands écrans */}
        <Image
        
        data-aos="fade-right"
          src={mobileImg}
          height={100}
          width={732}
          className="hidden xl:block absolute bottom-0 left-0 z-[4]"
          alt={"mobile"}
        />
        <div data-aos="fade-left" className="xl:pr-24 w-full">
          <div className="mb-3 text-center xl:text-right">
            <h4 className="text-secondaryColor text-3xl md:text-5xl font-bold">
              Thalia<span className="text-primaryColor">Eats</span>
              <span className="text-xl md:text-3xl">  Découvrez plus</span>
            </h4>
          </div>

          <div className="px-10 xl:px-0">
            <div className="py-4 xl:px-8 relative bg-secondaryColor xl:w-[700px] rounded-full z-[2] ml-auto w-full">
              <p className="text-base md:text-2xl font-semibold text-center xl:text-right text-primaryColor">
                {/* <span className="underline">Personnalisé  </span>{" "}
                <span className="text-white">& Instantané</span> */}
                Devenez client premium
              </p>
            </div>
          </div>
          <div className="w-full md:w-[450px] mx-auto xl:mx-0 xl:ml-auto block mt-4 xl:pl-8">
            <p className="text-center text-secondaryColor">
              Téléchargez l'application pour commander plus rapidement
            </p>
            <div className="flex gap-2 mt-3 sm:flex-row flex-col justify-center items-center">
              <Link
                href="/"
                className="w-[150px] h-[40px] md:h-[50px] rounded-lg overflow-hidden"
              >
                <Image
                  src={appleLogo}
                  className="h-full w-full "
                  alt="logo appStore"
                />
              </Link>
              <Link
                href="/"
                className="w-[150px] h-[40px] md:h-[50px] rounded-lg overflow-hidden"
              >
                <Image
                  src={googleLogo}
                  className="h-full w-full "
                  alt="logo google play store"
                />
              </Link>
            </div>
          </div>
        </div>
        {/* image visibe sur petits écrans sm */}
        <div>
          <Image
          data-aos="fade-left"
            src={mobileImg}
            height={400}
            width={400}
            className="xl:hidden w-full h-full"
            alt={"mobile"}
          />
        </div>
      </div>
    </section>
  );
}
