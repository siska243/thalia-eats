"use client";

import Link from "next/link";
import {useSelector} from "react-redux";
import BannerResto from "@/components/commons/BannerResto";
import BeforeFooterContent from "@/components/commons/BeforeFooterContent";
import MainContent from "@/components/ordering/MainContent";
import Order from "@/components/ordering/Order";
import EmptyState from "@/components/ui/EmptyState";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import useCart from "@/hooks/useCart";

/**
 * Le panier et la validation de commande.
 *
 * La page portait un ecran de chargement plein cadre pilote par un `loading`
 * qui ne servait qu'a recopier le restaurant du premier article du panier :
 * une lecture synchrone en memoire, presentee comme un appel reseau. Elle
 * affichait donc un spinner avant chaque rendu, sans rien attendre.
 *
 * Elle trainait aussi trois blocs de balisage commentes — un menu deroulant de
 * categories, une barre de recherche, un panneau lateral — et les imports qui
 * allaient avec, charges a chaque visite.
 */
export default function PagePanier() {
    const {cart: ordering} = useSelector((state) => state.shop);
    const {user} = useGetCurrentUser();
    const {handleRemoveProduct} = useCart();

    // Le restaurant n'est pas un etat : c'est une lecture du panier. Le
    // stocker et le recopier dans un effet imposait un rendu supplementaire a
    // chaque changement de panier, pour une valeur deja disponible.
    const restaurant = ordering?.[0]?.restaurant ?? null;

    if (!user) {
        return (
            <div className="min-h-svh bg-surface-sunken pt-[var(--header-h)]">
                <EmptyState
                    title="Connectez-vous pour commander"
                    message="Votre panier vous attend, il suffit de vous identifier."
                    action={
                        <Link
                            href="/login"
                            className="inline-flex rounded-pill bg-brand-500 px-7 py-3 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600"
                        >
                            Se connecter
                        </Link>
                    }
                />
            </div>
        );
    }

    return (
        <div className="min-h-svh bg-surface-sunken pt-[var(--header-h)]">
            {restaurant ? <BannerResto restaurant={restaurant} /> : null}

            <section className="mx-auto max-w-[1300px] px-4 py-8 sm:px-5">
                <h1 className="mb-6 text-display font-extrabold text-secondaryColor">
                    Votre commande
                </h1>

                {/*
                  * Le panier passe au-dessus des informations sur mobile : c'est ce
                  * qu'on vient verifier en premier. Sur grand ecran il reprend sa
                  * place a droite.
                  */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="order-2 lg:order-1 lg:col-span-2">
                        <MainContent />
                    </div>

                    <div className="order-1 lg:order-2">
                        <Order ordering={ordering ?? []} removeProduct={handleRemoveProduct} />
                    </div>
                </div>
            </section>

            <BeforeFooterContent infoResto={restaurant ?? []} />
        </div>
    );
}
