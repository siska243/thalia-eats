"use client";

import {useCallback, useEffect, useState} from "react";
import {FaRegTrashCan, FaRegCopy, FaPlus, FaWandMagicSparkles} from "react-icons/fa6";
import {IoCheckmarkCircle, IoCloseCircle} from "react-icons/io5";

import ChampTexte from "@/components/auth/ChampTexte";
import Notify from "../toastify/Notify";
import Spinner from "../Loader/Spinner";
import {Route} from "@/helpers/Route";
import {FetchData} from "@/helpers/FetchData";

/**
 * Ce qu'un assistant peut faire, et ce qu'il ne pourra jamais faire.
 *
 * Ces listes reprennent TokenAbility::agent() cote serveur, et sont les memes
 * que l'ecran mobile : confier un jeton a un service tiers merite qu'on dise
 * exactement ce qu'on lui donne — surtout ce qu'on ne lui donne pas. Deux
 * promesses differentes selon l'ecran seraient pires que pas de promesse.
 */
const AUTORISE = [
    "Chercher des plats et des restaurants",
    "Calculer le prix d'une commande, livraison comprise",
    "Préparer une pré-commande",
    "Suivre l'état de vos commandes",
];

const JAMAIS = [
    "Déclencher un paiement",
    "Annuler ou modifier une commande en cours",
    "Changer une adresse de livraison",
    "Créer un autre accès",
];

