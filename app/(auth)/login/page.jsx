"use client";

import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import CarteAuth from "@/components/auth/CarteAuth";
import ChampTexte from "@/components/auth/ChampTexte";
import PhoneNumber from "@/components/forms/phone-number";
import Turnstile, {DEFI_ACTIF} from "@/components/auth/Turnstile";
import Spinner from "@/components/Loader/Spinner";
import Notify from "@/components/toastify/Notify";
import {FetchData} from "@/helpers/FetchData";
import {Route} from "@/helpers/Route";
import {estValide, pourLeCompte} from "@/helpers/telephone";
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
    /*
     * DEUX ETAPES : on se nomme, puis on prouve que c'est bien soi.
     *
     * Le champ s'appelait deja « Identifiant » et disait accepter « votre
     * email ou numero de telephone » — mais il partait dans `email`, et le
     * serveur ne connaissait que l'adresse. Un numero y etait donc refuse
     * sans que rien n'explique pourquoi.
     *
     * Le decoupage existe pour que la premiere etape pose une question a
     * laquelle on peut repondre de deux facons, sans afficher les deux
     * champs a la fois.
     */
    const [etape, setEtape] = useState("identifiant");
    const [canal, setCanal] = useState("email");

    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [erreurIdentifiant, setErreurIdentifiant] = useState(null);
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
            /*
             * UN SEUL CHAMP D'IDENTIFIANT PART. Envoyer les deux laisserait
             * le serveur choisir, et c'est le client qui a choisi.
             *
             * `pourLeCompte` rend le format local, celui que les comptes
             * stockent — la conversion vit dans `helpers/telephone`, une
             * seule fois, et pas dans cette page.
             */
            const identifiants =
                canal === "telephone"
                    ? {phone: pourLeCompte(phone), password}
                    : {email, password};

            // Absent quand le défi n'est pas configuré : le serveur ne le
            // réclame que si sa propre clé est posée.
            if (jetonAntiRobot) identifiants.turnstile_token = jetonAntiRobot;

            const response = await FetchData.sendData(Route.login, identifiants);

            if (response?.name === "AxiosError") {
                /*
                 * L'ADRESSE N'A JAMAIS ETE CONFIRMEE.
                 *
                 * Le mot de passe est bon, le serveur refuse quand meme et le
                 * dit par ce code machine. Sans cette redirection, le client
                 * lit « confirmez votre adresse » sans savoir ou le faire :
                 * seul /signup menait jusqu'ici a l'ecran de confirmation, et
                 * le code recu a l'inscription vaut trente minutes. Celui qui
                 * revient le lendemain doit en redemander un, et cet ecran est
                 * le seul endroit qui le permet.
                 *
                 * L'adresse est passee dans l'URL pour qu'il ne la resaisisse
                 * pas : c'est a elle que le code part.
                 */
                if (response.response?.data?.error === "adresse_non_confirmee") {
                    Notify(response.response.data.message, "error");

                    /*
                     * Connecte par telephone, on n'a pas l'adresse — et la
                     * page de confirmation ne sait pas travailler sans elle.
                     * On s'en tient alors au message du serveur plutot que
                     * d'envoyer sur un formulaire au champ vide.
                     */
                    if (email) {
                        router.push(`/confirmation?email=${encodeURIComponent(email)}`);
                        return;
                    }

                    setReinitDefi((rang) => rang + 1);

                    return;
                }

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

    const bas = (
        <>
            Vous n&apos;avez pas de compte ?{" "}
            <Link
                href="/signup"
                className="font-semibold text-brand-600 underline-offset-4 hover:underline"
            >
                Inscrivez-vous
            </Link>
        </>
    );

    /*
     * ETAPE 2 : LE MOT DE PASSE.
     *
     * L'identifiant est rappele sous le titre, pas reaffiche en champ : il
     * est deja saisi, et un champ modifiable inviterait a le corriger ici
     * alors que le retour existe pour ca.
     *
     * Le defi anti-robot vit sur cette etape et pas sur la premiere : son
     * jeton ne sert qu'une fois, et il part avec la connexion.
     */
    if (etape === "motDePasse") {
        return (
            <CarteAuth
                titre="Votre mot de passe"
                sousTitre={canal === "email" ? email : phone}
                bas={bas}
            >
                <form className="flex flex-col gap-5" onSubmit={handlerSubmit}>
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

                    {/* Tant que le defi n'est pas passe, on n'envoie pas.
                        `DEFI_ACTIF` garde le bouton vivant sur un site sans
                        cle, ou aucun jeton n'arriverait jamais. */}
                    <button
                        type="submit"
                        disabled={loading || (DEFI_ACTIF && !jetonAntiRobot)}
                        className="mt-2 flex w-full items-center justify-center rounded-pill bg-secondaryColor py-3.5 text-body font-semibold text-white transition-opacity duration-150 hover:opacity-90 disabled:opacity-60"
                    >
                        {loading ? <Spinner /> : "Se connecter"}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setEtape("identifiant");
                            setPassword("");
                        }}
                        className="text-center font-semibold text-brand-600 underline-offset-4 hover:underline"
                    >
                        Changer d’identifiant
                    </button>
                </form>
            </CarteAuth>
        );
    }

    const continuer = (e) => {
        e.preventDefault();

        if (canal === "email") {
            if (!email.trim()) {
                setErreurIdentifiant("L’adresse email est obligatoire");

                return;
            }
        } else if (!phone.trim()) {
            setErreurIdentifiant("Le numéro de téléphone est obligatoire");

            return;
        } else if (!estValide(pourLeCompte(phone))) {
            setErreurIdentifiant(
                "Ce numéro de téléphone n’est pas valide. Exemple : 0810000000."
            );

            return;
        }

        setErreurIdentifiant(null);
        setEtape("motDePasse");
    };

    /*
     * ETAPE 1 : QUI ETES-VOUS.
     *
     * L'email d'abord, parce que c'est l'identifiant de tous les comptes
     * deja crees. Le telephone est a un clic, sous le champ, et non dans un
     * selecteur a deux onglets : un onglet aurait demande de choisir avant
     * de comprendre qu'il y avait un choix.
     */
    return (
        <CarteAuth
            titre="Connexion"
            sousTitre="Retrouvez vos commandes et vos adresses."
            bas={bas}
        >
            <form className="flex flex-col gap-5" onSubmit={continuer}>
                {canal === "email" ? (
                    <ChampTexte
                        label="Adresse email"
                        type="email"
                        placeholder="vous@exemple.com"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                            setErreurIdentifiant(null);
                            setEmail(e.target.value);
                        }}
                        required
                    />
                ) : (
                    <PhoneNumber
                        className="w-full"
                        country="cd"
                        preferredCountries={["cd"]}
                        label={
                            <>
                                Téléphone
                                <span className="text-danger" aria-hidden>
                                    {" *"}
                                </span>
                            </>
                        }
                        value={phone}
                        onChange={(valeur) => {
                            setErreurIdentifiant(null);
                            setPhone(valeur);
                        }}
                        inputProps={{name: "phone", required: true}}
                    />
                )}

                {erreurIdentifiant ? (
                    <p className="text-caption text-danger" role="alert">
                        {erreurIdentifiant}
                    </p>
                ) : null}

                <button
                    type="button"
                    onClick={() => {
                        setCanal(canal === "email" ? "telephone" : "email");
                        setErreurIdentifiant(null);
                    }}
                    className="text-center font-semibold text-brand-600 underline-offset-4 hover:underline"
                >
                    {canal === "email"
                        ? "Se connecter avec mon téléphone"
                        : "Se connecter avec mon email"}
                </button>

                <button type="submit" className="mt-2 flex w-full items-center justify-center rounded-pill bg-secondaryColor py-3.5 text-body font-semibold text-white transition-opacity duration-150 hover:opacity-90 disabled:opacity-60">
                    Continuer
                </button>
            </form>
        </CarteAuth>
    );
}
