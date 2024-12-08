import Image from "next/image";
import foodsImg from "@/public/assets/images/foodsImg.png";
import restoImg3 from "@/public/assets/images/restoImg3.png";
import restoImg4 from "@/public/assets/images/restoImg4.png";
import clock from "@/public/assets/images/clock.png";
import logo from "@/public/assets/logo-thalia.png";

export default function BannerResto({ restaurant, restaurantIsLoading }) {
  const { data } = restaurant;
  if (restaurantIsLoading) {
    return <p>Chargement en cours...</p>;
  }

  return (
    <section className="max-w-[1300px] mx-auto px-3 md:px-5 mb-16">
      <div className="w-full lg:h-[450px] rounded-xl relative bg-secondaryColor/90 md:p-16 p-10 box-shadow-custom ">
        {/* background image */}
        <Image
          src={data?.image || restaurant?.image || logo}
          className="absolute top-0 right-0 left-0 w-full h-full z-[-1] object-cover rounded-xl"
          alt={data?.name || restaurant?.name || 'Thalia-Eats logo'}
          width={800}
          height={800}
        />
        <div className="w-full flex lg:flex-row flex-col-reverse gap-5 lg-gap-0 justify-between items-end h-full">
          <div className="w-full lg:w-[60%]">
            <h6 className=" lg:text-left text-center text-base font-extralight mb-3 text-white">
              {data?.reference || restaurant?.reference || "Aucune ref"}
            </h6>
            <h2 className="text-center lg:text-left text-white font-semibol text-xl md:text-3xl lg:text-4xl md:mb-10 mb-5">
              {data?.name || restaurant?.name || 'Thalia-Eats'}
            </h2>
            <div className="flex gap-3 items-center justify-center lg:items-start lg:justify-start flex-col md:flex-row">
              <p className="flex items-center gap-2 text-sm xl:text-base font-normal text-white border boder-white py-2 px-6 rounded-full">
                <Image src={restoImg3} width={30} alt="order" /> Minimum Order:
                12 GBP
              </p>
              <p className="flex items-center text-sm xl:text-base gap-2 font-normal text-white border boder-white py-2 px-6 rounded-full">
                <Image src={restoImg4} width={30} alt="order" /> Delivery in
                20-25 Minutes
              </p>
            </div>
          </div>
          {/* ******image */}
          <div className="w-[70%] text-center md:w-[60%] lg:w-[40%] overflow-hidden rounded-xl mx-auto h-full">
            <Image
              src={data?.image || restaurant?.image || logo}
              className="w-full h-full object-scale-down rounded-xl"
              alt={data?.name || restaurant?.name || 'Thalia-Eats logo'}
              width={800}
              height={800}
            />
          </div>
          {/* *************** */}
          <p className="absolute -bottom-7 z-20 bg-primaryColor flex items-center md:p-3 p-2 left-0 w-full sm:w-[400px] justify-center gap-2 md:gap-3 text-white text-xs sm:text-sm md:text-base sm:rounded-r-xl">
            <Image src={clock} width={30} alt="clock" />
            Ouvert :
            {data?.opens[0].startAt} - {data?.opens[0].endAt}
          </p>
        </div>
      </div>
    </section>
  );
}