/** Une date lisible, ou un tiret quand le serveur n'en donne pas. */
function dateLisible(valeur) {
    if (!valeur) return "—";

    const date = new Date(valeur);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export default function AssistantsConnectes() {
    const [connexions, setConnexions] = useState([]);
    const [chargement, setChargement] = useState(true);
    const [creation, setCreation] = useState(false);
    const [nom, setNom] = useState("");
    const [envoi, setEnvoi] = useState(false);
    const [revocation, setRevocation] = useState(null);

    // Le jeton en clair n'existe qu'ici, en memoire, et une seule fois : le
    // serveur ne le stocke pas en clair et ne pourra jamais le reafficher.
    const [jetonEmis, setJetonEmis] = useState(null);

    const charger = useCallback(async () => {
        const response = await FetchData.getData(Route.assistants);

        if (response?.name === "AxiosError") {
            Notify(
                "Connexions indisponibles",
                "error",
                response.response?.data?.message ?? "Réessayez dans un instant."
            );
            return;
        }

        setConnexions(response?.data ?? []);
    }, []);

    // Le chargement initial est retire de charger() pour deux raisons : l'etat
    // part deja a true, et poser un setState synchrone dans le corps d'un effet
    // declenche une cascade de rendus que React deconseille. Le drapeau
    // « vivant » evite d'ecrire dans un composant demonte.
    useEffect(() => {
        let vivant = true;

        (async () => {
            await charger();

            if (vivant) setChargement(false);
        })();

        return () => {
            vivant = false;
        };
    }, [charger]);

    const creer = async (e) => {
        e.preventDefault();

        if (!nom.trim()) {
            Notify(
                "Donnez un nom à cette connexion",
                "error",
                "Par exemple « Claude », pour la reconnaître et pouvoir la révoquer."
            );
            return;
        }

        setEnvoi(true);

        try {
            const response = await FetchData.sendData(Route.assistants, {name: nom.trim()});

            if (response?.name === "AxiosError") {
                Notify(
                    "Connexion impossible",
                    "error",
                    response.response?.data?.message ?? "Réessayez dans un instant."
                );
                return;
            }

            setJetonEmis(response?.data ?? null);
            setCreation(false);
            setNom("");
            charger();
        } finally {
            setEnvoi(false);
        }
    };

    const revoquer = async (connexion) => {
        const confirme = window.confirm(
            `« ${connexion.name} » perdra immédiatement l'accès à votre compte.`
        );

        if (!confirme) return;

        setRevocation(connexion.uid);

        try {
            const response = await FetchData.deleteData(Route.assistant_delete(connexion.uid));

            if (response?.name === "AxiosError") {
                Notify(
                    "Révocation impossible",
                    "error",
                    response.response?.data?.message ?? "Réessayez dans un instant."
                );
                return;
            }

            Notify("Connexion révoquée", "success", `« ${connexion.name} » n'a plus accès.`);
            charger();
        } finally {
            setRevocation(null);
        }
    };

    const copier = async (jeton) => {
        try {
            await navigator.clipboard.writeText(jeton);
            Notify("Jeton copié", "success");
        } catch {
            // Le presse-papiers est refuse hors HTTPS et dans certains
            // navigateurs : le jeton reste selectionnable a la main, on ne
            // laisse pas le client croire que la copie a eu lieu.
            Notify(
                "Copie impossible",
                "error",
                "Sélectionnez le jeton et copiez-le à la main."
            );
        }
    };

    return (
        <section className="rounded-card bg-surface p-5 shadow-card sm:p-6">
            <h2 className="mb-1 text-title font-bold text-secondaryColor">
                Assistants connectés
            </h2>
            <p className="mb-5 text-caption text-ink-muted">
                Les assistants comme Claude ou ChatGPT qui peuvent préparer une commande à
                votre place.
            </p>

            {jetonEmis ? (
                <div className="mb-5 rounded-card border border-primaryColor/30 bg-primaryColor/5 p-4">
                    <p className="text-body font-bold text-secondaryColor">
                        Copiez ce jeton maintenant
                    </p>
                    <p className="mt-1 text-caption text-ink-muted">
                        Il ne sera plus jamais affiché. Si vous le perdez, révoquez cette
                        connexion et créez-en une autre.
                    </p>

                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                        <code className="flex-1 select-all break-all rounded-card bg-surface-sunken px-3 py-2 text-caption text-ink">
                            {jetonEmis.token}
                        </code>

                        <button
                            type="button"
                            onClick={() => copier(jetonEmis.token)}
                            className="flex items-center justify-center gap-2 rounded-card bg-primaryColor px-4 py-2 text-caption font-bold text-white"
                        >
                            <FaRegCopy aria-hidden="true" />
                            Copier
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => setJetonEmis(null)}
                        className="mt-3 text-caption font-bold text-ink-muted underline"
                    >
                        J&apos;ai copié le jeton
                    </button>
                </div>
            ) : null}

            {creation ? (
                <form className="mb-5 flex flex-col gap-4" onSubmit={creer}>
                    <ChampTexte
                        label="Nom de la connexion"
                        aide="Pour la reconnaître dans la liste et pouvoir la révoquer."
                        placeholder="Claude"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        autoFocus
                    />

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setCreation(false);
                                setNom("");
                            }}
                            className="rounded-card bg-surface-sunken px-4 py-2 text-caption font-bold text-ink"
                        >
                            Annuler
                        </button>

                        <button
                            type="submit"
                            disabled={envoi}
                            className="flex-1 rounded-card bg-primaryColor px-4 py-2 text-caption font-bold text-white disabled:opacity-60"
                        >
                            {envoi ? "Création…" : "Créer l'accès"}
                        </button>
                    </div>
                </form>
            ) : (
                <button
                    type="button"
                    onClick={() => setCreation(true)}
                    className="mb-5 flex w-full items-center justify-center gap-2 rounded-card bg-primaryColor px-4 py-2.5 text-caption font-bold text-white"
                >
                    <FaPlus aria-hidden="true" />
                    Connecter un assistant
                </button>
            )}

            {chargement ? (
                <div className="py-6">
                    <Spinner />
                </div>
            ) : connexions.length === 0 ? (
                <p className="rounded-card bg-surface-sunken px-4 py-6 text-center text-caption text-ink-muted">
                    Aucun assistant connecté pour le moment.
                </p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {connexions.map((connexion) => (
                        <li
                            key={connexion.uid}
                            className="flex items-start justify-between gap-3 rounded-card bg-surface-sunken px-4 py-3"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-body font-bold text-ink">
                                    {connexion.name}
                                </p>
                                <p className="mt-0.5 text-caption text-ink-muted">
                                    Dernière utilisation : {dateLisible(connexion.last_used_at)}
                                </p>
                                <p className="text-caption text-ink-muted">
                                    Expire le {dateLisible(connexion.expires_at)}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => revoquer(connexion)}
                                disabled={revocation === connexion.uid}
                                aria-label={`Révoquer ${connexion.name}`}
                                className="flex shrink-0 items-center gap-2 rounded-card px-3 py-2 text-caption font-bold text-red-600 hover:bg-red-50 disabled:opacity-60"
                            >
                                <FaRegTrashCan aria-hidden="true" />
                                {revocation === connexion.uid ? "…" : "Révoquer"}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <div className="mt-6 rounded-card bg-surface-sunken p-4">
                <p className="mb-3 flex items-center gap-2 text-body font-bold text-ink">
                    <FaWandMagicSparkles className="text-primaryColor" aria-hidden="true" />
                    Ce qu&apos;un assistant peut faire
                </p>

                <ul className="flex flex-col gap-1.5">
                    {AUTORISE.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-caption text-ink">
                            <IoCheckmarkCircle
                                className="mt-0.5 shrink-0 text-green-600"
                                aria-hidden="true"
                            />
                            {item}
                        </li>
                    ))}
                </ul>

                <p className="mb-2 mt-4 text-body font-bold text-ink">
                    Ce qu&apos;il ne pourra jamais faire
                </p>

                <ul className="flex flex-col gap-1.5">
                    {JAMAIS.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-caption text-ink">
                            <IoCloseCircle
                                className="mt-0.5 shrink-0 text-red-500"
                                aria-hidden="true"
                            />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
