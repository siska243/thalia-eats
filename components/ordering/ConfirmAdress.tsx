"use client";

import React, {useCallback, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {BiEdit} from "react-icons/bi";
import {ActionIcon, Modal, Title} from "rizzui";
import {XMarkIcon} from "@heroicons/react/20/solid";
import ChampTexte from "@/components/auth/ChampTexte";
import Spinner from "@/components/Loader/Spinner";
import useReferentialData from "@/hooks/useQueryTanStack";
import useCart from "@/hooks/useCart";
import {notification} from "@/hooks/useCreateOrdering";
import {Route} from "@/helpers/Route";
import {OrderType} from "@/types/main";

type Commune = {uid: string; slug: string; title: string};

type AdresseLivraison = {
    adresse?: string;
    town?: Commune;
    reference?: string;
    street?: string;
    number_street?: string;
};

/**
 * L'adresse de livraison de la commande.
 *
 * Le formulaire se bloquait. La soumission faisait, dans cet ordre :
 *
 *     setLoading(true)
 *     if (champ vide) { setError(...); return; }
 *     ...
 *     finally { if (close) { ...setLoading(false) } }
 *
 * Un champ vide passait donc par le `return` alors que `loading` etait deja a
 * `true`, et `close` restait `null` : le `finally` ne remettait jamais
 * `loading` a `false`. Le bouton « Confirmer votre adresse » restait desactive
 * pour de bon, et il fallait recharger la page. Pire, `error` etait bien
 * renseigne mais n'etait affiche nulle part : le client voyait un bouton mort,
 * sans un mot d'explication.
 *
 * La validation se fait maintenant avant tout changement d'etat, et le message
 * s'affiche.
 */
const ConfirmAdress = () => {
    const {data} = useReferentialData<{town?: Commune[]}>({
        url: Route.default,
        queryKey: "default",
    });

    const {order} = useSelector(
        (state: {shop: {order: {data: OrderType}}}) => state.shop
    );

    const [town, setTown] = useState("");
    const [street, setStreet] = useState("");
    const [numberStreet, setNumberStreet] = useState("");
    const [reference, setReference] = useState("");
    const [erreur, setErreur] = useState("");
    const [adresseComplete, setAdresseComplete] = useState("");
    const [modalState, setModalState] = useState(false);
    const [loading, setLoading] = useState(false);

    const {handleCustomOrder} = useCart();

    const remplirDepuis = useCallback((adresse?: AdresseLivraison) => {
        setTown(adresse?.town?.slug ?? "");
        setStreet(adresse?.street ?? "");
        setReference(adresse?.reference ?? "");
        setNumberStreet(adresse?.number_street ?? "");
        setAdresseComplete(adresse?.adresse ?? "");
    }, []);

    // L'adresse deja choisie est relue au chargement : sans ca, revenir sur la
    // page redemandait une adresse que le client venait de saisir.
    useEffect(() => {
        if (typeof window === "undefined") return;

        const brut = localStorage.getItem("thalia_eat_order_delivery_address");
        if (!brut) return;

        try {
            const adresse = JSON.parse(brut);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            remplirDepuis(adresse);
            handleCustomOrder(adresse.town);
        } catch {
            // Entree illisible — on repart de zero plutot que de bloquer la page.
            localStorage.removeItem("thalia_eat_order_delivery_address");
        }
        // Volontairement au montage seulement : `handleCustomOrder` et
        // `remplirDepuis` sont recrees a chaque rendu, les suivre relancerait
        // le chiffrage de la commande en boucle. Et la lecture du stockage
        // local ne peut pas avoir lieu au premier rendu : le serveur ne la
        // connait pas, le HTML divergerait a l'hydratation.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /*
     * Le chiffrage du serveur fait autorite des qu'il arrive : il remplit les
     * champs du formulaire.
     *
     * Ces champs restent modifiables par le visiteur, donc ce sont bien des
     * etats et non des valeurs derivees — on ne peut pas les calculer au rendu
     * sans lui reprendre sa saisie a chaque reponse du serveur.
     */
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (order?.data?.adresse) remplirDepuis(order.data.adresse);
    }, [order?.data, remplirDepuis]);

    const handlerSendData = (e: React.FormEvent) => {
        e.preventDefault();

        if (!town || !street || !numberStreet || !reference) {
            setErreur("Veuillez remplir tous les champs");
            return;
        }

        setErreur("");
        setLoading(true);

        try {
            const commune = data?.town?.find((item: Commune) => item.slug === town);

            const adresse = {
                adresse: `${street} ${numberStreet} ${commune?.title ?? town}`,
                town: commune,
                reference,
                street,
                number_street: numberStreet,
            };

            setAdresseComplete(adresse.adresse);
            localStorage.setItem(
                "thalia_eat_order_delivery_address",
                JSON.stringify(adresse)
            );

            handleCustomOrder(commune);
            notification("Votre adresse de livraison est enregistrée");
            setModalState(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border-b border-surface-border px-4 py-4 sm:px-5">
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-caption font-bold uppercase tracking-wide text-ink-muted">
                    Adresse de livraison
                </h3>

                <button
                    type="button"
                    onClick={() => setModalState(true)}
                    aria-label="Modifier l'adresse de livraison"
                    className="p-1 text-xl text-brand-600 transition-colors duration-150 hover:text-brand-700"
                >
                    <BiEdit />
                </button>
            </div>

            <p
                className={`mt-2 text-caption ${
                    adresseComplete ? "text-ink" : "text-ink-subtle"
                }`}
            >
                {adresseComplete || "Aucune adresse choisie"}
            </p>

            <Modal
                isOpen={modalState}
                onClose={() => setModalState(false)}
                className="z-[9999]"
            >
                <div className="bg-surface px-6 pb-8 pt-6 sm:px-7">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <Title as="h3" className="!text-title !font-bold">
                            Adresse de livraison
                        </Title>

                        <ActionIcon size="sm" variant="text" onClick={() => setModalState(false)}>
                            <XMarkIcon className="h-auto w-6" strokeWidth={1.8} />
                        </ActionIcon>
                    </div>

                    <form className="flex flex-col gap-5" onSubmit={handlerSendData}>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="flex flex-col">
                                <label
                                    htmlFor="commune-livraison"
                                    className="mb-2 text-caption font-semibold text-ink"
                                >
                                    Commune
                                </label>
                                <select
                                    id="commune-livraison"
                                    required
                                    value={town}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTown(e.target.value)}
                                    className="w-full rounded-control border border-surface-border bg-surface px-4 py-3 text-body text-ink outline-none transition-colors duration-150 focus:border-brand-500"
                                >
                                    <option value="">Sélectionner la commune</option>
                                    {data?.town?.map((commune) => (
                                        <option value={commune.slug} key={commune.uid}>
                                            {commune.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <ChampTexte
                                label="Avenue"
                                placeholder="Nom de votre avenue"
                                value={street}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStreet(e.target.value)}
                                required
                            />

                            <ChampTexte
                                label="Numéro"
                                placeholder="Numéro de l'avenue"
                                value={numberStreet}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumberStreet(e.target.value)}
                                required
                            />

                            <ChampTexte
                                label="Référence"
                                placeholder="Un repère proche de chez vous"
                                aide="Ce qui aide le livreur à vous trouver"
                                value={reference}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReference(e.target.value)}
                                required
                            />
                        </div>

                        {erreur ? (
                            <p
                                role="alert"
                                className="rounded-control bg-danger-surface px-4 py-3 text-caption font-semibold text-danger"
                            >
                                {erreur}
                            </p>
                        ) : null}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center rounded-pill bg-secondaryColor py-3.5 text-body font-semibold text-white transition-opacity duration-150 hover:opacity-90 disabled:opacity-60"
                        >
                            {loading ? <Spinner /> : "Confirmer cette adresse"}
                        </button>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default ConfirmAdress;
