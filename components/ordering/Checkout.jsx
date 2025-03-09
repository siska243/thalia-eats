import {FaCircleArrowRight} from "react-icons/fa6";
import {useSelector} from "react-redux";
import {Route} from '@/helpers/Route'
import {FetchData} from "@/helpers/FetchData";
import useCreateOrdering from "@/hooks/useCreateOrdering";
import useDefaultData from "@/hooks/useCommandeData";
import {price_delivrery, calcul_price} from "@/helpers/calculePrice";
import {useEffect, useState} from "react";
import Spinner from "@/components/Loader/Spinner";
import Notify from "@/components/toastify/Notify";
import {useRouter} from "next/navigation";


export default function Checkout() {
    const {ordering} = useCreateOrdering();
    const {data} = useDefaultData()
    const {currentOrder} = useSelector((state) => state.cart);
    const {
        service_price,
        livraison_price,
        currency,
    } = useSelector(state => state.cart?.pricings)

    const [loading, setLoading] = useState(false);

    const router = useRouter()


    const success_url = `${window.location.origin}/payement/success`
    const error_url = `${window.location.origin}/payement/error`
    const cancel_url = `${window.location.origin}/payement/cancel`
    const callback_url = process.env.NODE_ENV === 'production' ? "https://thalia.cooceckivu.org/api/webhook-paiement-flexpay" :'http://127.0.0.1:8000/api/webhook-paiement-flexpay';

    // fonction pour checker payement
    const handlerCheckPayement = async () => {


        if (currentOrder) {


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
                callback_url,
                pricing,
            }


            const url = "/checkout?params=" + btoa(JSON.stringify(data))
            router.prefetch(url)
            router.push(url)

            return


            try {
                setLoading(true);
                const response = await FetchData.sendData(Route.valide_commande, data)
                if (response.name === "AxiosError") {
                    const {response: {data: {message}}} = response;
                    Notify(message, "error");
                } else {
                    Notify("Valider votre commande", "info");
                    window.location.href = response.data.url
                }

      } catch (e) {
        console.log(e);
      }
      finally {
        setLoading(false);
      }
    }
  }
  return (
    <div>
      <div data-aos="fade-up" className="p-5">
        <button className="p-4 flex items-center justify-center gap-2 w-full rounded-xl text-white bg-green-700 cursor-pointer "
          onClick={handlerCheckPayement} disabled={loading}>

                    {
                        loading ? (<Spinner/>) : (
                            <>
                <span>
                  <FaCircleArrowRight/>
                </span>
                                <span className="text-lg font-medium">Checkout!</span>
                            </>
                        )
                    }

                </button>
            </div>
        </div>
    );
}
