import Link from "next/link";
import appleImg from "@/public/assets/images/apple-logo.jpg";
import googleImg from "@/public/assets/images/google-logo.png";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#D9D9D9] w-full">
      <section className="max-w-[1300px] mx-auto px-5 py-16 grid grid-cols-3 gap-5">
        {/* colonne 1 */}
        <div>
          <Link href="/" className="text-secondaryColor text-4xl font-bold">
            ThaliaEats
          </Link>
          <div className="flex gap-1 mt-4">
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

        <div className="w-full">
          <h5 className="mb-8 text-base font-semibold">
            Get Exclusive Deals in your Inbox
          </h5>
          {/* formulaire */}
          <form className=" w-full relative mb-4">
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
          <p className="text-sm font-light">
            we wont spam, read our email policy
          </p>
        </div>
        <div className="w-full flex gap-10">
          <div>
            <h5 className="mb-8 text-base font-semibold">Legal Pages</h5>
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
          {/* **********************$ */}
          <div>
            <h5 className="mb-8 text-base font-semibold">Legal Pages</h5>
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
        </div>
      </section>
      {/* *************************** s */}
      <section className="bg-secondaryColor ">
        <div className="py-5 max-w-[1300px] mx-auto flex items-center justify-between text-white">
          <p>Order.uk Copyright 2024, All Rights Reserved.</p>
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
