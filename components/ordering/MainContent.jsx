import React, { useEffect, useState } from "react";
import { FaRegArrowAltCircleDown } from "react-icons/fa";
import CardPlat from "./CardPlat";
import PizzaImg from "@/public/assets/images/pizzaFood.png";
import UserInfo from "./UserInfo"
import LivraisonInfo from "./LivraisonInfo"
import useDefaultData from "@/hooks/useCommandeData";
import useCreateOrdering from "@/hooks/useCreateOrdering";
import { price_delivrery, calcul_price, total, customProduct } from "@/helpers/calculePrice";
import { FetchData } from "@/helpers/FetchData";
import useReferentialData from "@/hooks/useQueryTanStack";
import { Route } from '@/helpers/Route'
import { setCurrentOrder, setDeliveryPrice } from "@/store/reducers/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import Notify from "@/components/toastify/Notify";


export default function MainContent() {
  const dispatch = useDispatch();
  const { ordering } = useCreateOrdering();
  const { data: townData } = useDefaultData()
  const [isNewAdresse, setNewAdresse] = useState(false);
  const handlerNewAdresse = () => {
    setNewAdresse(!isNewAdresse)
  }
  // les données de currentOrdering
  const { data: currentCommande, isLoading: currentLoading, isError, isFetched } = useReferentialData({ url: Route.current_commande, queryKey: 'current-commande' })

  // au chargement on recupère les données de la commande courante

  useEffect(() => {
    if (currentCommande) {
      dispatch(setCurrentOrder(currentCommande));
      return

    }

  }, [currentCommande, townData])

  useEffect(() => {
    if (townData) {
      dispatch(setDeliveryPrice(townData))
    }
  }, [townData])
  // fonction pour recuperer les données de la commande du l'utilisateur
  const getFormData = async (FormData) => {

    

    const livraisonPrix = price_delivrery(calcul_price(ordering), townData.delivrery_price, FormData.town)

   

    const frais_livraison = livraisonPrix ? livraisonPrix.frais_livraison : 0;
    const service_price = livraisonPrix ? livraisonPrix.service_price : 0
    

    const total_prix = total(calcul_price(ordering), service_price, frais_livraison)

    const findTown = townData.town.find((item) => item.slug === FormData.town)

    const commande = {
      products: customProduct(ordering),
      pricing: {
        frais_livraison,
        service_price,
        currency: livraisonPrix ? livraisonPrix.currency : ordering[0].product.currency
      },

      adresse: {
        adresse: `${FormData.street} ${FormData.numberStreet} ${FormData.reference}`,
        town: findTown,
        reference: FormData.reference,
        street: FormData.street,
        number_street: FormData.numberStreet
      }
    }

    if (ordering) {
      const response = await FetchData.sendData(Route.send_commande, commande)

      if (response.name == "AxiosError") {

        const { response: { data: { message } } } = response;
        Notify(message, "error");

      }
      else {
        dispatch(setCurrentOrder(response.data))
        Notify("Commande enregistrée", "success");
      }

    }



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
