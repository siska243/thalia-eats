"use client";

import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import CarteAuth from "@/components/auth/CarteAuth";
import ChampTexte from "@/components/auth/ChampTexte";
import Spinner from "@/components/Loader/Spinner";
import Notify from "@/components/toastify/Notify";
import {FetchData} from "@/helpers/FetchData";
import {Route} from "@/helpers/Route";

const CHAMPS_VIDES = {
    name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
};

/**
 * Inscription.
 *
 * Trois defauts corriges :
 *
 * - le champ telephone declarait `type="phone"`, qui n'existe pas : le
 *   navigateur retombait sur du texte, et le telephone n'ouvrait donc pas le
 *   clavier numerique. Le type valide est `tel`.
 * - la comparaison des deux mots de passe etait ecrite deux fois de suite,
 *   a l'identique.
 * - apres une inscription reussie, la page vidait le formulaire et s'arretait
 *   la : aucune redirection, aucun pas suivant. On restait devant un
 *   formulaire vierge sans savoir si le compte existait. Elle mene maintenant
 *   a la connexion.
 */
export default function PageInscription() {
    const [champs, setChamps] = useState(CHAMPS_VIDES);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const modifier = (cle) => (e) =>
        setChamps((precedent) => ({...precedent, [cle]: e.target.value}));

    const handlerSubmit = async (e) => {
        e.preventDefault();

        if (champs.password !== champs.confirmPassword) {
            Notify("Les deux mots de passe ne correspondent pas", "info");
            return;
        }

        setLoading(true);

        try {
            // Le champ de confirmation ne sert qu'a la verification locale :
            // il n'a rien a faire dans le corps envoye a l'API.
            const donnees = {...champs};
            delete donnees.confirmPassword;

            const response = await FetchData.sendData(Route.register, donnees);

            if (response?.name === "AxiosError") {
                Notify(
                    response.response?.data?.message ?? "Inscription impossible",
                    "error"
                );
                return;
            }

            setChamps(CHAMPS_VIDES);
            Notify("Inscription réussie, connectez-vous", "success");
            router.push("/login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <CarteAuth
            large
            titre="Créer un compte"
            sousTitre="Pour commander et suivre vos livraisons à Kinshasa."
            bas={
                <>
                    Vous avez déjà un compte ?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-brand-600 underline-offset-4 hover:underline"
                    >
                        Connectez-vous
                    </Link>
                </>
            }
        >
            <form className="flex flex-col gap-5" onSubmit={handlerSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                    <ChampTexte
                        label="Prénom"
                        placeholder="Votre prénom"
                        autoComplete="given-name"
                        value={champs.name}
                        onChange={modifier("name")}
                        required
                    />

                    <ChampTexte
                        label="Nom"
                        placeholder="Votre nom"
                        autoComplete="family-name"
                        value={champs.last_name}
                        onChange={modifier("last_name")}
                        required
                    />

                    <ChampTexte
                        label="Email"
                        type="email"
                        placeholder="exemple@email.com"
                        autoComplete="email"
                        value={champs.email}
                        onChange={modifier("email")}
                        required
                    />

                    <ChampTexte
                        label="Téléphone"
                        type="tel"
                        inputMode="tel"
                        placeholder="+243 82 000 0000"
                        autoComplete="tel"
                        value={champs.phone}
                        onChange={modifier("phone")}
                        required
                    />

                    <ChampTexte
                        label="Mot de passe"
                        motDePasse
                        placeholder="••••••••"
                        autoComplete="new-password"
                        minLength={8}
                        aide="8 caractères minimum"
                        value={champs.password}
                        onChange={modifier("password")}
                        required
                    />

                    <ChampTexte
                        label="Confirmer le mot de passe"
                        motDePasse
                        placeholder="••••••••"
                        autoComplete="new-password"
                        value={champs.confirmPassword}
                        onChange={modifier("confirmPassword")}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 flex w-full items-center justify-center rounded-pill bg-secondaryColor py-3.5 text-body font-semibold text-white transition-opacity duration-150 hover:opacity-90 disabled:opacity-60"
                >
                    {loading ? <Spinner /> : "Créer mon compte"}
                </button>
            </form>
        </CarteAuth>
    );
}
