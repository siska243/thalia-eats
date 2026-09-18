"use client";

import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import CarteAuth from "@/components/auth/CarteAuth";
import ChampTexte from "@/components/auth/ChampTexte";
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

    const {refetch} = useGetCurrentUser();
    const dispatch = useDispatch();
    const router = useRouter();

    const handlerSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await FetchData.sendData(Route.login, {email, password});

            if (response?.name === "AxiosError") {
                Notify(
                    response.response?.data?.message ?? "Email ou mot de passe incorrect",
                    "error"
                );
                return;
            }

            if (!response?.token) {
                Notify("Connexion impossible pour le moment", "error");
                return;
            }

            await setToken(response.token);
            await refetch();
            dispatch(fetchAccountData());
            Notify("Connexion réussie", "success");

            // Le jeton est pose dans un cookie serveur : les pages rendues
            // cote serveur doivent le relire. `refresh()` les regenere sans
            // recharger l'application — `window.location.href` reconstruisait
            // tout depuis zero, panier Redux et cache TanStack Query compris.
            router.replace("/");
            router.refresh();
        } finally {
            setLoading(false);
        }
    };

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

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 flex w-full items-center justify-center rounded-pill bg-secondaryColor py-3.5 text-body font-semibold text-white transition-opacity duration-150 hover:opacity-90 disabled:opacity-60"
                >
                    {loading ? <Spinner /> : "Se connecter"}
                </button>
            </form>
        </CarteAuth>
    );
}
