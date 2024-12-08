import Image from "next/image";
import mapImg from "@/public/assets/images/map.png";

export default function Map({ data }) {
  return (
    <section className="rounded-xl box-shadow-custom overflow-hidden w-full h-[500px] relative">
      <Image src={mapImg} className="h-full w-full object-cover" alt="map" />
      <div className="absolute w-[300px] rounded-xl left-10 bottom-10 bg-secondaryColor/95 py-10 px-5">
        <div className="mb-5">
          <h3 className="text-white text-xl font-semibold">{data?.data?.name || "Nom du restaurant"}</h3>
          <h4 className="text-primaryColor text-sm"> {data?.data?.adresse || "Adresse du restaurant"}</h4>
        </div>
        <p className="text-sm leading-5 text-gray-200 font-light mb-4">
          {data?.data?.reference || "Reférence du restaurant"}
        </p>
        <div className="mb-3">
          <p className="text-white text-sm">WhatsApp</p>
          <p className="text-primaryColor text-sm font-light">{data?.data?.whatsapp || "WhatsApp du restaurant"}</p>
        </div>
        <div>
          <p className="text-white text-sm">Site Web</p>
          <p className="text-primaryColor text-sm font-light">
            <a href={data?.data?.website || "http://thaliaeats.com"}> {data?.data?.website || "Thaliaeats.com"}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
