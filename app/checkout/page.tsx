"use client";

import React, {Suspense, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import {ActionIcon, Button, Checkbox, Modal, Text, Title} from "rizzui";
import {XMarkIcon} from "@heroicons/react/20/solid";
import {FaCircleArrowRight} from "react-icons/fa6";
import cart from "@/public/assets/images/cart.svg";
import mpesa from "@/public/assets/images/mobile.jpeg";
import PhoneNumber from "@/components/forms/phone-number";
import Spinner from "@/components/Loader/Spinner";
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

                <div className="mt-10 grid gap-5 sm:grid-cols-2">
                    <article className="flex flex-col rounded-card bg-surface p-6 shadow-card">
                        <h2 className="text-title font-bold text-secondaryColor">
                            Mobile money
                        </h2>

                        <div className="my-5 flex flex-1 items-center justify-center">
                            <Image
                                className="h-[160px] w-auto object-contain"
                                src={mpesa}
                                alt=""
                                width={250}
                                height={160}
                            />
                        </div>

                        <p className="text-body leading-6 text-ink-muted">
                            Réglez depuis votre compte M-Pesa, Orange Money ou Airtel Money.
                        </p>

                        <button
                            type="button"
                            onClick={() => setModalState(true)}
                            className="mt-5 inline-flex items-center justify-center rounded-pill bg-brand-500 px-6 py-3.5 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                        >
                            Payer par mobile money
                        </button>
                    </article>

                    <article className="flex flex-col rounded-card bg-surface p-6 shadow-card">
                        <h2 className="text-title font-bold text-secondaryColor">
                            Carte bancaire
                        </h2>

                        <div className="my-5 flex flex-1 items-center justify-center">
                            <Image
                                className="h-[160px] w-auto object-contain"
                                src={cart}
                                alt=""
                                width={180}
                                height={160}
                            />
                        </div>

                        <p className="text-body leading-6 text-ink-muted">
                            Réglez par Visa ou Mastercard, sur la page sécurisée de notre
                            prestataire.
                        </p>

                        <button
                            type="button"
                            onClick={handleCartPayement}
                            disabled={enCours === "carte"}
                            className="mt-5 inline-flex items-center justify-center rounded-pill border border-secondaryColor px-6 py-3.5 text-body font-semibold text-secondaryColor transition-colors duration-150 hover:bg-secondaryColor hover:text-white disabled:opacity-60"
                        >
                            {enCours === "carte" ? <Spinner /> : "Payer par carte"}
                        </button>
                    </article>
                </div>
            </div>

            <Modal
                isOpen={modalState}
                onClose={() => setModalState(false)}
                containerClassName="bg-white"
            >
                <form className="px-6 pb-8 pt-6 sm:px-7" onSubmit={handleSubmit}>
                    <div className="mb-6 flex items-center justify-between gap-3">
                        <Title as="h3" className="!text-title !font-bold">
                            Paiement mobile money
                        </Title>

                        <ActionIcon size="sm" variant="text" onClick={() => setModalState(false)}>
                            <XMarkIcon className="h-auto w-6" strokeWidth={1.8} />
                        </ActionIcon>
                    </div>

                    <PhoneNumber
                        className="mb-5 w-full"
                        country="cd"
                        value={phone}
                        onChange={(valeur: string) => setPhone(valeur)}
                        inputProps={{name: "phone", required: true, autoFocus: true}}
                        preferredCountries={["cd"]}
                        label="Votre numéro de téléphone"
                    />

                    <Checkbox
                        size="lg"
                        inputClassName="border-2"
                        required
                        label={
                            <Text className="text-caption">
                                J&apos;accepte les conditions d&apos;utilisation et la{" "}
                                <Link href="/privacy" className="underline underline-offset-4">
                                    politique de confidentialité
                                </Link>{" "}
                                de Thalia Eats.
                            </Text>
                        }
                    />

                    <Button
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-pill bg-brand-500 py-3.5 text-white hover:bg-brand-600"
                        type="submit"
                        size="md"
                        disabled={enCours === "mobile"}
                    >
                        {enCours === "mobile" ? (
                            <Spinner />
                        ) : (
                            <>
                                <FaCircleArrowRight />
                                <span className="text-body font-semibold">
                                    Je confirme le paiement
                                </span>
                            </>
                        )}
                    </Button>
                </form>
            </Modal>
        </div>
    );
};

export default Page;
