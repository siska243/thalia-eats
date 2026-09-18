"use client";

import {BiLoader} from "react-icons/bi";
import EcranPaiement from "@/components/payement/EcranPaiement";
import Loader from "@/components/Loader/Loader";
import useCurrentCommande from "@/hooks/useCurrentCommande";

/** Le paiement mobile money attend la validation sur le telephone du client. */
export default function PageAttentePaiement() {
    const {isLoading} = useCurrentCommande();

    if (isLoading) return <Loader />;

    return (
        <EcranPaiement
            ton="attente"
            icone={<BiLoader className="h-9 w-9 animate-spin-slow" />}
            titre="Paiement en attente"
            message="Validez le paiement depuis le message reçu sur votre téléphone. Votre commande est conservée en attendant."
            actions={[
                {href: "/tracking", label: "Suivre ma commande"},
                {href: "/historique", label: "Mes commandes"},
            ]}
        />
    );
}
