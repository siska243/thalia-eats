import Image from "next/image";
import { useParams } from "next/navigation";
import { FaCirclePlus } from "react-icons/fa6";
import { Route } from "@/helpers/Route";
import useReferentialData from "@/hooks/useQueryTanStack";
import { useState } from "react";
import useCreateOrdering from "@/hooks/useCreateOrdering";
import {ProductType} from "@/types/main";
import useCart from "@/hooks/useCart";



export default function CardAll({ product }:{product:ProductType}) {

    const {handleAddProductCart}=useCart()

  const fetchMenuProduct = (product:ProductType) => {

      handleAddProductCart(product)
  }

  return (
    <div className="relative w-full overflow-hidden box-shadow-custom flex  gap-3  justify-center items-center bg-secondaryColor h-[210px]">
      <div className="w-1/2 flex-shrink-0 p-4 md:py-5 md:px-5">
        <h3 className="text-primaryColor font-semibold text-lg mb-3 lowercase first-letter:uppercase line-clamp-2">
          {product.title}
        </h3>
        <p className="text-white font-light text-sm mb-5 !line-clamp-2">
          {product.description ? product.description : "Pas de description pour ce produit"}
        </p>
        <p className="text-secondaryColor font-[600] text-xs sm:text-sm bg-primaryColor inline-block p-2 box-shadow-custom">
          {product.price} <span>{product.currency.code}</span>
        </p>
      </div>
      {/* image */}
      <div className="w-1/2 h-full flex-shrink-0">
        <Image
          width={300}
          height={210}
          alt={product.title}
          src={product.picture}
          className="h-full w-full object-cover rounded-xl"
        />
      </div>
      <div className="absolute bottom-0 right-0 z-10">
        <button className="bg-primaryColor p-5 rounded-tl-3xl shadow-lg" onClick={() => fetchMenuProduct(product)}>
          <FaCirclePlus className="text-2xl" />
        </button>
      </div>
    </div>
  );
}
