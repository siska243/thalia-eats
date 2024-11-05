import Image from "next/image";
import pizzaImage from "@/public/assets/images/pizza.png";
import homeEatImage from "@/public/assets/images/homeEat.png";
import SectionDeals from "@/components/home/SectionDeals";
import SectionResto from "@/components/home/SectionResto";
import SectionPopularResto from "@/components/home/SectionPopularResto";
import SectionPub from "@/components/home/SectionPub";
import SectionPartner from "@/components/home/SectionPartner";
import SectionAbout from "@/components/home/SectionAbout";
import SectionCount from "@/components/home/SectionCount";
export default async function Home() {
  return (
    <>
      {/* premiere section */}
      <section className="max-w-[1300px] mx-auto px-5">
        <div className="bg-fourthColor rounded-xl grid grid-cols-2 gap-4 items-center mb-12 overflow-hidden h-[600px] border w-full ">
          {/* ********left content********* */}
          <div className="w-full p-10" data-aos="fade-right">
            <p className="text-[16px] leading-8 text-secondaryColor font-light mb-2">
              Order Restaurant food, takeaway and groceries.
            </p>
            <h1 className="text-5xl font-semibold text-secondaryColor mb-8">
              Feast Your Senses, <br />
              <span className="text-primaryColor">Fast and Fresh</span>
            </h1>
            <div>
              <p className="text-sm leading-8 text-secondaryColor font-light mb-2">
                Enter a postcode to see what we deliver
              </p>
              <form className="flex">
                <input
                  className="p-4 outline-none border-2 rounded-full w-[300px] focus:border-primaryColor placeholder:text-sm text-[15px] text-gray-500"
                  type="text"
                  placeholder="e.g. EC4R 3TE"
                />
                <button
                  className="bg-primaryColor w-[200px] border-2 border-primaryColor text-white rounded-full p-4 relative right-20"
                  type="submit"
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          {/* ******** right content ********* */}
          <div className="relative w-full h-full " data-aos="fade-left">
            <Image
              className="absolute -left-[150px] bottom-0 z-10 h-[500px] w-[400px] object-cover"
              src={pizzaImage}
              width={"100%"}
              height={"100%"}
              alt={"image"}
            />
            <Image
              className="absolute left-[80px] bottom-0 z-[1] w-[300px] h-[400px] rounded-md object-cover"
              src={homeEatImage}
              width={"100%"}
              height={"100%"}
              alt={'image'}
            />
            <div className="w-[80%] absolute bottom-0 right-0 h-[97%] bg-primaryColor rounded-l-full pt-10 flex flex-col ">
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
      {/* section deals */}
      <SectionDeals />
      {/* section resto */}
      <SectionResto />
      {/* section popular resto */}
      <SectionPopularResto />
      {/* section pub */}
      <SectionPub />
      {/* section partner */}
      <SectionPartner />
      {/* section about */}
      <SectionAbout />
      {/* section counter */}
      <SectionCount />
    </>
  );
}
