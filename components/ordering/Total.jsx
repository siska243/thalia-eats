import React from "react";
import useCreateOrdering from "@/hooks/useCreateOrdering";
import { calcul_price } from "@/helpers/calculePrice"

export default function Total({ currentOrder }) {
  console.log(currentOrder);


  const { ordering } = useCreateOrdering();
  return (
    <div className="border-b border-gray-300">
      <div className="p-5 flex gap-3 flex-col">
        {/* affichr le prix */}
        <p className="flex items-center justify-between">
          <span className="text-lg font-semibold text-secondaryColor">
            Total:
          </span>
          <span>{ordering[0]?.product?.currency.code} {calcul_price(ordering)}</span>
        </p>
        {/* afficher le prix de livraison et de service */}
        {
          currentOrder &&
          (<>
            <p className="flex items-center justify-between">
              <span className="text-lg font-semibold text-secondaryColor">
                Prix Service:
              </span>
              <span>{currentOrder?.products[0]?.currency?.code} {currentOrder?.price_service}</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-lg font-semibold text-secondaryColor">
                Prix Livraison:
              </span>
              <span>{currentOrder?.products[0]?.currency?.code} {currentOrder.price_delivery}</span>
            </p>
          </>)
        }

      </div>
    </div>
  );
}
