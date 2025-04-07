import React from "react";
import useCreateOrdering from "@/hooks/useCreateOrdering";
import { calcul_price } from "@/helpers/calculePrice";

export default function Total({ currentOrder }) {
  const hasCurrentOrder = currentOrder && Object.keys(currentOrder).length > 0;
  const { ordering } = useCreateOrdering();
  return (
    <div className="border-b border-gray-300">
      <div data-aos="fade-up" className="p-5 flex gap-3 flex-col">
        {/* affichr le prix */}
        <p className="flex items-center justify-between">
          <span className="text-base font-semibold text-primaryColor">
            Total :
          </span>

          {currentOrder && currentOrder.global_price ? (
            <span className="font-semibold text-green-700">{currentOrder?.global_price} {currentOrder?.products[0]?.currency?.code}</span>
          ) : (
            <span className="font-semibold text-green-700">
              {calcul_price(ordering)} {ordering[0]?.product?.currency?.code}
            </span>
          )}
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
        {hasCurrentOrder &&
          currentOrder.products.length > 0 && (
            <>
              <p className="flex items-center justify-between">
                <span className="text-base text-secondaryColor">
                  Frais de Service :
                </span>
                <span className="font-semibold text-green-700">
                  {currentOrder.price_service}{" "}
                  {currentOrder.products[0]?.currency?.code}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-base  text-secondaryColor">
                  Frais de Livraison :
                </span>
                <span className="font-semibold text-green-700">
                  {currentOrder.price_delivery}{" "}
                  {currentOrder.products[0]?.currency?.code}
                </span>
              </p>
            </>
          )}
      </div>
    </div>
  );
}
