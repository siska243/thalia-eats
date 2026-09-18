"use client";

import {useState} from "react";
import Link from "next/link";
import CarteCommande from "./CarteCommande";
import EmptyState from "@/components/ui/EmptyState";
import TrackingPage from "@/components/ordering/Map";
import useReferentialData from "@/hooks/useQueryTanStack";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import {Route} from "@/helpers/Route";
import {listeDe} from "@/helpers/reponseApi";
import {smoothScroll} from "@/helpers/calculePrice";

/**
 * Les commandes du client : en cours et terminees, au meme endroit.
 *
 * Le web les separait en deux pages, `/tracking` et `/historique`, alors que
 * l'application mobile n'a qu'un ecran « Commandes » a deux onglets. Le client
 * qui vient de payer cherche sa commande ; qu'elle soit « en cours » ou
 * « terminee » est un detail de statut, pas une raison de changer de page — et
 * une commande passe d'un onglet a l'autre toute seule.
 *
 * Les deux anciennes adresses continuent de fonctionner : elles ouvrent cet
 * ecran sur le bon onglet. Les liens deja partages, les favoris et les icones
 * de la barre du haut restent valides.
 */
export default function PageCommandes({ongletInitial = "en-cours"}) {
    const [onglet, setOnglet] = useState(ongletInitial);
    const [commandeSuivie, setCommandeSuivie] = useState(null);

    const {user} = useGetCurrentUser();

    const enCours = useReferentialData({
        url: Route.tracking_commande,
        queryKey: "commandes-en-cours",
    });

    const terminees = useReferentialData({
        url: Route.historique_commande,
        queryKey: "commandes-terminees",
    });

    const listeEnCours = listeDe(enCours.data);
    const listeTerminees = listeDe(terminees.data);

    const courant = onglet === "en-cours" ? enCours : terminees;
    const commandes = onglet === "en-cours" ? listeEnCours : listeTerminees;

    const rafraichir = async () => {
        await Promise.allSettled([enCours.refetch(), terminees.refetch()]);
    };

    const suivre = (commande) => {
        setCommandeSuivie(commande);
        smoothScroll("section-carte");
    };

    const onglets = [
        {cle: "en-cours", libelle: "En cours", nombre: listeEnCours.length},
        {cle: "terminees", libelle: "Terminées", nombre: listeTerminees.length},
    ];

    if (!user) {
        return (
            <div className="min-h-svh bg-surface-sunken pt-[var(--header-h)]">
                <EmptyState
                    title="Connectez-vous pour voir vos commandes"
                    message="Vos commandes en cours et passées vous attendent dans votre compte."
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
            <div className="mx-auto max-w-[1400px] px-4 pb-16 pt-6 sm:px-5">
                <header className="mb-5">
                    <p className="text-caption text-ink-muted">Votre historique</p>
                    <h1 className="text-display font-extrabold text-secondaryColor">
                        Commandes
                    </h1>
                </header>

                <div
                    role="tablist"
                    className="mb-6 flex rounded-control bg-surface-sunken p-1 ring-1 ring-surface-border sm:max-w-md"
                >
                    {onglets.map((item) => {
                        const actif = onglet === item.cle;

                        return (
                            <button
                                key={item.cle}
                                type="button"
                                role="tab"
                                aria-selected={actif}
                                onClick={() => setOnglet(item.cle)}
                                className={`flex flex-1 items-center justify-center gap-1.5 rounded-control py-2.5 text-body font-bold transition-colors duration-150 ${
                                    actif
                                        ? "bg-surface text-ink shadow-card"
                                        : "text-ink-muted hover:text-ink"
                                }`}
                            >
                                {item.libelle}

                                {item.nombre ? (
                                    <span className="min-w-5 rounded-pill bg-brand-500 px-1.5 text-caption font-bold text-ink-inverse">
                                        {item.nombre}
                                    </span>
                                ) : null}
                            </button>
                        );
                    })}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="flex flex-col gap-4">
                        {courant.isLoading && commandes.length === 0 ? (
                            Array.from({length: 3}).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-56 animate-pulse rounded-card bg-surface"
                                />
                            ))
                        ) : commandes.length ? (
                            commandes.map((commande) => (
                                <CarteCommande
                                    key={commande.uid ?? commande.reference}
                                    commande={commande}
                                    // Une commande terminee ne se paie ni ne s'annule.
                                    actionnable={onglet === "en-cours"}
                                    onChange={rafraichir}
                                    onSuivre={suivre}
                                />
                            ))
                        ) : onglet === "en-cours" ? (
                            <EmptyState
                                title="Aucune commande en cours"
                                message="Vos commandes apparaîtront ici dès que vous en passerez une."
                                action={
                                    <Link
                                        href="/restaurant"
                                        className="inline-flex rounded-pill bg-brand-500 px-7 py-3 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600"
                                    >
                                        Découvrir les restaurants
                                    </Link>
                                }
                            />
                        ) : (
                            <EmptyState
                                title="Aucune commande terminée"
                                message="Votre historique se remplira au fil de vos commandes."
                            />
                        )}
                    </div>

                    {/*
                      * La carte ne sert qu'aux commandes en cours : suivre un
                      * livreur sur une commande livree il y a trois semaines n'a
                      * pas de sens.
                      */}
                    {onglet === "en-cours" ? (
                        <div
                            id="section-carte"
                            className="lg:sticky lg:top-[calc(var(--header-h)+16px)] lg:self-start"
                        >
                            <div className="overflow-hidden rounded-card bg-surface shadow-card">
                                <TrackingPage currentOrder={commandeSuivie} />
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
