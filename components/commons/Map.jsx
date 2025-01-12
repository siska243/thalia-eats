import Image from "next/image";
import mapImg from "@/public/assets/images/map.png";

export default function Map({ data, infoResto }) {
  return (
    <section className="rounded-xl box-shadow-custom overflow-hidden w-full h-[500px] relative bg-red-700">
      <Image src={mapImg} className="h-full w-full object-cover" alt="map" />
      <div className="absolute w-[95%] md:w-[300px] rounded-xl left-3 bottom-5 md:left-10 md:bottom-10 bg-secondaryColor/95 py-10 px-5">
        <div className="mb-5">
          <h3 className="text-white text-xl font-semibold">{data?.data?.name || infoResto?.name}</h3>
          <h4 className="text-primaryColor text-sm"> {data?.data?.adresse || infoResto?.adresse}</h4>
        </div>
        <p className="text-sm leading-5 text-gray-200 font-light mb-4 sm:w-[70%] w-full md:w-full">
          {data?.data?.reference || infoResto?.reference}
        </p>
        {/* <div className="mb-3">
          <p className="text-white text-sm">WhatsApp</p>
          <p className="text-primaryColor text-sm font-light">{data?.data?.whatsapp || infoResto?.whatsapp}</p>
        </div> */}
        <div>
          <p className="text-white text-sm">Site Web</p>
          <p className="text-primaryColor text-sm font-light">
            <a href={data?.data?.website || infoResto?.website || "http://thaliaeats.com"}> {data?.data?.website || infoResto?.website || "Thaliaeats.com"}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
