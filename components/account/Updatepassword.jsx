"use client";

import {useState} from "react";
import ChampTexte from "@/components/auth/ChampTexte";
import Notify from "../toastify/Notify";
import Spinner from "../Loader/Spinner";
import {Route} from "@/helpers/Route";
import {FetchData} from "@/helpers/FetchData";

/** Changement de mot de passe. */
export default function UpdatePassword() {
    const [current_password, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (!current_password || !password || !passwordConfirmation) {
            Notify("Veuillez remplir tous les champs", "error");
            return;
        }

        if (password !== passwordConfirmation) {
            Notify("Les deux mots de passe ne correspondent pas", "error");
            return;
        }

        setLoading(true);

        try {
            const response = await FetchData.sendData(Route.update_password, {
                password,
                confirm_password: passwordConfirmation,
                current_password,
            });

            if (response?.name === "AxiosError") {
                Notify(
                    response.response?.data?.message ?? "Mise à jour impossible",
                    "error"
                );
                return;
            }

            Notify("Mot de passe mis à jour", "success");
            setCurrentPassword("");
            setPassword("");
            setPasswordConfirmation("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="rounded-card bg-surface p-5 shadow-card sm:p-6">
            <h2 className="mb-5 text-title font-bold text-secondaryColor">
                Mot de passe
            </h2>

            <form className="flex flex-col gap-5" onSubmit={handleUpdatePassword}>
                <ChampTexte
                    label="Mot de passe actuel"
                    motDePasse
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={current_password}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />

                <ChampTexte
                    label="Nouveau mot de passe"
                    motDePasse
                    placeholder="••••••••"
                    autoComplete="new-password"
                    minLength={8}
                    aide="8 caractères minimum"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <ChampTexte
                    label="Confirmer le nouveau mot de passe"
                    motDePasse
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-1 flex w-full items-center justify-center rounded-pill bg-secondaryColor py-3.5 text-body font-semibold text-white transition-opacity duration-150 hover:opacity-90 disabled:opacity-60"
                >
                    {loading ? <Spinner /> : "Changer le mot de passe"}
                </button>
            </form>
        </section>
    );
}
