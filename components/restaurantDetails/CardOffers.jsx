import useCreateOrdering from "@/hooks/useCreateOrdering";
import Image from "next/image";

import { FaCirclePlus } from "react-icons/fa6";

export default function CardOffers({ product }) {

  const { ordering, handleAddProduct, removeProduct } = useCreateOrdering()

  const fetchMenuProduct = (product) => {

    handleAddProduct(product)
  }
  return (
    <div className="relative w-full overflow-hidden rounded-xl box-shadow-custom">
      <Image
        className="w-full h-[280px]"
        src={product.picture}
        alt={product.title}
        width={500}
        height={500}
      />
      <div className="absolute top-0 right-0 w-full h-full bg-custom-gradient">
        <span className="absolute top-0 right-4 bg-secondaryColor px-5 py-2 text-white rounded-b-lg text-base">
          {product.price} <span className="text-primaryColor">{product.currency.code}</span>
        </span>
        <div className="absolute md:bottom-4 bottom-2 left-3 md:left-6">
          <h4 className="text-primaryColor text-base md:text-lg md:w-[80%]">{product.description}</h4>
          <p className="text-white text-lg lg:text-2xl lowercase first-letter:uppercase">{product.title}</p>
        </div>
      </div>
      <div className="absolute bottom-0 right-0">
        <button className="bg-white p-3 lg:p-5 rounded-tl-3xl shadow-2xl" onClick={() => fetchMenuProduct(product)}>
          <FaCirclePlus className="text-base sm:text-lg md:text-xl lg:text-2xl" />
        </button>
      </div>
    </div>
  );
}
