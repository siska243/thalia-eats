"use client";

import UserInfo from "./UserInfo";

/**
 * Le panneau gauche du panier : qui commande, et ou livrer.
 *
 * Il portait un second formulaire d'adresse, `LivraisonInfo`, en plus de celui
 * du panier (`ConfirmAdress`) et de celui du compte (`UpdateAdresse`) : trois
 * ecritures de la meme adresse, dans trois composants. Elles avaient deja
 * diverge — `LivraisonInfo` composait l'adresse avec le *slug* de la commune
 * (`gombe`) la ou les autres utilisaient son titre (`Gombe`), si bien que le
 * texte affiche changeait selon le formulaire utilise.
 *
 * La saisie d'adresse n'a plus qu'un seul endroit, `ConfirmAdress`, dans le
 * panier. Ce panneau ne fait plus que proposer l'adresse deja enregistree au
 * compte.
 */
export default function MainContent() {
    return (
        <div className="flex flex-col gap-5">
            <UserInfo />
        </div>
    );
}
