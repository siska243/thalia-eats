import Image from "next/image";
import mapImg from "@/public/assets/images/map.png";

export default function Map() {
  return (
    <section className="mt-16 rounded-xl shadow-xl overflow-hidden w-full h-[500px] relative">
      <Image src={mapImg} className="h-full w-full object-cover" />
      <div className="absolute w-[250px] rounded-xl left-10 bottom-10 bg-secondaryColor/95 py-10 px-5">
        <div className="mb-5">
          <h3 className="text-white text-xl font-semibold">McDonald’s</h3>
          <h4 className="text-primaryColor text-sm">South London</h4>
        </div>
        <p className="text-sm leading-5 text-gray-200 font-light mb-4">
          Tooley St, London Bridge, London SE1 2TF,United Kingdom
        </p>
        <div className="mb-3">
          <p className="text-white text-sm">Phone number</p>
          <p className="text-primaryColor text-sm font-light">+934443-43</p>
        </div>
        <div>
          <p className="text-white text-sm">Website</p>
          <p className="text-primaryColor text-sm font-light">
            <a href="http://thaliaeats.com/">http://thaliaeats.com</a>
          </p>
        </div>
      </div>
    </section>
  );
}
