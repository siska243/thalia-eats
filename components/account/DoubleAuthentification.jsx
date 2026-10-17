"use client";

import Image from "next/image";
import {useCallback, useEffect, useState} from "react";
import {FaMobileScreen, FaRegCopy, FaEnvelope, FaShieldHalved} from "react-icons/fa6";
import {IoCheckmarkCircle} from "react-icons/io5";

import ChampTexte from "@/components/auth/ChampTexte";
import Notify from "../toastify/Notify";
import Spinner from "../Loader/Spinner";
import {Route} from "@/helpers/Route";
import {FetchData} from "@/helpers/FetchData";

/**
 * La double authentification, réglée par le client lui-même.
 *
 * Deux facteurs au choix, et aucun imposé : une application
 * d'authentification, ou un code par e-mail. Tant que rien n'est activé, la
 * connexion ne change pas d'un écran.
 *
 * Mêmes réglages que le back-office et que l'application : ce qu'on active
 * ici se voit partout, parce que ce sont les mêmes colonnes.
 */
export default function DoubleAuthentification() {
    const [etat, setEtat] = useState(null);
    const [chargement, setChargement] = useState(true);
    const [envoi, setEnvoi] = useState(false);

    const [preparation, setPreparation] = useState(null);
    const [code, setCode] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [codesDeSecours, setCodesDeSecours] = useState(null);

    const charger = useCallback(async () => {
        const reponse = await FetchData.getData(Route.double_authentification);

        if (reponse?.name === "AxiosError") return null;

        return reponse?.data ?? reponse;
    }, []);

    useEffect(() => {
        let vivant = true;

        charger().then((donnees) => {
            if (!vivant) return;

            setEtat(donnees);
            setChargement(false);
        });

        return () => {
            vivant = false;
        };
    }, [charger]);

    const rafraichir = async () => setEtat(await charger());

    const commencer = async () => {
        setEnvoi(true);

        try {
            const reponse = await FetchData.sendData(Route.double_auth_preparer, {});

            if (reponse?.name === "AxiosError") {
                Notify(reponse.response?.data?.message ?? "Préparation impossible", "error");
                return;
            }

            setPreparation(reponse?.data ?? reponse);
        } finally {
            setEnvoi(false);
        }
    };

    const confirmer = async (e) => {
        e.preventDefault();
        setEnvoi(true);

        try {
            const reponse = await FetchData.sendData(Route.double_auth_activer, {
                secret: preparation.secret,
                code,
            });

            if (reponse?.name === "AxiosError") {
                Notify(reponse.response?.data?.message ?? "Ce code ne correspond pas", "error");
                return;
            }

            /*
             * Les codes de secours s'affichent UNE SEULE FOIS : ils sont
             * chiffrés en base et aucune route ne les relit.
             */
            setCodesDeSecours((reponse?.data ?? reponse).codes_de_secours);
            setPreparation(null);
            setCode("");
            await rafraichir();
        } finally {
            setEnvoi(false);
        }
    };

    const desactiver = async (e) => {
        e.preventDefault();
        setEnvoi(true);

        try {
            const reponse = await FetchData.sendData(Route.double_auth_desactiver, {
                password: motDePasse,
            });

            if (reponse?.name === "AxiosError") {
                Notify(reponse.response?.data?.message ?? "Désactivation impossible", "error");
                return;
            }

            setMotDePasse("");
            Notify("Double authentification désactivée", "success");
            await rafraichir();
        } finally {
            setEnvoi(false);
        }
    };

    const basculerCourriel = async (actif) => {
        setEnvoi(true);

        try {
            const reponse = await FetchData.sendData(Route.double_auth_courriel, {
                actif,
                // Éteindre exige le mot de passe : retirer une protection est
                // l'action risquée, pas l'ajouter.
                ...(actif ? {} : {password: motDePasse}),
            });

            if (reponse?.name === "AxiosError") {
                Notify(reponse.response?.data?.message ?? "Modification impossible", "error");
                return;
            }

            setMotDePasse("");
            await rafraichir();
        } finally {
            setEnvoi(false);
        }
    };

    if (chargement) {
        return (
            <section className="rounded-card bg-surface p-5 shadow-card sm:p-6">
                <div className="h-24 animate-pulse rounded-control bg-surface-sunken" />
            </section>
        );
    }

    const applicationActive = etat?.application?.active ?? false;
    const courrielActif = etat?.courriel?.active ?? false;

    return (
        <section className="rounded-card bg-surface p-5 shadow-card sm:p-6">
            <h2 className="mb-1 flex items-center gap-2 text-title font-bold text-secondaryColor">
                <FaShieldHalved aria-hidden /> Double authentification
            </h2>
            <p className="mb-5 text-caption text-ink-muted">
                Votre mot de passe ne suffira plus : il faudra aussi un code. Si quelqu’un
                l’apprend, il n’entrera pas pour autant.
            </p>

            {codesDeSecours ? (
                <div className="mb-5 rounded-control border border-brand-500 bg-surface-sunken p-4">
                    <p className="mb-2 text-body font-bold text-secondaryColor">
                        Vos codes de secours
                    </p>
                    <p className="mb-3 text-caption text-ink-muted">
                        Notez-les maintenant : ils ne seront plus jamais affichés. Chacun ne
                        sert qu’une fois, et c’est ce qui vous sauvera si vous perdez votre
                        téléphone.
                    </p>

                    <ul className="mb-3 grid gap-1 sm:grid-cols-2">
                        {codesDeSecours.map((unCode) => (
                            <li key={unCode} className="font-mono text-caption text-ink">
                                {unCode}
                            </li>
                        ))}
                    </ul>

                    <button
                        type="button"
                        onClick={() => navigator.clipboard?.writeText(codesDeSecours.join("\n"))}
                        className="inline-flex items-center gap-2 text-caption font-semibold text-brand-600 hover:underline"
                    >
                        <FaRegCopy aria-hidden /> Copier les codes
                    </button>
                </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
                {/* --- L'application d'authentification ------------------- */}
                <div className="rounded-control border border-surface-border p-4">
                    <p className="mb-1 flex items-center gap-2 text-body font-semibold text-ink">
                        <FaMobileScreen aria-hidden /> Application d’authentification
                        {applicationActive ? (
                            <IoCheckmarkCircle className="text-success" aria-label="Activée" />
                        ) : null}
                    </p>
                    <p className="mb-4 text-caption text-ink-muted">
                        Google Authenticator, Authy ou équivalent. Le code s’affiche sans
                        réseau — c’est le plus solide des deux.
                    </p>

                    {applicationActive ? (
                        <form className="flex flex-col gap-3" onSubmit={desactiver}>
                            <p className="text-caption text-ink-muted">
                                {etat?.application?.codes_de_secours_restants ?? 0} code(s) de
                                secours restant(s).
                            </p>

                            <ChampTexte
                                label="Mot de passe"
                                motDePasse
                                placeholder="Votre mot de passe actuel"
                                value={motDePasse}
                                onChange={(e) => setMotDePasse(e.target.value)}
                                required
                            />

                            <button
                                type="submit"
                                disabled={envoi || !motDePasse}
                                className="rounded-pill border border-danger px-5 py-2.5 text-caption font-semibold text-danger transition-opacity duration-150 hover:opacity-80 disabled:opacity-50"
                            >
                                {envoi ? <Spinner /> : "Désactiver"}
                            </button>
                        </form>
                    ) : preparation ? (
                        <form className="flex flex-col gap-3" onSubmit={confirmer}>
                            {/* Le QR arrive déjà en data-uri du serveur :
                                rien à générer, donc aucune bibliothèque. */}
                            <Image
                                src={preparation.qr}
                                alt="QR code à scanner"
                                width={180}
                                height={180}
                                unoptimized
                                className="self-center"
                            />

                            {/* Tous les écrans ne se scannent pas depuis le
                                même appareil : la clé manuelle est le recours. */}
                            <p className="text-caption text-ink-muted">
                                Impossible de scanner ? Saisissez cette clé :
                            </p>
                            <code className="break-all rounded-control bg-surface-sunken p-2 text-caption text-ink">
                                {preparation.secret}
                            </code>

                            <ChampTexte
                                label="Code affiché par l’application"
                                inputMode="numeric"
                                placeholder="123456"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                            />

                            <button
                                type="submit"
                                disabled={envoi || !code}
                                className="rounded-pill bg-secondaryColor px-5 py-2.5 text-caption font-semibold text-white transition-opacity duration-150 hover:opacity-90 disabled:opacity-60"
                            >
                                {envoi ? <Spinner /> : "Activer"}
                            </button>
                        </form>
                    ) : (
                        <button
                            type="button"
                            onClick={commencer}
                            disabled={envoi}
                            className="rounded-pill bg-secondaryColor px-5 py-2.5 text-caption font-semibold text-white transition-opacity duration-150 hover:opacity-90 disabled:opacity-60"
                        >
                            {envoi ? <Spinner /> : "Configurer"}
                        </button>
                    )}
                </div>

                {/* --- Le code par e-mail --------------------------------- */}
                <div className="rounded-control border border-surface-border p-4">
                    <p className="mb-1 flex items-center gap-2 text-body font-semibold text-ink">
                        <FaEnvelope aria-hidden /> Code par e-mail
                        {courrielActif ? (
                            <IoCheckmarkCircle className="text-success" aria-label="Activé" />
                        ) : null}
                    </p>
                    <p className="mb-4 text-caption text-ink-muted">
                        Un code à six chiffres envoyé à votre adresse, à chaque connexion.
                        Plus simple, mais il dépend du réseau.
                    </p>

                    {courrielActif ? (
                        <div className="flex flex-col gap-3">
                            <ChampTexte
                                label="Mot de passe"
                                motDePasse
                                placeholder="Votre mot de passe actuel"
                                value={motDePasse}
                                onChange={(e) => setMotDePasse(e.target.value)}
                            />

                            <button
                                type="button"
                                onClick={() => basculerCourriel(false)}
                                disabled={envoi || !motDePasse}
                                className="rounded-pill border border-danger px-5 py-2.5 text-caption font-semibold text-danger transition-opacity duration-150 hover:opacity-80 disabled:opacity-50"
                            >
                                {envoi ? <Spinner /> : "Désactiver"}
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => basculerCourriel(true)}
                            disabled={envoi}
                            className="rounded-pill bg-secondaryColor px-5 py-2.5 text-caption font-semibold text-white transition-opacity duration-150 hover:opacity-90 disabled:opacity-60"
                        >
                            {envoi ? <Spinner /> : "Activer"}
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
