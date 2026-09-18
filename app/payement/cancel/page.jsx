"use client";

import {useEffect} from "react";
import {MdCancel} from "react-icons/md";
import EcranPaiement from "@/components/payement/EcranPaiement";

/**
 * Retour d'un paiement abandonne.
 *
 * Cette page appelait `/commande/cancel` au chargement, c'est-a-dire qu'elle
 * ANNULAIT LA COMMANDE. Abandonner un paiement — fermer l'onglet du
 * prestataire, revenir en arriere, manquer de reseau — detruisait donc la
 * commande, alors que le client voulait seulement reessayer plus tard. Elle
 * vidait aussi le panier, ne laissant rien a reprendre.
 *
 * C'est tres probablement l'origine des commandes trouvees en base avec
 * `cancel_at` renseigne et le statut reste a « en attente de paiement ».
 *
 * Desormais elle n'ecrit rien. L'annulation reste possible depuis « Mes
 * commandes » — un geste explicite, avec confirmation.
 */
export default function PageAnnulationPaiement() {
    useEffect(() => {
        if (typeof window === "undefined") return;

        // Seule chose a effacer : la reference du paiement abandonne, que la
        // page d'attente interrogerait sinon indefiniment. Le panier et la
        // commande ne sont pas touches.
        localStorage.removeItem("flex_pay_number_order_thalia_eats");
    }, []);

    return (
        <EcranPaiement
            ton="attente"
            icone={<MdCancel className="h-9 w-9" />}
            titre="Paiement annulé"
            message="Votre commande est conservée, elle attend simplement son règlement. Vous pouvez reprendre le paiement quand vous le souhaitez."
            actions={[
                {href: "/ordering", label: "Reprendre le paiement"},
                {href: "/historique", label: "Mes commandes"},
            ]}
        />
    );
}
