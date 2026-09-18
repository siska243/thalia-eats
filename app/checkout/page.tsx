"use client";

import React, {Suspense, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import ChoixPaiement from "@/components/ordering/ChoixPaiement";
import ModalMobileMoney from "@/components/ordering/ModalMobileMoney";
import Notify from "@/components/toastify/Notify";
import {FetchData} from "@/helpers/FetchData";
import {Route} from "@/helpers/Route";
import {clearLocalStorageOrdering} from "@/helpers/localstorage-data";

const Page = () => (
    <Suspense>
        <CheckoutPage />
    </Suspense>
);

/**
 * Le choix du mode de paiement.
 *
 * Quatre corrections :
 *
 * - la case a cocher etait redigee en anglais — « I agree to Thalia eats's
 *   Terms of Service and Privacy Policy » — sur un site entierement francais,
 *   et ses deux liens ne menaient nulle part. Ils pointent sur /privacy.
 * - un seul `isLoading` servait aux deux methodes : payer par carte faisait
 *   aussi tourner le bouton mobile money, comme si les deux partaient.
 * - la mise en page passait par `useIsLargeScreen`, qui mesure la fenetre en
 *   JavaScript : au premier rendu la valeur est fausse et la page sautait
 *   d'une colonne a deux apres l'hydratation. Une grille CSS n'a pas ce saut.
 * - quand le parametre `params` manquait, le bouton carte ne faisait
 *   strictement rien, sans un mot. Il le dit maintenant.
 *
 * Les deux cartes et la fenetre de saisie du numero vivent desormais dans
 * `components/ordering/` : la page de paiement d'une pre-commande montre les
 * memes, et non une imitation.
 */
const CheckoutPage = () => {
    const [enCours, setEnCours] = useState<null | "carte" | "mobile">(null);
    const [modalState, setModalState] = useState(false);
    const [phone, setPhone] = useState<string | null>(null);

    const router = useRouter();
    const search = useSearchParams().get("params");

    /**
     * Le panier arrive encode en base64 dans l'URL. On le remet a plat dans la
     * forme attendue par l'API, qui veut `pricing`/`products`/`address` a la
     * racine et non sous `order`.
     */
    const lireCommande = () => {
        if (!search) return null;

        try {
            const json = JSON.parse(atob(search));
            if (!json?.order) return null;

            const {order, ...reste} = json;

            return {
                ...reste,
                pricing: order.pricing,
                products: order.products,
                address: order.adresse,
                total_price: order.total_price,
            };
        } catch {
            return null;
        }
    };

    const handleCartPayement = async () => {
        const commande = lireCommande();

        if (!commande) {
            Notify("Votre panier n'a pas pu être lu, recommencez la commande", "error");
            return;
        }

        setEnCours("carte");

        try {
            const response = await FetchData.sendData(Route.cart_checkout_commande, {
                ...commande,
                method: "cart",
            });

            // FetchData retourne les erreurs axios au lieu de les lever.
            if (response?.name === "AxiosError") {
                Notify(response.response?.data?.message ?? "Paiement impossible", "error");
                return;
            }

            clearLocalStorageOrdering();
            localStorage.setItem(
                "flex_pay_number_order_thalia_eats",
                response.data.orderNumber
            );
            Notify(response.message, "success");
            window.location.href = response.data.url;
        } finally {
            setEnCours(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const commande = lireCommande();

        if (!commande) {
            Notify("Votre panier n'a pas pu être lu, recommencez la commande", "error");
            return;
        }

        setEnCours("mobile");

        try {
            const response = await FetchData.sendData(Route.valide_commande, {
                ...commande,
                phone,
            });

            if (response?.name === "AxiosError") {
                Notify(response.response?.data?.message ?? "Paiement impossible", "error");
                return;
            }

            clearLocalStorageOrdering();
            localStorage.setItem(
                "flex_pay_number_order_thalia_eats",
                response.data.orderNumber
            );
            Notify(response.message, "success");
            setModalState(false);
            router.push("/payement/attente");
        } finally {
            setEnCours(null);
        }
    };

    return (
        <div className="min-h-svh bg-surface-sunken px-4 pb-16 pt-[calc(var(--header-h)+24px)]">
            <div className="mx-auto max-w-4xl">
                <header className="text-center">
                    <h1 className="text-display font-extrabold text-secondaryColor">
                        Comment souhaitez-vous payer&nbsp;?
                    </h1>
                    <p className="mx-auto mt-3 max-w-md text-body leading-7 text-ink-muted">
                        Choisissez votre moyen de paiement pour régler votre commande.
                    </p>
                </header>

                <div className="mt-10">
                    <ChoixPaiement
                        enCours={enCours}
                        onMobile={() => setModalState(true)}
                        onCarte={handleCartPayement}
                    />
                </div>
            </div>

            <ModalMobileMoney
                ouvert={modalState}
                onClose={() => setModalState(false)}
                phone={phone}
                onPhone={setPhone}
                onSubmit={handleSubmit}
                enCours={enCours === "mobile"}
            />
        </div>
    );
};

export default Page;
