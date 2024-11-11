import { TbTruckDelivery } from "react-icons/tb";
import { RiPassValidFill } from "react-icons/ri";
import { FaClock } from "react-icons/fa6";

export default function ContactInfo() {
  return (
    <div className="w-full bg-[#fbfbfb] shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex overflow-hidden rounded-xl md:flex-row flex-col">
      <div className="px-5 lg:px-8 py-5 md:py-10 xl:py-20  md:w-[70%] flex gap-10 md:gap-5 md:flex-row flex-col">
        {/* left */}
        <div className="md:w-1/2 ">
          <h6 className="flex gap-4 items-center mb-4 md:mb-8">
            <TbTruckDelivery className="text-3xl" />
            <span className="font-bold text-base lg:text-lg xl:text-xl">
              Delivery information
            </span>
          </h6>
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium">
              Monday :{" "}
              <span className="font-light">
                12:00 AM–3:00 AM, 8:00 AM–3:00 AM
              </span>
            </p>
            <p className="text-sm font-medium">
              Monday :{" "}
              <span className="font-light">
                12:00 AM–3:00 AM, 8:00 AM–3:00 AM
              </span>
            </p>
            <p className="text-sm font-medium">
              Monday :{" "}
              <span className="font-light">
                12:00 AM–3:00 AM, 8:00 AM–3:00 AM
              </span>
            </p>
            <p className="text-sm font-medium">
              Monday :{" "}
              <span className="font-light">
                12:00 AM–3:00 AM, 8:00 AM–3:00 AM
              </span>
            </p>
            <p className="text-sm font-medium">
              Monday :{" "}
              <span className="font-light">
                12:00 AM–3:00 AM, 8:00 AM–3:00 AM
              </span>
            </p>
            <p className="text-sm font-medium">
              Monday :{" "}
              <span className="font-light">
                12:00 AM–3:00 AM, 8:00 AM–3:00 AM
              </span>
            </p>
            <p className="text-sm font-medium">
              Monday :{" "}
              <span className="font-light">
                12:00 AM–3:00 AM, 8:00 AM–3:00 AM
              </span>
            </p>
            <p className="text-sm font-medium">
              Monday :{" "}
              <span className="font-light">
                12:00 AM–3:00 AM, 8:00 AM–3:00 AM
              </span>
            </p>
          </div>
        </div>
        {/* center */}
        <div className="md:w-1/2">
          <h6 className="flex gap-4 items-center mb-4 md:mb-8">
            <RiPassValidFill className="text-3xl" />
            <span className="font-bold text-base lg:text-lg xl:text-xl">
              Contact information
            </span>
          </h6>
          <div className="flex flex-col gap-4">
            <p className="text-sm font-light leading-7">
              If you have allergies or other dietary restrictions, please
              contact the restaurant. The restaurant will provide food-specific
              information upon request.
            </p>
            <p className="text-sm font-medium flex flex-col gap-3">
              Phone number
              <span className="font-light">+934443-43 Website</span>
            </p>
            <a href="http://thaliaeats.com/">http://thaliaeats.com/</a>
          </div>
        </div>
      </div>
      {/* right */}
      <div className="md:w-[30%] bg-secondaryColor px-5 lg:px-8 py-5 md:py-10 xl:py-20 text-white">
        <h6 className="flex gap-4 items-center mb-4 md:mb-8">
          <FaClock className="text-3xl " />
          <span className="font-bold text-base lg:text-lg xl:text-xl">
            Delivery information
          </span>
        </h6>
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium">
            Monday : <span className="font-light">8:00 AM–3:00 AM</span>
          </p>
          <p className="text-sm font-medium">
            Monday : <span className="font-light">8:00 AM–3:00 AM</span>
          </p>
          <p className="text-sm font-medium">
            Monday : <span className="font-light">8:00 AM–3:00 AM</span>
          </p>
          <p className="text-sm font-medium">
            Monday : <span className="font-light">8:00 AM–3:00 AM</span>
          </p>
          <p className="text-sm font-medium">
            Monday : <span className="font-light">8:00 AM–3:00 AM</span>
          </p>
          <p className="text-sm font-medium">
            Monday : <span className="font-light">8:00 AM–3:00 AM</span>
          </p>
          <p className="text-sm font-medium">
            Monday : <span className="font-light">8:00 AM–3:00 AM</span>
          </p>
        </div>
      </div>
    </div>
  );
}
