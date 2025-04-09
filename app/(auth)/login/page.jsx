"use client";
import React, {useState} from "react";
import Link from "next/link";
import {FetchData} from "@/helpers/FetchData";
import {Route} from "@/helpers/Route";
import {setToken} from "@/server/manageToken";
import {loginRedirect} from "@/server/server-redirect";
import Spinner from "@/components/Loader/Spinner";
import Notify from "@/components/toastify/Notify";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";

export default function page() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const {refetch} = useGetCurrentUser()

    const handlerSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const data = {
                email,
                password,
            };
            const response = await FetchData.sendData(Route.login, data);

            if (response.name === "AxiosError") {

                const {response: {data: {message}}} = response;
                Notify(message, "error");

            } else {

                const {token} = response;
                if (token) {
                    Notify("Connexion réussie", "success");
                    await setToken(token)
                    await refetch()
                    await loginRedirect({token, url: "/"});

                }
            }
        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-[#F3F4F6] h-full pt-[220px] md:pt-[230px]  flex items-center justify-center"
        >
            <section className="w-full max-w-lg mx-auto px-5  h-full flex justify-center items-center mb-10 py-5">
                {/* formulaire d'inscription */}
                <div className=" bg-white rounded-2xl shadow-xl overflow-hidden w-full">
                    <form
                        className="w-full h-full space-y-6 md:p-10 px-4 py-6 sm:p-6"
                        onSubmit={handlerSubmit}
                    >
                        <h2 className="text-xl md:text-3xl font-semibold text-center text-gray-900 mb-8">
                            Connexion
                        </h2>

                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="py-2 px-4 sm:py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-primaryColor valid:border-primaryColor valid:text-primaryColor"
                                placeholder="exemple@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col relative">
                            <label htmlFor="password" className="text-gray-700 mb-2">
                                Mot de passe
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                required
                                className="py-2 px-4 sm:py-3  rounded-lg border-2 border-gray-300 focus:border-primaryColor valid:border-primaryColor valid:text-primaryColor focus:outline-none"
                                placeholder="••••••••"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                                className="absolute right-3 top-12 text-xl text-gray-400 hover:text-gray-600 transition-colors cursor-pointer no-select"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash/> : <FaEye/>}
                            </button>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full py-3 text-sm sm:text-base sm:py-4 bg-secondaryColor text-white rounded-lg font-semibold hover:bg-secondaryColor/90 focus:ring-2 focus:ring-secondaryColor focus:ring-opacity-50"
                        >
                            {
                                loading ? (<Spinner/>) : "Se connecter"
                            }
                        </button>

                        <p className="text-center text-gray-500 mt-4 md:text-base text-sm">
                            Vous n'avez pas de compte ?{" "}
                            <Link
                                href="/signup"
                                className="text-primaryColor hover:underline"
                            >
                                Inscrivez-vous
                            </Link>
                        </p>
                    </form>
                </div>
            </section>
        </div>
    );
}
