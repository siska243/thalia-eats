"use client";

import {useState} from "react";
import {FaTriangleExclamation} from "react-icons/fa6";

import ChampTexte from "@/components/auth/ChampTexte";
import Notify from "@/components/toastify/Notify";
import Spinner from "@/components/Loader/Spinner";
import {FetchData} from "@/helpers/FetchData";
import {Route} from "@/helpers/Route";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import {removeToken} from "@/server/manageToken";

/**
 * La suppression du compte par son titulaire.
 *
 * Exigée par Google Play de toute application qui permet de créer un compte.
 * La page publique `/suppression-compte` explique la même chose à qui n'est
 * pas connecté ; ici, c'est le bouton qui agit.
 *
 * Deux gardes avant d'appeler le serveur : le dépliant, puis le mot de
 * passe. Un seul clic ne doit pas pouvoir effacer un compte.
 *
 * Le mot de passe n'est pas demandé aux comptes Google : ils n'en ont jamais
 * choisi, le serveur ne l'exige pas d'eux non plus. L'exiger ici leur
 * interdirait de partir.
 *
 * Le serveur répond 201 et non 200 : toutes les réponses de succès passent
 * par `ApiResponse::SUCCESS_DATA`. On teste donc l'absence d'erreur, comme
 * partout ailleurs — `FetchData` RETOURNE l'erreur axios au lieu de la
 * lever.
 */
export default function SupprimerMonCompte() {
    const {user} = useGetCurrentUser();
    const [ouvert, setOuvert] = useState(false);
    const [motDePasse, setMotDePasse] = useState("");
    const [envoi, setEnvoi] = useState(false);

    const compteGoogle = Boolean(user?.compte_google);

    const supprimer = async () => {
        if (!compteGoogle && motDePasse.trim() === "") {
            Notify("Votre mot de passe est requis pour confirmer.", "error");

            return;
        }

        setEnvoi(true);

        const reponse = await FetchData.deleteData(
            Route.me,
            compteGoogle ? {} : {password: motDePasse}
        );

        if (reponse?.name === "AxiosError") {
            setEnvoi(false);
            Notify(
                reponse?.response?.data?.message ?? "La suppression n'a pas abouti.",
                "error"
            );

            return;
        }

        await removeToken();

        /*
         * Rechargement complet, pour la meme raison qu'a la deconnexion : le
         * compte vit aussi en memoire du navigateur, cache TanStack Query et
         * magasin Redux. Une navigation cliente les laisserait en place, et
         * l'en-tete continuerait d'afficher un compte qui n'existe plus.
         */
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/";
    };

    return (
        <section className="rounded-card border border-red-200 bg-surface p-5 shadow-card">
            <header className="flex items-start gap-3">
                <FaTriangleExclamation className="mt-1 shrink-0 text-red-600" />
                <div>
                    <h2 className="text-title font-bold text-secondaryColor">
                        Supprimer mon compte
                    </h2>
                    <p className="mt-1 text-caption text-ink-muted">
                        Vos données personnelles sont effacées et vous êtes déconnecté de tous vos
                        appareils. Vos commandes passées sont conservées pour notre comptabilité,
                        détachées de votre identité. C’est définitif.
                    </p>
                </div>
            </header>

            {!ouvert ? (
                <button
                    type="button"
                    onClick={() => setOuvert(true)}
                    className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-red-700 transition-colors hover:bg-red-50"
                >
                    Supprimer mon compte
                </button>
            ) : (
                <div className="mt-4 flex flex-col gap-3">
                    {!compteGoogle && (
                        <ChampTexte
                            type="password"
                            motDePasse
                            requis
                            label="Votre mot de passe"
                            value={motDePasse}
                            onChange={(e) => setMotDePasse(e.target.value)}
                            placeholder="Mot de passe"
                        />
                    )}

                    <p className="text-caption text-ink-muted">
                        La suppression est refusée tant qu’une commande ou une location est en
                        cours, ou reste à régler.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            disabled={envoi}
                            onClick={supprimer}
                            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-60"
                        >
                            {envoi && <Spinner />}
                            Oui, supprimer définitivement
                        </button>

                        <button
                            type="button"
                            disabled={envoi}
                            onClick={() => {
                                setOuvert(false);
                                setMotDePasse("");
                            }}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-ink-muted transition-colors hover:bg-gray-50"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
