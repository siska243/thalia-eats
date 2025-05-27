import {FaCircleArrowRight} from "react-icons/fa6";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import Spinner from "@/components/Loader/Spinner";
import {useRouter} from "next/navigation";
import useIsLargeScreen from "@/hooks/useLargeScreen";


export default function Checkout() {

    const [loading, setLoading] = useState(false);

    const {order} = useSelector((state) => state.shop)


    const router = useRouter();

    const success_url = `${window.location.origin}/payement/success`;
    const error_url = `${window.location.origin}/payement/error`;
    const cancel_url = `${window.location.origin}/payement/cancel`;
    const webhook_sse_url = `${window.location.origin}/api/events`;
    const callback_url =
        process.env.NODE_ENV === "production"
            ? "https://thalia.cooceckivu.org/api/webhook-paiement-flexpay"
            : "http://127.0.0.1:8000/api/webhook-paiement-flexpay";

    // fonction pour checker payement
    const handlerCheckPayement = async () => {
        if (order?.data) {
            setLoading(true)
            const data = {
                success_url,
                error_url,
                cancel_url,
                callback_url,
                webhook_sse_url,
                order: order.data
            };

            const url = "/checkout?params=" + btoa(JSON.stringify(data));
            router.prefetch(url);
            router.push(url);

            setTimeout(() => {
                setLoading(false)
            }, 1000)
        }
    };

    const {isLargeScreen} = useIsLargeScreen()

    if (!order?.data?.adresse?.town?.slug) {

        return <div className={'p-4'}>
            <span className="text-lg font-medium">Veuillez confirmer votre address</span>
        </div>
    }

    return (
        <div>
            {isLargeScreen ? <div data-aos="fade-up" className="p-5">
                <button
                    className="p-4 flex items-center justify-center gap-2 w-full rounded-xl text-white bg-green-700 cursor-pointer hover:bg-green-900 transition-all duration-300 ease-in-out"
                    onClick={handlerCheckPayement}
                    disabled={loading}
                >
                    {loading ? (
                        <Spinner/>
                    ) : (
                        <>
              <span>
                <FaCircleArrowRight/>
              </span>
                            <span className="text-lg font-medium">Passer au paiement</span>
                        </>
                    )}
                </button>
            </div> : <div className="p-5">
                <button
                    className="p-4 flex items-center justify-center gap-2 w-full rounded-xl text-white bg-green-700 cursor-pointer hover:bg-green-900 transition-all duration-300 ease-in-out"
                    onClick={handlerCheckPayement}
                    disabled={loading}
                >
                    {loading ? (
                        <Spinner/>
                    ) : (
                        <>
              <span>
                <FaCircleArrowRight/>
              </span>
                            <span className="text-lg font-medium">Passer au paiement</span>
                        </>
                    )}
                </button>
            </div>}

        </div>
    );
}
