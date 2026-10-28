"use client";

import {useSearchParams} from "next/navigation";
import {Suspense} from "react";
import {BiLoader} from "react-icons/bi";
import {FaCircleCheck, FaCircleXmark} from "react-icons/fa6";

import EcranPaiement from "@/components/payement/EcranPaiement";
import useExpiration from "@/hooks/useExpiration";
import {compteARebours} from "@/helpers/expiration";
import {useRentalBooking, useRentalDepositStatus} from "@/hooks/useRental";

/**
 * Le retour d'un paiement d'acompte, location.
 *
 * Le MÊME composant que les quatre écrans de retour de la livraison
 * (`app/payement/*`) : le client qui paie un repas et celui qui paie une
 * course doivent voir le même écran, et c'est le seul moyen que les deux ne
 * divergent pas au premier ajustement.
 *
 * L'écran interroge la passerelle tant qu'il est ouvert, et montre l'issue
 * dès qu'elle est connue : réussi, échoué, abandonné. Il ne part plus de
 * lui-même sur la course — le client veut d'abord savoir si son argent est
 * passé, et c'est lui qui décide de la suite.
 */

/** Ce que le statut de la réservation dit du paiement. */
type Issue = "attente" | "succes" | "echec" | "annule";

const ISSUE_DU_STATUT: Record<string, Issue> = {
    pending_payment: "attente",
    confirmed: "succes",
    in_progress: "succes",
    completed: "succes",
    // Perdue au profit d'un autre client, ou délai de paiement passé : dans
    // les deux cas l'acompte n'est pas arrivé.
    lost: "echec",
    expired: "echec",
    cancelled: "annule",
};

/*
 * Ce que la passerelle a répondu au navigateur, au retour d'une carte.
 *
 * Ce marqueur ne fait pas foi : seul le statut de la réservation tranche,
 * sans quoi une adresse recopiée à la main annoncerait un paiement qui n'a
 * pas eu lieu. Il ne sert qu'à parler tout de suite, tant que le statut dit
 * encore « en attente ».
 */
const ISSUE_ANNONCEE: Record<string, Issue> = {
    refus: "echec",
    annule: "annule",
};

const Corps = ({uid}: {uid: string}) => {
    const annonce = useSearchParams().get("issue");

    /*
     * Deux sources, une seule vérité.
     *
     * La première relit la réservation ; la seconde demande son verdict à la
     * passerelle et le fait trancher côté serveur. Sans elle, une
     * confirmation perdue en route — webhook jamais reçu — laissait l'écran
     * tourner sur une réservation que FlexPay savait déjà réglée.
     */
    const {data: lue} = useRentalBooking(uid, true);
    const {data: verifiee} = useRentalDepositStatus(uid, true);

    const booking = verifiee ?? lue;

    const {minutes, ecoule} = useExpiration(booking?.expires_at);
    const rebours = compteARebours(minutes);

    const course = `/location/courses/${encodeURIComponent(uid)}`;
    const reprendre = `/location/reservation?uid=${encodeURIComponent(uid)}`;

    const depuisLeStatut = booking ? ISSUE_DU_STATUT[booking.status] : undefined;

    /*
     * L'ordre compte. Le statut tranche dès qu'il dit autre chose que
     * « en attente ». Tant qu'il attend, le marqueur de la passerelle parle à
     * sa place, puis l'échéance : passée, il n'y a plus rien à attendre.
     */
    const issue: Issue =
        depuisLeStatut && depuisLeStatut !== "attente"
            ? depuisLeStatut
            : (ISSUE_ANNONCEE[annonce ?? ""] ?? (ecoule ? "echec" : "attente"));

    if (issue === "succes") {
        return (
            <EcranPaiement
                ton="succes"
                icone={<FaCircleCheck className="h-9 w-9" />}
                titre="Acompte reçu"
                message="Le véhicule est retenu sur votre créneau. Le reste se règle au chauffeur à la fin de la course."
                actions={[
                    {href: course, label: "Suivre ma course"},
                    {href: "/location/courses", label: "Mes courses"},
                ]}
            />
        );
    }

    if (issue === "annule") {
        return (
            <EcranPaiement
                ton="echec"
                icone={<FaCircleXmark className="h-9 w-9" />}
                titre="Paiement abandonné"
                message="Vous avez quitté le paiement, rien n’a été débité. Le véhicule reste retenu jusqu’à l’échéance de votre réservation."
                actions={[
                    {href: reprendre, label: "Recommencer le paiement"},
                    {href: course, label: "Voir ma course"},
                ]}
            />
        );
    }

    if (issue === "echec") {
        return (
            <EcranPaiement
                ton="echec"
                icone={<FaCircleXmark className="h-9 w-9" />}
                titre="Paiement non abouti"
                message="Nous n’avons reçu aucune confirmation, et rien n’a été débité. Vérifiez le solde de votre compte ou de votre carte, puis relancez le paiement."
                actions={[
                    {href: reprendre, label: "Recommencer le paiement"},
                    {href: course, label: "Voir ma course"},
                ]}
            />
        );
    }

    return (
        <EcranPaiement
            ton="attente"
            icone={<BiLoader className="h-9 w-9 animate-spin-slow" />}
            titre="Paiement en attente"
            message={
                (annonce === "succes"
                    ? "Paiement accepté par votre banque. Nous attendons la confirmation de l’opérateur."
                    : "Validez le paiement depuis le message reçu sur votre téléphone, en composant votre code.") +
                " Cette page se met à jour toute seule, ne la fermez pas." +
                (rebours ? ` Il reste ${rebours}.` : "")
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
