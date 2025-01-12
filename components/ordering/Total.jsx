import React from "react";
import useCreateOrdering from "@/hooks/useCreateOrdering";
import { calcul_price } from "@/helpers/calculePrice"

export default function Total({ currentOrder }) {

  const { ordering } = useCreateOrdering();
  return (
    <div className="border-b border-gray-300">
      <div className="p-5 flex gap-3 flex-col">
        {/* affichr le prix */}
        <p className="flex items-center justify-between">
          <span className="text-base font-semibold text-secondaryColor">
            Total :
          </span>
          <span>{calcul_price(ordering)} {ordering[0]?.product?.currency.code} </span>
        </p>
        {/* afficher le prix de livraison et de service */}
        {/* {
          currentOrder && currentOrder.length > 0
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
        } */}
        {currentOrder && Array.isArray(currentOrder.products) && currentOrder.products.length > 0 && (
          <>
            <p className="flex items-center justify-between">
              <span className="text-base font-semibold text-secondaryColor">
                Prix Service :
              </span>
              <span>
                {currentOrder.price_service} {currentOrder.products[0]?.currency?.code}
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-base font-semibold text-secondaryColor">
                Prix Livraison :
              </span>
              <span>
                {currentOrder.price_delivery} {currentOrder.products[0]?.currency?.code}
              </span>
            </p>
          </>
        )}

      </div>
    </div>
  );
}
