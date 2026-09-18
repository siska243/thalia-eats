"use client";

import {useEffect, useRef} from "react";
import {useDispatch} from "react-redux";
import {MdError} from "react-icons/md";
import EcranPaiement from "@/components/payement/EcranPaiement";
import Loader from "@/components/Loader/Loader";
import useCurrentCommande from "@/hooks/useCurrentCommande";
import {FetchData} from "@/helpers/FetchData";
import {Route} from "@/helpers/Route";
import {fetchCurrentOrder} from "@/store/reducers/cartSlice";

/**
 * Retour d'un paiement en echec.
 *
 * La verification cote serveur partait a chaque changement de
 * `currentCommande`, donc plusieurs fois : elle ne part plus qu'une fois.
 * Comme pour l'abandon, la commande n'est pas annulee — un paiement rate n'est
 * pas une renonciation.
 */
export default function PageEchecPaiement() {
    const {currentCommande, isLoading} = useCurrentCommande();
    const dispatch = useDispatch();
    const dejaVerifie = useRef(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        localStorage.removeItem("flex_pay_number_order_thalia_eats");
        dispatch(fetchCurrentOrder());
    }, [dispatch]);

    useEffect(() => {
        const uid = currentCommande?.uid;
        if (!uid || dejaVerifie.current) return;

        dejaVerifie.current = true;
        FetchData.sendData(Route.check_paiement, {uid});
    }, [currentCommande]);

    if (isLoading) return <Loader />;

    return (
        <EcranPaiement
            ton="echec"
            icone={<MdError className="h-9 w-9" />}
            titre="Paiement échoué"
            message="Le paiement n'a pas abouti. Votre commande est conservée : vous pouvez réessayer, ou nous écrire si le problème persiste."
            actions={[
                {href: "/ordering", label: "Réessayer le paiement"},
                {href: "/support", label: "Contacter le support"},
            ]}
        />
    );
}
