import React from "react";
import { calcul_price } from "@/helpers/calculePrice";
import {useSelector} from "react-redux";


export default function Total() {

  const {cart, order:{data}} = useSelector((state) => state.shop)

  return (
    <div className="border-b border-gray-300">
      <div data-aos="fade-up" className="p-5 flex gap-3 flex-col">
        {/* affichr le prix */}
        <p className="flex items-center justify-between">
          <span className="text-base font-semibold text-primaryColor">
            Total :
          </span>

          {data  ? (
            <span className="font-semibold text-green-700">{data?.total_price} {data?.pricing?.currency?.code}</span>
          ) : (
            <span className="font-semibold text-green-700">
              {calcul_price(cart)} {cart[0]?.currency?.code}
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
        {data &&
            data.products?.length > 0 && (
            <>
              <p className="flex items-center justify-between">
                <span className="text-base text-secondaryColor">
                  Frais de Service :
                </span>
                <span className="font-semibold text-green-700">
                  {data?.pricing?.service_price}{" "}
                  {data?.pricing?.currency?.code}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-base  text-secondaryColor">
                  Frais de Livraison :
                </span>
                <span className="font-semibold text-green-700">
                  {data?.pricing?.frais_livraison}{" "}
                  {data?.currency?.code}
                </span>
              </p>
            </>
          )}
      </div>
    </div>
  );
}
