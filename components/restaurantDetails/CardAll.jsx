import Image from "next/image";
import { useParams } from "next/navigation";
import { FaCirclePlus } from "react-icons/fa6";
import { Route } from "@/helpers/Route";
import useReferentialData from "@/hooks/useQueryTanStack";
import { useState } from "react";
import useCreateOrdering from "@/hooks/useCreateOrdering";



export default function CardAll({ product }) {
  const { slug } = useParams()
  const [isLoading, setIsloading] = useState(false)
  const [menu, setMenu] = useState([])
  const { ordering, handleAddProduct, removeProduct } = useCreateOrdering()

  const fetchMenuProduct = (product) => {

    handleAddProduct(product)
  }

  return (
    <div className="relative w-full overflow-hidden box-shadow-custom flex py-6 px-6 md:py-8 md:px-8 gap-3  justify-center items-center bg-secondaryColor">
      <div className="w-1/2 flex-shrink-0">
        <h3 className="text-primaryColor font-semibold text-[15px] lg:text-base mb-3 lowercase first-letter:uppercase">
          {product.title}
        </h3>
        <p className="text-white font-normal text-xs md:text-sm mb-3">
          {product.description ? product.description : "Pas de description pour ce produit"}
        </p>
        <p className="text-secondaryColor font-bold text-xs sm:text-sm bg-primaryColor inline-block p-3 rounded-md box-shadow-custom">
          {product.price} <span>{product.currency.code}</span>
        </p>
      </div>
      <div className="w-1/2 h-full flex-shrink-0">
        <Image
          width={300}
          height={500}
          alt={product.title}
          src={product.picture}
          className="h-[150px] w-full object-cover rounded-xl"
        />
      </div>
      <div className="absolute bottom-0 right-0 z-10">
        <button className="bg-primaryColor p-3 lg:p-5 rounded-tl-3xl shadow-lg" onClick={() => fetchMenuProduct(product)}>
          <FaCirclePlus className="text-lg md:text-2xl" />
        </button>
      </div>
    </div>
  );
}
