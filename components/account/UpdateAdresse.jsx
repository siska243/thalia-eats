"use client";

import {useState} from "react";
import ChampTexte from "@/components/auth/ChampTexte";
import Notify from "../toastify/Notify";
import Spinner from "../Loader/Spinner";
import useReferentialData from "@/hooks/useQueryTanStack";
import {Route} from "@/helpers/Route";
import {FetchData} from "@/helpers/FetchData";

/**
 * Mise a jour de l'adresse de livraison.
 *
 * L'erreur du serveur etait lue ainsi :
 *
 *     const {response: {data: {message, error}}} = response;
 *     Notify(error, "error");
 *
 * Deux problemes. `message` etait extrait puis jamais utilise, et c'est `error`
 * qui partait dans le toast — souvent absent de la reponse, donc un toast vide.
 * Et sur une panne reseau il n'y a pas de `response.response` : la ligne levait
 * une exception, attrapee par un `catch` vide. L'utilisateur ne voyait alors
 * rien du tout.
 */
export default function UpdateAdresse() {
    const {data} = useReferentialData({url: Route.default, queryKey: "dafault"});

    const [town, setTown] = useState("");
    const [street, setStreet] = useState("");
    const [numberStreet, setNumberStreet] = useState("");
    const [reference, setReference] = useState("");
    const [loading, setLoading] = useState(false);

    const handlerSendData = async (e) => {
        e.preventDefault();

        if (!town || !street || !numberStreet || !reference) {
            Notify("Veuillez remplir tous les champs", "error");
            return;
        }

        setLoading(true);

        try {
            const response = await FetchData.sendData(Route.update_adresse, {
                town,
                street,
                number_street: numberStreet,
                principal_adresse: reference,
            });

            if (response?.name === "AxiosError") {
                const donnees = response.response?.data;
                Notify(
                    donnees?.message ?? donnees?.error ?? "Mise à jour impossible",
                    "error"
                );
                return;
            }

            Notify("Adresse mise à jour", "success");
            setTown("");
            setStreet("");
            setNumberStreet("");
            setReference("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="rounded-card bg-surface p-5 shadow-card sm:p-6">
            <h2 className="mb-5 text-title font-bold text-secondaryColor">
                Adresse de livraison
            </h2>

            <form className="flex flex-col gap-5" onSubmit={handlerSendData}>
                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col">
                        <label
                            htmlFor="commune"
                            className="mb-2 text-caption font-semibold text-ink"
                        >
                            Commune
                        </label>
                        <select
                            id="commune"
                            required
                            value={town}
                            onChange={(e) => setTown(e.target.value)}
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
                        onChange={(e) => setStreet(e.target.value)}
                        required
                    />

                    <ChampTexte
                        label="Numéro"
                        placeholder="Numéro de l'avenue"
                        value={numberStreet}
                        onChange={(e) => setNumberStreet(e.target.value)}
                        required
                    />

                    <ChampTexte
                        label="Référence"
                        placeholder="Un repère proche de chez vous"
                        aide="Ce qui aide le livreur à vous trouver"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-1 flex w-full items-center justify-center rounded-pill bg-secondaryColor py-3.5 text-body font-semibold text-white transition-opacity duration-150 hover:opacity-90 disabled:opacity-60"
                >
                    {loading ? <Spinner /> : "Enregistrer l'adresse"}
                </button>
            </form>
        </section>
    );
}
