import React, { useEffect, useState } from "react";
import UserInfo from "./UserInfo"
import LivraisonInfo from "./LivraisonInfo"
import useDefaultData from "@/hooks/useCommandeData";
import { price_delivrery, calcul_price, total, customProduct } from "@/helpers/calculePrice";
import { FetchData } from "@/helpers/FetchData";
import useReferentialData from "@/hooks/useQueryTanStack";
import { Route } from '@/helpers/Route'
import { setCurrentOrder, setDeliveryPrice } from "@/store/reducers/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import Notify from "@/components/toastify/Notify";
import useCart from "@/hooks/useCart";


export default function MainContent() {
  const dispatch = useDispatch();

  const {handleCustomOrder}=useCart()

  const {cart:ordering} = useSelector((state) => state.shop)
  const { data: townData } = useDefaultData()
  const [isNewAdresse, setNewAdresse] = useState(false);
  const handlerNewAdresse = () => {
    setNewAdresse(!isNewAdresse)
  }


  const getFormData = async (FormData) => {

    const findTown = townData.town.find((item) => item.slug === FormData.town)
    const current_address= {
      adresse: `${FormData?.street} ${FormData?.numberStreet} ${FormData?.town}`,
      town: findTown,
      reference: FormData?.reference,
      street: FormData?.street,
      number_street: FormData?.numberStreet
    }

    localStorage.setItem("thalia_eat_order_delivery_address",JSON.stringify(current_address))

    handleCustomOrder(current_address?.town)

    Notify("Adresse de livraison enregistrée avec succès", "success");
  }
  return (
    <section className="flex flex-col gap-4">
      {/* contenu d'un menu selectionné */}
      {/* <div className="flex items-center justify-between mb-16">
        <h2 className="text-3xl text-primaryColor font-semibold">Pizza</h2>
        <form
          action=""
          className="flex items-center justify-between rounded-full bg-[#F6F6F6] p-3 pl-8 border border-gray-300 w-[250px] "
        >
          <input
            type="text"
            className="border-none outline-none bg-transparent placeholder:text-gray-800 placeholder:text-sm placeholder:font-normal"
            placeholder="Sort by Pricing"
          />
          <button>
            <FaRegArrowAltCircleDown className="text-2xl text-gray-700" />
          </button>
        </form>
      </div> */}


      <UserInfo  handlerNewAdresse={handlerNewAdresse} isNewAdresse={isNewAdresse} />
      {/* Affichage conditionnel de LivraisonInfo */}
      {isNewAdresse && (
        <LivraisonInfo getFormData={getFormData} />
      )}

    </section>
  );
}
