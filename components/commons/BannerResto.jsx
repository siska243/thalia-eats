import Image from "next/image";
import foodsImg from "@/public/assets/images/foodsImg.png";
import restoImg3 from "@/public/assets/images/restoImg3.png";
import restoImg4 from "@/public/assets/images/restoImg4.png";
import clock from "@/public/assets/images/clock.png";

export default function BannerResto() {
  return (
    <section className="max-w-[1300px] mx-auto px-5 mb-16">
      <div className="w-full h-[450px] rounded-xl relative bg-secondaryColor/90 p-16">
        <Image
          src={foodsImg}
          className="absolute top-0 right-0 left-0 w-full h-full z-[-1] object-cover rounded-xl"
        />
        <div className="w-full flex justify-between items-end h-full">
          <div>
            <h6 className="text-base font-extralight mb-3 text-white">
              I'm lovin' it!
            </h6>
            <h2 className="text-white font-semibold text-4xl mb-10">
              McDonald’s East London
            </h2>
            <div className="flex gap-3">
              <p className="flex items-center gap-2 text-base font-normal text-white border boder-white py-2 px-6 rounded-full">
                <Image src={restoImg3} width={30} /> Minimum Order: 12 GBP
              </p>
              <p className="flex items-center gap-2 text-base font-normal text-white border boder-white py-2 px-6 rounded-full">
                <Image src={restoImg4} width={30} /> Delivery in 20-25 Minutes
              </p>
            </div>
          </div>
          {/* ******image */}
          <div className="w-[40%] overflow-hidden rounded-xl">
            <Image src={foodsImg} />
          </div>
          {/* *************** */}
          <p className="absolute -bottom-7 z-20 bg-primaryColor flex items-center p-3 left-0 w-[300px] justify-center gap-3 text-white text-base rounded-r-xl">
            <Image src={clock} width={30} />
            Open until 3:00 AM
          </p>
        </div>
      </div>
    </section>
  );
}
