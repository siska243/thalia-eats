"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {Suspense, useEffect} from "react";
import {BiLoader} from "react-icons/bi";
import {FaCircleCheck, FaCircleXmark} from "react-icons/fa6";

import EcranPaiement from "@/components/payement/EcranPaiement";
import {useRentalBooking} from "@/hooks/useRental";

/**
 * Le retour d'un paiement d'acompte, location.
 *
 * Le MEME composant que les quatre écrans de retour de la livraison
 * (`app/payement/*`) : le client qui paie un repas et celui qui paie une
 * course doivent voir le même écran, et c'est le seul moyen que les deux ne
 * divergent pas au premier ajustement.
 *
 * Une page à elle seule, et non une bannière sur la fiche de la course : la
 * fiche remontre l'écran de règlement tant que l'acompte n'est pas reçu, si
 * bien que le client croyait être revenu en arrière sans savoir si son
 * paiement était passé.
 *
 * L'issue annoncée par la passerelle sert à parler tout de suite, jamais à
 * conclure : seul le STATUT de la réservation fait foi. Sans cette règle, une
 * adresse recopiée à la main annoncerait un paiement qui n'a pas eu lieu.
 */
const Corps = ({uid}: {uid: string}) => {
    const router = useRouter();
    const issue = useSearchParams().get("issue");

    const {data: booking} = useRentalBooking(uid, true);

    const course = `/location/courses/${encodeURIComponent(uid)}`;
    const reprendre = `/location/reservation?uid=${encodeURIComponent(uid)}`;

    /*
     * L'acompte est arrivé : le client part sur sa course. C'est le sondage
     * qui décide du moment, pas un délai posé au hasard.
     *
     * `replace` et non `push` : le bouton Retour du navigateur ne doit pas
     * ramener sur un écran d'attente qui n'a plus lieu d'être.
     */
    useEffect(() => {
        if (booking && booking.status !== "pending_payment") {
            router.replace(course);
        }
    }, [booking, course, router]);

    if (issue === "refus" || issue === "annule") {
        return (
            <EcranPaiement
                ton="echec"
                icone={<FaCircleXmark className="h-9 w-9" />}
                titre={issue === "annule" ? "Paiement abandonné" : "Paiement refusé"}
                message={
                    issue === "annule"
                        ? "Vous avez quitté la page de paiement, rien n’a été débité. Le véhicule reste retenu jusqu’à l’échéance de votre réservation."
                        : "Votre banque a refusé l’opération, rien n’a été débité. Vérifiez le solde ou les plafonds de votre carte. Le véhicule reste retenu jusqu’à l’échéance de votre réservation."
                }
                actions={[
                    {href: reprendre, label: "Recommencer le paiement"},
                    {href: course, label: "Voir ma course"},
                ]}
            />
        );
    }

    if (booking && booking.status !== "pending_payment") {
        return (
            <EcranPaiement
                ton="succes"
                icone={<FaCircleCheck className="h-9 w-9" />}
                titre="Acompte reçu"
                message="Le véhicule est retenu. Nous vous emmenons sur votre course."
                actions={[{href: course, label: "Voir ma course"}]}
            />
        );
    }

    return (
        <EcranPaiement
            ton="attente"
            icone={<BiLoader className="h-9 w-9 animate-spin-slow" />}
            titre="Paiement en attente"
            message={
                issue === "succes"
                    ? "Paiement accepté par votre banque. Nous attendons la confirmation de l’opérateur : cette page se met à jour toute seule, ne la fermez pas."
                    : "Validez le paiement depuis le message reçu sur votre téléphone. Cette page se met à jour toute seule, ne la fermez pas."
            }
            actions={[
                {href: reprendre, label: "Le paiement n’aboutit pas ? Recommencer"},
                {href: course, label: "Voir ma course"},
            ]}
        />
    );
};

/*
 * `useSearchParams` impose une frontière de Suspense : sans elle, la page
 * entière bascule en rendu dynamique au build.
 */
export default function SuiviPaiement({uid}: {uid: string}) {
    return (
        <Suspense fallback={null}>
            <Corps uid={uid} />
        </Suspense>
    );
}
