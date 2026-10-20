"use client";

import {Suspense, useEffect, useRef, useState} from "react";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import CarteAuth from "@/components/auth/CarteAuth";
import ChampTexte from "@/components/auth/ChampTexte";
import Turnstile, {DEFI_ACTIF} from "@/components/auth/Turnstile";
import Spinner from "@/components/Loader/Spinner";
import Notify from "@/components/toastify/Notify";
import {FetchData} from "@/helpers/FetchData";
import {Route} from "@/helpers/Route";

/** Le code fait quatre chiffres : c'est ce que génère le serveur. */
const LONGUEUR_CODE = 4;

/** Une minute entre deux demandes : chaque envoi coûte un courriel. */
const ATTENTE_RENVOI = 60;

function Confirmation() {
    const parametres = useSearchParams();
    const router = useRouter();

    const [email, setEmail] = useState(parametres.get("email") ?? "");
    const [code, setCode] = useState("");
    const [envoi, setEnvoi] = useState(false);
    const [renvoi, setRenvoi] = useState(false);
    const [attente, setAttente] = useState(0);
    const [jetonAntiRobot, setJetonAntiRobot] = useState(null);
    const [reinitDefi, setReinitDefi] = useState(0);

    // Le compte à rebours du renvoi. Sans lui, le bouton invite à cliquer
    // dix fois et le serveur régénère un code à chaque fois — celui que le
    // client est en train de lire devient faux sous ses yeux.
    const minuterie = useRef(null);

    useEffect(() => {
        if (attente <= 0) return undefined;

        minuterie.current = setTimeout(() => setAttente((v) => v - 1), 1000);

        return () => clearTimeout(minuterie.current);
    }, [attente]);

    const confirmer = async (e) => {
        e.preventDefault();
        setEnvoi(true);

        try {
            const reponse = await FetchData.sendData(Route.activation, {email, otp: code});

            if (reponse?.name === "AxiosError") {
                Notify(
                    reponse.response?.data?.message ?? "Ce code n’est pas valide",
                    "error",
                );
                return;
            }

            Notify("Votre adresse est confirmée, connectez-vous", "success");
            router.push("/login");
        } finally {
            setEnvoi(false);
        }
    };

    const renvoyer = async () => {
        if (attente > 0) return;

        setRenvoi(true);

        try {
            const demande = {email};

            // Absent quand le défi n'est pas configuré : le serveur ne le
            // réclame que si sa propre clé est posée.
            if (jetonAntiRobot) demande.turnstile_token = jetonAntiRobot;

            const reponse = await FetchData.sendData(Route.resend_activation, demande);

            if (reponse?.name === "AxiosError") {
                Notify(
                    reponse.response?.data?.message ?? "Impossible d’envoyer le code",
                    "error",
                );

                // Un jeton Cloudflare ne sert qu'une fois : sans ce rappel,
                // le second essai repartirait avec un jeton consommé.
                setReinitDefi((rang) => rang + 1);

                return;
            }

            // Le renvoi a réussi : le jeton est consommé, et le prochain
            // renvoi en demandera un neuf.
            setReinitDefi((rang) => rang + 1);

            /*
             * Le message ne dit pas si l'adresse existe.
             *
             * Le serveur répond la même chose dans les deux cas, exprès :
             * un message différent permettrait de savoir quelles adresses
             * sont inscrites chez nous. L'écran ne doit pas défaire ça.
             */
            Notify("Si cette adresse attend une confirmation, un code vient de partir", "success");
            setAttente(ATTENTE_RENVOI);
        } finally {
            setRenvoi(false);
        }
    };

    return (
        <CarteAuth
            titre="Confirmez votre adresse"
            sousTitre="Nous venons de vous envoyer un code à quatre chiffres. Saisissez-le pour activer votre compte."
            bas={
                <>
                    Vous avez déjà confirmé ?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-brand-600 underline-offset-4 hover:underline"
                    >
                        Connectez-vous
                    </Link>
                </>
            }
        >
            <form className="flex flex-col gap-5" onSubmit={confirmer}>
                {/*
                  * L'adresse reste modifiable.
                  *
                  * Une adresse mal saisie est la première raison de ne pas
                  * recevoir le code. Si elle était figée, le client serait
                  * enfermé dehors avec sa faute de frappe.
                  */}
                <ChampTexte
                    label="Adresse e-mail"
                    type="email"
                    autoComplete="email"
                    placeholder="exemple@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    requis
                    required
                />

                <ChampTexte
                    label="Code reçu par e-mail"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="0000"
                    maxLength={LONGUEUR_CODE}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    aide="Il expire au bout de 30 minutes."
                    requis
                    required
                />

                <button
                    type="submit"
                    disabled={envoi || code.length < LONGUEUR_CODE}
                    className="mt-2 flex w-full items-center justify-center rounded-pill bg-secondaryColor py-3.5 text-body font-semibold text-white transition-opacity duration-150 hover:opacity-90 disabled:opacity-60"
                >
                    {envoi ? <Spinner /> : "Confirmer mon adresse"}
                </button>

                {/*
                  * Le défi protège le RENVOI, pas la confirmation : renvoyer
                  * fabrique un code neuf, et c'est ce que vise une machine.
                  * Le délai de 60 s est posé ici, dans l'écran ; il ne vaut
                  * rien contre un appel direct à la route.
                  */}
                <Turnstile onJeton={setJetonAntiRobot} reinit={reinitDefi} />

                <button
                    type="button"
                    onClick={renvoyer}
                    disabled={
                        renvoi || attente > 0 || !email || (DEFI_ACTIF && !jetonAntiRobot)
                    }
                    className="text-caption font-semibold text-brand-600 underline-offset-4 transition-opacity duration-150 hover:underline disabled:opacity-50 disabled:no-underline"
                >
                    {attente > 0
                        ? `Renvoyer le code dans ${attente} s`
                        : "Je n’ai rien reçu, renvoyer le code"}
                </button>
            </form>
        </CarteAuth>
    );
}

/**
 * La confirmation d'adresse.
 *
 * Elle n'existait que sur le mobile : le site inscrivait puis renvoyait vers
 * la connexion, sans jamais demander le code. Depuis que l'adresse doit être
 * confirmée pour utiliser le compte, c'était un cul-de-sac.
 *
 * `useSearchParams` impose la frontière de Suspense : sans elle, la page
 * entière bascule en rendu dynamique et le build le refuse.
 */
export default function PageConfirmation() {
    return (
        <Suspense fallback={null}>
            <Confirmation />
        </Suspense>
    );
}
