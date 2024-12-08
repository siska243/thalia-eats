import { FaCircleArrowRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Route } from '@/helpers/Route'
import { FetchData } from "@/helpers/FetchData";
import useCreateOrdering from "@/hooks/useCreateOrdering";
import useDefaultData from "@/hooks/useCommandeData";
import { price_delivrery, calcul_price } from "@/helpers/calculePrice";
import { useEffect, useState } from "react";

export default function Checkout() {
  const { ordering } = useCreateOrdering();
  const { data } = useDefaultData()
  const { currentOrder } = useSelector((state) => state.cart?.currentOrder);
  const {
    service_price,
    livraison_price,
    currency,
  } = useSelector(state => state.cart?.pricings)


  const success_url = "http://localhost:3000/payement/success"
  const error_url = "http://localhost:3000/payement/error"
  const cancel_url = "http://localhost:3000/payement/cancel"

  // fonction pour checker payement
  const handlerCheckPayement = async () => {

    if (currentOrder) {
      console.log(currentOrder);
      return

      // ****************************************
      const pricing = {
        frais_livraison: livraison_price,
        service_price,
        currency: currency ? currency : currentOrder?.products[0]?.currency
      }
      const data = {
        success_url,
        error_url,
        cancel_url,
        pricing,
      }

      try {
        const response = await FetchData.sendData(Route.valide_commande, data)
        console.log(response);
        if (response.name == "AxiosError") {

        }
        else {
          window.location.href = response.url
        }

      } catch (e) {
        console.log(e);
      }
    }
  }
  return (
    <div>
      <div className="p-5">
        <button className={`p-4 flex items-center justify-center gap-4 w-full rounded-xl text-white ${currentOrder
          ? 'bg-green-700 cursor-pointer'
          : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={!currentOrder} onClick={handlerCheckPayement}>
          <span>
            <FaCircleArrowRight />
          </span>
          <span className="text-lg font-medium">Checkout!</span>
        </button>
      </div>
    </div>
  );
}
