import useCreateOrdering from "@/hooks/useCreateOrdering";
import Image from "next/image";

import { FaCirclePlus } from "react-icons/fa6";

export default function CardOffers({ product }) {

  const { ordering, handleAddProduct, removeProduct } = useCreateOrdering()

  const fetchMenuProduct = (product) => {

    handleAddProduct(product)
  }
  return (
    <div className="relative w-full overflow-hidden rounded-xl box-shadow-custom h-[250px] md:h-[300px]">
      <Image
        className="w-full h-full object-cover"
        src={product.picture}
        alt={product.title}
        width={500}
        height={500}
      />
      <div className="absolute top-0 right-0 w-full h-full bg-custom-gradient">
        <span className="absolute top-0 right-4 bg-secondaryColor px-5 py-2 text-white rounded-b-lg text-base">
          {product.price} <span className="text-primaryColor">{product.currency.code}</span>
        </span>
        <div className="absolute bottom-10 left-3 md:left-6">
          <p className="text-primaryColor text-sm  md:text-base w-[80%]">{product.description}</p>
          <h4 className="text-white text-xl lg:text-2xl lowercase first-letter:uppercase">{product.title}</h4>
        </div>
      </div>
      <div className="absolute bottom-0 right-0">
        <button className="bg-white p-5 rounded-tl-3xl shadow-2xl" onClick={() => fetchMenuProduct(product)}>
          <FaCirclePlus className="text-xl lg:text-2xl" />
        </button>
      </div>
    </div>
  );
}
