"use client";

import {useState} from "react";
import Link from "next/link";
import {
    MdAccountCircle,
    MdEmail,
    MdLocationPin,
    MdPhoneAndroid,
} from "react-icons/md";
import ListInfoUser from "./ListInfoUser";
import Spinner from "@/components/Loader/Spinner";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import useCart from "@/hooks/useCart";
import {notification} from "@/hooks/useCreateOrdering";

/**
 * Les informations du client, et le raccourci vers son adresse enregistree.
 *
 * L'interrupteur portait la question a l'envers : coche voulait dire
 * `isNewAdresse === false`, et decoche faisait apparaitre un second formulaire
 * d'adresse. Personne ne pouvait deviner lequel des deux etats ecrivait quoi.
 *
 * Le bouton attendait aussi une seconde avant d'agir, via un `setTimeout`
 * artificiel qui ne servait qu'a montrer un spinner : une attente inventee,
 * sur une connexion deja lente.
 */
export default function UserInfo() {
    const {user} = useGetCurrentUser();
    const {handleCustomOrder} = useCart();
    const [enCours, setEnCours] = useState(false);

    const compte = user?.user;

    if (!compte) {
        return (
            <section className="rounded-card bg-surface p-5 shadow-card sm:p-6">
                <p className="text-body text-ink-muted">
                    Connectez-vous pour renseigner vos informations de livraison.
                </p>
            </section>
        );
    }

    const aUneAdresse = Boolean(compte.street && compte.town_id);

    const utiliserAdresseDuCompte = () => {
        setEnCours(true);

        try {
            const adresse = {
                adresse: `${compte.street} ${compte.number_street} ${compte.town_id?.title ?? ""}`.trim(),
                town: compte.town_id,
                reference: compte.principal_adresse ?? "",
                street: compte.street,
                number_street: compte.number_street,
            };

            localStorage.setItem(
                "thalia_eat_order_delivery_address",
                JSON.stringify(adresse)
            );

            handleCustomOrder(adresse.town);
            notification("Adresse de livraison enregistrée");
        } finally {
            setEnCours(false);
        }
    };

    return (
        <section className="rounded-card bg-surface p-5 shadow-card sm:p-6">
            <h2 className="mb-4 text-title font-bold text-secondaryColor">
                Vos informations
            </h2>

            <div className="flex flex-col">
                <ListInfoUser title={compte.full_name} Icon={MdAccountCircle} />
                <ListInfoUser title={compte.email} Icon={MdEmail} />
                <ListInfoUser title={compte.phone} Icon={MdPhoneAndroid} />

                {aUneAdresse ? (
                    <ListInfoUser
                        lastBorder
                        title={`${compte.street}, N°${compte.number_street}, C/ ${compte.town_id?.title}`}
                        Icon={MdLocationPin}
                    />
                ) : null}
            </div>

            <div className="mt-5 border-t border-surface-border pt-5">
                {aUneAdresse ? (
                    <>
                        <p className="text-caption text-ink-muted">
                            Livrer à l&apos;adresse enregistrée sur votre compte&nbsp;?
                        </p>

                        <button
                            type="button"
                            onClick={utiliserAdresseDuCompte}
                            disabled={enCours}
                            className="mt-3 flex w-full items-center justify-center rounded-pill bg-secondaryColor px-6 py-3.5 text-body font-semibold text-white transition-opacity duration-150 hover:opacity-90 disabled:opacity-60 sm:w-auto sm:px-8"
                        >
                            {enCours ? <Spinner /> : "Utiliser cette adresse"}
                        </button>
                    </>
                ) : (
                    <>
                        <p className="text-caption text-ink-muted">
                            Aucune adresse enregistrée sur votre compte. Saisissez-en une
                            dans le panier, ou enregistrez-la une fois pour toutes.
                        </p>

                        <Link
                            href="/reglages"
                            className="mt-3 inline-flex rounded-pill border border-surface-border px-6 py-3 text-body font-semibold text-ink transition-colors duration-150 hover:bg-surface-sunken"
                        >
                            Enregistrer mon adresse
                        </Link>
                    </>
                )}
            </div>
        </section>
    );
}
