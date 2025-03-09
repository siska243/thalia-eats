import Image from "next/image";
import foodsImg from "@/public/assets/images/foodsImg.png";
import restoImg3 from "@/public/assets/images/restoImg3.png";
import restoImg4 from "@/public/assets/images/restoImg4.png";
import clock from "@/public/assets/images/clock.png";
import logo from "@/public/assets/logo-thalia.png";
import Loader from "../Loader/Loader";

export default function BannerResto({ restaurant, restaurantIsLoading }) {

  if (restaurantIsLoading) {
    return <Loader />;
  }

  return (
    <section className="max-w-[1300px] mx-auto px-3 md:px-5 mb-20">
      <div
        className="relative w-full lg:h-[450px] rounded-xl md:p-16 p-10 box-shadow-custom bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(3, 8, 31, 0.9), rgba(3, 8, 31, 0.9)), url(${restaurant?.image || logo.src})`
        }}
      >
        {/* background image */}
        {/* <Image
          src={data?.image || restaurant?.image || logo}
          className="absolute top-0 right-0 left-0 w-full h-full z-[-1] object-cover rounded-xl"
          alt={data?.name || restaurant?.name || 'Thalia-Eats logo'}
          width={800}
          height={800}
        /> */}
        <div className="w-full flex lg:flex-row flex-col-reverse gap-5 lg-gap-0 justify-between items-end h-full">
          <div data-aos="fade-right" className="w-full lg:w-[60%]">
            <h6 className=" lg:text-left text-center text-base font-extralight mb-3 text-white">
              {restaurant?.reference || "Aucune ref"}
            </h6>
            <h2 className="text-center lg:text-left text-primaryColor font-semibol text-2xl md:text-4xl md:mb-10 mb-5">
              {restaurant?.name || 'Thalia-Eats'}
            </h2>
            <div className="flex gap-3 items-center justify-center lg:items-start lg:justify-start flex-col md:flex-row">
              <p className="flex items-center gap-2 text-sm font-normal text-white border border-white py-2 px-6 rounded-full">
                <Image src={restoImg3} width={30} alt="order" /> Commande minimum :
                5 $
              </p>
              <p className="flex items-center text-sm gap-2 font-normal text-white border border-white py-2 px-6 rounded-full">
                <Image src={restoImg4} width={30} alt="order" /> Livraison :
                20-30 Minutes
              </p>
            </div>
          </div>
          {/* ******image */}
          <div data-aos="fade-left" className="w-[70%] text-center md:w-[60%] lg:w-[40%] overflow-hidden rounded-xl mx-auto h-full">
            <Image
              src={restaurant?.image || logo}
              className="w-full h-full object-scale-down rounded-xl"
              alt={restaurant?.name || 'Thalia-Eats logo'}
              width={800}
              height={800}
            />
          </div>
          {/* *************** */}
          <p data-aos="fade-right" className="absolute -bottom-7 z-20 bg-primaryColor flex items-center md:p-3 p-2 left-0 w-full sm:w-[400px] justify-center gap-2 md:gap-3 text-white text-xs sm:text-sm md:text-base sm:rounded-r-xl">
            <Image src={clock} width={30} alt="clock" />
            Ouvert :
            {restaurant?.opens[0].startAt} - {restaurant?.opens[0].endAt}
          </p>
        </div>
      </div>
    </section>
  );
}
