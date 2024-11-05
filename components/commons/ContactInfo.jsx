import { TbTruckDelivery } from "react-icons/tb";
import { RiPassValidFill } from "react-icons/ri";
import { FaClock } from "react-icons/fa6";

export default function ContactInfo() {
  return (
    <div className="w-full bg-[#fbfbfb] shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex overflow-hidden rounded-xl">
      <div className="px-10 py-20 w-[70%] flex">
        {/* left */}
        <div className="w-1/2 flex-shrink-0">
          <h6 className="flex gap-4 items-center mb-8">
            <TbTruckDelivery className="text-3xl" />
            <span className="font-bold text-xl">Delivery information</span>
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
        <div className="w-1/2 flex-shrink-0">
          <h6 className="flex gap-4 items-center mb-8">
            <RiPassValidFill className="text-3xl" />
            <span className="font-bold text-xl">Contact information</span>
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
      <div className="w-[30%] bg-secondaryColor px-10 py-20 text-white">
        <h6 className="flex gap-4 items-center mb-8">
          <FaClock className="text-3xl" />
          <span className="font-bold text-xl">Delivery information</span>
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
