import Link from "next/link";
import appleImg from "@/public/assets/images/apple-logo.jpg";
import googleImg from "@/public/assets/images/google-logo.png";
import Image from "next/image";
import { IoIosArrowDroprightCircle } from "react-icons/io";

export default function Footer() {
  return (
    <footer className="bg-[#D9D9D9] w-full">
      <section className="max-w-[1300px] mx-auto px-5 py-16 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {/* colonne 1 */}
        <div className="xl:col-span-2">
          <Link
            href="/"
            className="text-secondaryColor text-2xl md:text-4xl font-bold"
          >
            ThaliaEats
          </Link>
          <div className="flex gap-1 mt-4 flex-wrap sm:flex-nowrap">
            <Link
              href="/"
              className="w-[120px] h-[40px] rounded-md overflow-hidden"
            >
              <Image src={appleImg} className="h-full" />
            </Link>
            <Link
              href="/"
              className="w-[120px] h-[40px] rounded-md overflow-hidden"
            >
              <Image src={googleImg} className="h-full" />
            </Link>
          </div>
          <p className="font-normal text-base text-black max-w-[300px] mt-4">
            Company # 490039-445, Registered with House of companies.
          </p>
        </div>
        {/* colonne 2 */}

        <div className="xl:col-span-2">
          <h5 className="mb-4 my-8 md:my-0 md:mb-8 text-base font-semibold">
            Get Exclusive Deals in your Inbox
          </h5>
          {/* formulaire visible sur grand écran*/}
          <form className=" w-full relative mb-4 xl:block hidden">
            <input
              className="p-3 outline-none rounded-full w-[300px] focus:border-primaryColor placeholder:text-sm text-base text-gray-300 bg-gray-400/40 shadow-xl placeholder:text-black"
              type="text"
              placeholder="e.g. EC4R 3TE"
            />
            <button
              className="bg-primaryColor border-2 border-primaryColor text-white rounded-full p-3 right-10 w-[200px] absolute top-0"
              type="submit"
            >
              Search
            </button>
          </form>
          {/* formulaire visible sur mobile */}
          <form className="relative xl:hidden w-full max-w-[300px] flex justify-center items-center mb-4">
            <input
              className="p-3 outline-none border-2 rounded-full w-full  focus:border-primaryColor placeholder:text-sm text-[15px] text-gray-500 pr-16 "
              type="text"
              placeholder="e.g. EC4R 3TE"
            />
            <button
              className=" border-primaryColor bg-primaryColor text-white rounded-full p-4 absolute bottom-0 right-0"
              type="submit"
            >
              <IoIosArrowDroprightCircle />
            </button>
          </form>
          {/* ************* */}
          <p className="text-sm font-light">
            we wont spam, read our email policy
          </p>
        </div>
        {/* colonee 3 */}
        <div className="">
          <h5 className="mb-4 my-8 md:my-0 md:mb-8 text-base font-semibold">
            Legal Pages
          </h5>
          <div className="flex flex-col gap-3">
            <Link href="/" className="text-sm font-normal underline">
              Terms and conditions
            </Link>
            <Link href="/" className="text-sm font-normal underline">
              Privacy
            </Link>
            <Link href="/" className="text-sm font-normal underline">
              Cookies
            </Link>
            <Link href="/" className="text-sm font-normal underline">
              Modern Slavery Statemen
            </Link>
          </div>
        </div>
        {/* colonne 4 */}
        <div className="">
          <h5 className="mb-4 my-8 md:my-0 md:mb-8 text-base font-semibold">
            Legal Pages
          </h5>
          <div className="flex flex-col gap-3">
            <Link href="/" className="text-sm font-normal underline">
              Terms and conditions
            </Link>
            <Link href="/" className="text-sm font-normal underline">
              Privacy
            </Link>
            <Link href="/" className="text-sm font-normal underline">
              Cookies
            </Link>
            <Link href="/" className="text-sm font-normal underline">
              Modern Slavery Statemen
            </Link>
          </div>
        </div>
      </section>
      {/* *************************** s */}
      <section className="bg-secondaryColor ">
        <div className="py-5 max-w-[1300px] mx-auto flex items-center justify-between text-white px-5 sm:flex-row flex-col gap-4 sm:gap-0">
          <p className="text-sm sm:text-base">
            Order.uk Copyright 2024, All Rights Reserved.
          </p>
          <div className="flex gap-10 font-light text-sm">
            <p>Privacy Policy</p>
            <p>Terms </p>
            <p>Pricing</p>
          </div>
        </div>
      </section>
    </footer>
  );
}
