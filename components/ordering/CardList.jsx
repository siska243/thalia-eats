import { MdDeleteForever } from "react-icons/md";
import Total from "./Total";
import useCreateOrdering from "@/hooks/useCreateOrdering";

export default function CardList({ products }) {
  const { product, quantity } = products
  const { ordering, removeProduct, handleAddProduct } = useCreateOrdering()

  return (
    <div className="py-5 px-4 border-b border-gray-300">
      {/* list content */}
      <div className="flex items-center gap-3 justify-between">
        <div className="flex gap-3">
          {/* plat quantité */}
          <p className="bg-primaryColor flex items-center w-[40px] h-[40px] rounded-full flex-shrink-0 justify-center text-white text-lg font-medium">
            {quantity} <span>X</span>
          </p>
          {/* contenu de plat commandé */}
          <div className="flex flex-col gap-2">
            {/* le prix */}
            <div className="flex items-center text-green-700 font-semibold">
              <span className="mr-2">{product.currency.code} </span>
              <p>{product.price}</p>
            </div>
            {/* nom et description */}
            <div>
              <h2 className="text-black text-base font-semibold">
                {product.title}
              </h2>
              <p className="text-xs">{product.description}</p>
            </div>
          </div>
        </div>

        {/* bouton suppresion */}

        <button className="flex-shrink-0 text-gray-500 hover:text-red-600" onClick={() => removeProduct(product, quantity)}>
          <MdDeleteForever className="text-3xl " />
        </button>
      </div>
    </div>
  );
}
