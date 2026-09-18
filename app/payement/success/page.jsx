"use client";

import {useEffect, useRef} from "react";
import {useDispatch} from "react-redux";
import {MdCheckCircle} from "react-icons/md";
import EcranPaiement from "@/components/payement/EcranPaiement";
import Loader from "@/components/Loader/Loader";
import Notify from "@/components/toastify/Notify";
import useCurrentCommande from "@/hooks/useCurrentCommande";
import {FetchData} from "@/helpers/FetchData";
import {Route} from "@/helpers/Route";
import {fetchCurrentOrder} from "@/store/reducers/cartSlice";
import {clearLocalStorageOrdering} from "@/helpers/localstorage-data";

/**
 * Retour d'un paiement reussi.
 *
 * Le bug principal etait a l'appel : `handlerCheckPayement()` etait invoque
 * sans argument, alors qu'il attend un `uid`. La requete partait donc avec
 * `{uid: undefined}` et le paiement n'etait jamais confirme cote serveur.
 * L'effet ne dependait en plus que du montage, donc il partait avant meme que
 * la commande courante soit chargee.
 *
 * La verification attend maintenant l'uid, et ne part qu'une fois : sans le
 * garde-fou, chaque nouveau rendu de la commande relancait la confirmation.
 */
export default function PageSuccesPaiement() {
    const {currentCommande, isLoading} = useCurrentCommande();
    const dispatch = useDispatch();
    const dejaVerifie = useRef(false);

    useEffect(() => {
        const uid = currentCommande?.uid;
        if (!uid || dejaVerifie.current) return;
        if (typeof window === "undefined") return;
        if (!localStorage.getItem("flex_pay_number_order_thalia_eats")) return;

        dejaVerifie.current = true;

        (async () => {
            const reponse = await FetchData.sendData(Route.check_paiement, {uid});

            // FetchData retourne les erreurs axios au lieu de les lever.
            if (reponse?.name === "AxiosError") {
                Notify(
                    reponse.response?.data?.title,
                    "error",
                    reponse.response?.data?.message
                );
                return;
            }

            clearLocalStorageOrdering();
            localStorage.removeItem("flex_pay_number_order_thalia_eats");
            dispatch(fetchCurrentOrder());
            Notify(reponse?.title, "success", reponse?.message);
        })();
    }, [currentCommande, dispatch]);

    if (isLoading) return <Loader />;

    return (
        <EcranPaiement
            ton="succes"
            icone={<MdCheckCircle className="h-9 w-9" />}
            titre="Paiement réussi"
            message="Votre commande est confirmée. Vous pouvez suivre sa préparation et sa livraison à tout moment."
            actions={[
                {href: "/tracking", label: "Suivre ma commande"},
                {href: "/restaurant", label: "Commander autre chose"},
            ]}
        />
    );
}
