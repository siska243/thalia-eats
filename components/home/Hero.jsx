import Image from "next/image";
import pizzaImage from "@/public/assets/images/pizza.png";
import homeEatImage from "@/public/assets/images/homeEat.png";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";


export default function Hero() {
   return (
      <section className="max-w-[1300px] mx-auto px-3 md:px-5">
         <div className="bg-fourthColor rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-8 md:mb-12 overflow-hidden h-[400px] md:h-[600px] border w-full ">
            {/* ********left content********* */}
            <div className="w-full p-5 xl:p-10 relative" data-aos="fade-right">
               <p className="text-sm text-center md:text-left md:text-[16px] leading-8 text-secondaryColor font-light mb-2">
                  Commandez des plats de restaurant, à emporter ou des courses.
               </p>
               <h1 className="text-center md:text-left text-3xl md:text-4xl lg:text-5xl font-semibold text-secondaryColor mb-8">
                  Régalez vos sens, <br />
                  <span className="text-primaryColor">Rapide et frais</span>
               </h1>

               {/* bouton pour commencer les achats */}
               <div className="flex justify-center md:justify-start">
                  <Link
                     href="/restaurant"
                     className="w-full sm:w-auto lg:w-auto bg-primaryColor text-white text-base md:text-lg rounded-full py-5 md:py-4 px-5 sm:px-8 flex items-center justify-center gap-2 sm:gap-4 hover:bg-primaryColor/90 transition-all"
                  >
                     Commencez maintenant
                     <span className="text-xl md:text-2xl sm:text-3xl">
                        <FaArrowRight />
                     </span>
                  </Link>
               </div>


               <div className="flex justify-center items-center flex-col md:items-start gap-3 md:gap-0">
                  {/* <p className="text-sm leading-8 text-secondaryColor font-light mb-2">
                Entrez un code postal pour voir ce que nous livrons.
              </p> */}
                  {/* formulaire visible à partir de md */}
                  {/* <form className="relative hidden md:flex">
                <input
                  className="p-4 outline-none border-2 rounded-full w-full lg:w-[300px] focus:border-primaryColor placeholder:text-sm text-[15px] text-gray-500 pr-16"
                  type="text"
                  placeholder="e.g. EC4R 3TE"
                />
                <button
                  className="bg-primaryColor w-[150px] md:w-[200px] border-2 border-primaryColor text-white rounded-full p-4 absolute -right-36"
                  type="submit"
                >
                  Search
                </button>
              </form> */}

                  {/* formulaire visible sur mobile */}
                  {/* <form className="relative md:hidden w-full max-w-[300px] mx-auto flex justify-center items-center">
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
              </form> */}
               </div>
            </div>

            {/* ******** right content and images ********* */}
            <div
               className="relative w-full h-full hidden md:block"
               data-aos="fade-left"
            >
               <Image
                  className="absolute xl:-left-[150px] left-0 bottom-0 z-10 md:h-[80%] md:w-full  lg:w-[400px] lg:h-[500px] object-cover"
                  src={pizzaImage}
                  width={400}
                  height={500}
                  alt="pizza food"
               />
               <Image
                  className="hidden xl:block absolute left-[80px] bottom-0 z-[1] w-[300px] h-[400px] rounded-md object-cover"
                  src={homeEatImage}
                  width={"100%"}
                  height={"100%"}
                  alt="food"
               />
               <div className="w-[80%] absolute bottom-0 right-0 h-[97%] bg-primaryColor rounded-l-full pt-10 lg:flex flex-col hidden">
                  {/* **************** 1 ***************** */}
                  <div className=" w-2/3 absolute left-28 pr-8 flex flex-col z-[9]">
                     <p className="flex justify-end text-4xl w-full pr-3 font-bold -mb-2 text-stroke-white">
                        1
                     </p>
                     <div className="bg-white p-3 rounded-xl shadow-md flex justify-between">
                        <div>
                           <h5 className="text-[14px] text-secondaryColor mb-2 font-medium">
                              Thalia
                              <span className="text-primaryColor">Eats</span>
                           </h5>
                           <p className="text-black font-semibold text-[13px]">
                              We’ve Received your order!
                           </p>
                           <p className="text-gray-500 font-normal text-[12px]">
                              Awaiting Restaurant acceptance
                           </p>
                        </div>
                        <span className="text-[12px] text-gray-300">Now</span>
                     </div>
                  </div>
                  {/* **************** 2 ***************** */}
                  <div className=" w-2/3 absolute left-[35%] top-[40%] pr-8 flex flex-col z-[9]">
                     <p className="flex justify-end text-4xl w-full pr-3 font-bold -mb-2 text-stroke-white">
                        2
                     </p>
                     <div className="bg-white p-3 rounded-xl shadow-md flex justify-between">
                        <div>
                           <h5 className="text-[14px] text-secondaryColor mb-2 font-medium">
                              Thalia
                              <span className="text-primaryColor">Eats</span>
                           </h5>
                           <p className="text-black font-semibold text-[13px] ">
                              We’ve Received your order!
                           </p>
                           <p className="text-gray-500 font-normal text-[12px]">
                              Awaiting Restaurant acceptance
                           </p>
                        </div>
                        <span className="text-[12px] text-gray-300">Now</span>
                     </div>
                  </div>
                  {/* **************** 3 ***************** */}
                  <div className=" w-2/3 absolute bottom-14 left-40 pr-8 flex flex-col z-[9]">
                     <p className="flex justify-end text-4xl w-full pr-3 font-bold -mb-2 text-stroke-white">
                        3
                     </p>
                     <div className="bg-white p-3 rounded-xl shadow-md flex justify-between">
                        <div>
                           <h5 className="text-[14px] text-secondaryColor mb-2 font-medium">
                              Thalia
                              <span className="text-primaryColor">Eats</span>
                           </h5>
                           <p className="text-black font-semibold text-[13px]">
                              We’ve Received your order!
                           </p>
                           <p className="text-gray-500 font-normal text-[12px]">
                              Awaiting Restaurant acceptance
                           </p>
                        </div>
                        <span className="text-[12px] text-gray-300">Now</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}
