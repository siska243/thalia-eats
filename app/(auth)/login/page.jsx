"use client";

import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import CarteAuth from "@/components/auth/CarteAuth";
import ChampTexte from "@/components/auth/ChampTexte";
import Turnstile, {DEFI_ACTIF} from "@/components/auth/Turnstile";
import Spinner from "@/components/Loader/Spinner";
import Notify from "@/components/toastify/Notify";
import {FetchData} from "@/helpers/FetchData";
import {Route} from "@/helpers/Route";
import {setToken} from "@/server/manageToken";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import {fetchAccountData} from "@/store/reducers/account";

/**
 * Connexion.
 *
 * Le champ mot de passe n'avait pas de `value` : il etait non controle, donc
 * le vider par le code — apres un echec, par exemple — ne faisait rien a
 * l'ecran.
 *
 * L'erreur etait aussi lue par destructuration profonde
 * (`response.response.data.message`) puis jetee : sur une panne reseau il n'y
 * a pas de `response.response`, et la ligne levait une seconde exception a la
 * place du message. Le message du serveur est desormais affiche quand il
 * existe.
 */
export default function PageConnexion() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    /*
     * LE SECOND FACTEUR SE SAISIT ICI, pas sur une page a part.
     *
     * Toute la redirection — y compris le `?retour=` qui ramene Thalia Trans
     * a sa voiture deja choisie — vit dans cette page. Une seconde page
     * aurait voulu dire la recopier, et un client aurait fini sur l'accueil
     * apres avoir rempli tout son parcours.
     */
    const [jetonAntiRobot, setJetonAntiRobot] = useState(null);
    const [reinitDefi, setReinitDefi] = useState(0);
    const [defi, setDefi] = useState(null);
    const [code, setCode] = useState("");

    const {refetch} = useGetCurrentUser();
    const dispatch = useDispatch();
    const router = useRouter();

    const handlerSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const identifiants = {email, password};

            // Absent quand le défi n'est pas configuré : le serveur ne le
            // réclame que si sa propre clé est posée.
            if (jetonAntiRobot) identifiants.turnstile_token = jetonAntiRobot;

            const response = await FetchData.sendData(Route.login, identifiants);

            if (response?.name === "AxiosError") {
                Notify(
                    response.response?.data?.message ?? "Email ou mot de passe incorrect",
                    "error"
                );

                /*
                 * Un jeton Cloudflare ne sert qu'une fois. Sans ce rappel, la
                 * seconde tentative partait avec un jeton déjà consommé et se
                 * faisait refuser pour une raison que le client ne pouvait
                 * pas deviner — sur la page où l'on se trompe le plus.
                 */
                setReinitDefi((rang) => rang + 1);

                return;
            }

            /*
             * Le compte a un second facteur : aucune session n'est ouverte,
             * et le serveur n'a envoye aucun jeton. La page passe a l'etape
             * du code.
             */
            if (response?.double_authentification_requise) {
                setDefi({defi: response.defi, facteurs: response.facteurs ?? []});
                return;
            }

            if (!response?.token) {
                Notify("Connexion impossible pour le moment", "error");
                return;
            }

            await terminerConnexion(response);

            // Le jeton est pose dans un cookie serveur : les pages rendues
            // cote serveur doivent le relire. `refresh()` les regenere sans
            // recharger l'application — `window.location.href` reconstruisait
            // tout depuis zero, panier Redux et cache TanStack Query compris.
            /*
             * Le chemin d'ou l'on vient, quand la page nous l'a passe.
             *
             * Thalia Trans envoie ici un visiteur qui a deja choisi sa voiture
             * et son creneau : le ramener sur l'accueil lui ferait tout
             * refaire. Lu de `window.location` et non de `useSearchParams`,
             * pour ne pas avoir a envelopper cette page dans un Suspense.
             *
             * Seuls les chemins internes sont suivis : une adresse absolue
             * ferait de ce parametre une redirection ouverte, de quoi deposer
             * un client fraichement connecte sur un site tiers.
             */
        } finally {
            setLoading(false);
        }
    };

    /**
     * Ce qui suit un jeton obtenu, quel que soit le chemin.
     *
     * Ecrit une fois : la connexion simple et celle a deux facteurs
     * aboutissent au meme endroit.
     */
    async function terminerConnexion(response) {
        await setToken(response.token);
        await refetch();
        dispatch(fetchAccountData());
        Notify("Connexion réussie", "success");

        // Le jeton est pose dans un cookie serveur : les pages rendues
        // cote serveur doivent le relire. `refresh()` les regenere sans
        // recharger l'application — `window.location.href` reconstruisait
        // tout depuis zero, panier Redux et cache TanStack Query compris.
        const retour = new URLSearchParams(window.location.search).get("retour");
        const destination = retour?.startsWith("/") && !retour.startsWith("//") ? retour : "/";

        router.replace(destination);
        router.refresh();
    }

    const verifierLeCode = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await FetchData.sendData(Route.login_double_authentification, {
                defi: defi.defi,
                code: code.trim(),
            });

            if (response?.name === "AxiosError") {
                Notify(
                    response.response?.data?.message ?? "Ce code ne correspond pas",
                    "error"
                );
                return;
            }

            await terminerConnexion(response);
        } finally {
            setLoading(false);
        }
    };

    /*
     * L'etape du code. Le mot de passe n'est pas redemande : il est deja
     * verifie, et le reafficher inviterait a le ressaisir alors que ce
     * n'est pas lui qui manque.
     */
    if (defi) {
        const parCourriel = defi.facteurs.includes("courriel");

        return (
            <CarteAuth
                titre="Vérification"
                sousTitre={
                    parCourriel
                        ? "Saisissez le code à six chiffres que nous venons d’envoyer à votre adresse."
                        : "Saisissez le code affiché par votre application d’authentification."
                }
                bas={
                    <button
                        type="button"
                        onClick={() => {
                            setDefi(null);
                            setCode("");
                        }}
                        className="font-semibold text-brand-600 underline-offset-4 hover:underline"
                    >
                        Revenir à la connexion
                    </button>
                }
            >
                <form className="flex flex-col gap-5" onSubmit={verifierLeCode}>
                    <ChampTexte
                        label="Code de vérification"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        placeholder={parCourriel ? "000000" : "123456"}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        /* Le code de secours sauve un téléphone perdu. Le
                           taire enfermerait dehors ceux à qui il sert. */
                        aide="Vous pouvez aussi saisir l’un de vos codes de secours."
                        requis
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading || code.trim().length === 0}
                        className="mt-2 flex w-full items-center justify-center rounded-pill bg-secondaryColor py-3.5 text-body font-semibold text-white transition-opacity duration-150 hover:opacity-90 disabled:opacity-60"
                    >
                        {loading ? <Spinner /> : "Vérifier"}
                    </button>
                </form>
            </CarteAuth>
        );
    }

    return (
        <CarteAuth
            titre="Connexion"
            sousTitre="Retrouvez vos commandes et vos adresses."
            bas={
                <>
                    Vous n&apos;avez pas de compte ?{" "}
                    <Link
                        href="/signup"
                        className="font-semibold text-brand-600 underline-offset-4 hover:underline"
                    >
                        Inscrivez-vous
                    </Link>
                </>
            }
        >
            <form className="flex flex-col gap-5" onSubmit={handlerSubmit}>
                <ChampTexte
                    label="Identifiant"
                    placeholder="Votre email ou numéro de téléphone"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <ChampTexte
                    label="Mot de passe"
                    motDePasse
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <Turnstile onJeton={setJetonAntiRobot} reinit={reinitDefi} />

                {/* Tant que le défi n'est pas passé, on n'envoie pas.
                    `DEFI_ACTIF` garde le bouton vivant sur un site sans clé,
                    où aucun jeton n'arriverait jamais. */}
                <button
                    type="submit"
                    disabled={loading || (DEFI_ACTIF && !jetonAntiRobot)}
                    className="mt-2 flex w-full items-center justify-center rounded-pill bg-secondaryColor py-3.5 text-body font-semibold text-white transition-opacity duration-150 hover:opacity-90 disabled:opacity-60"
                >
                    {loading ? <Spinner /> : "Se connecter"}
                </button>
            </form>
        </CarteAuth>
    );
}
