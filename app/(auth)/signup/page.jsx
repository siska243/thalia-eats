"use client";
import React, { useState } from "react";

import Link from "next/link";
import { FetchData } from "@/helpers/FetchData";
import { Route } from "@/helpers/Route";
import Spinner from "@/components/Loader/Spinner";
import logo from "@/public/assets/logo-thalia.png";
import Notify from "@/components/toastify/Notify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signup() {
  const [name, setName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  // fonction pour vider les champs
  const viderChamps = () => {
    setName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
  };

  // fonction pour envoyer les données
  const handlerSubmit = async (e) => {
    e.preventDefault();
    // Vérification des champs directement sans utiliser `champsVide`
    if (
      !name ||
      !last_name ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      Notify("Veuillez remplir tous les champs", "info");
      return;
    }

    // Vérification des mots de passe
    if (password !== confirmPassword) {
      Notify("Veuillez entrer le même mot de passe", "info");
      return;
    }

    if (password !== confirmPassword) {
      Notify("Veuillez entrer le même mot de passe", "info");
      return;
    }
    try {
      setLoading(true);
      const data = {
        name,
        last_name,
        email,
        phone,
        password,
      };
      const response = await FetchData.sendData(Route.register, data);
      if (response.name === "AxiosError") {
        console.error(response);
        const {
          response: {
            data: { message },
          },
        } = response;
        Notify(message, "error");
      } else {
        viderChamps();
        Notify("Inscription réussie", "success");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen h-full pt-[220px] md:pt-[200px]  flex items-center justify-center bg-[#F3F4F6]">
      <section className="max-w-[1300px] mx-auto px-4 md:px-5 h-full w-full flex justify-center items-center mb-10 py-5">
        {/* Formulaire d'inscription */}
        <div className="bg-white md:w-[900px] rounded-2xl shadow-xl overflow-hidden w-full">
          <form
            className="w-full h-full md:p-10 space-y-6 px-4 py-6 sm:p-6"
            onSubmit={handlerSubmit}
          >
            <h2 className="text-xl md:text-3xl font-semibold text-center text-gray-900 mb-8">
              Inscription
            </h2>

            {/* Nom et Prénom */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="firstName" className="text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="py-2 w-full px-4 sm:py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-primaryColor valid:border-primaryColor valid:text-primaryColor"
                  placeholder="ex: thialia-eat"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="lastName" className="text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="py-2 w-full px-4 sm:py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-primaryColor valid:border-primaryColor valid:text-primaryColor"
                  placeholder="ex: thialia-eat"
                  required
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            {/* Email et Téléphone */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="email" className="text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="py-2 w-full px-4 sm:py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-primaryColor valid:border-primaryColor valid:text-primaryColor"
                  placeholder="exemple@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="phone" className="text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="phone"
                  id="phone"
                  className="py-2 w-full px-4 sm:py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-primaryColor valid:border-primaryColor valid:text-primaryColor"
                  required
                  placeholder="ex:+33627758753"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Mot de passe et Confirmation */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col relative">
                <label htmlFor="password" className="text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="pr-12 w-full py-2 px-4 sm:py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-primaryColor valid:border-primaryColor valid:text-primaryColor"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Cacher le mot de passe"
                      : "Afficher le mot de passe"
                  }
                  className="absolute right-3 top-12 text-xl text-gray-400 hover:text-gray-600 transition-colors cursor-pointer no-select"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="flex flex-col relative">
                <label htmlFor="confirmPassword" className="text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <input
                  type={showPasswordConfirmation ? "text" : "password"}
                  id="confirmPassword"
                  className="pr-12 w-full py-2 px-4 sm:py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-primaryColor valid:border-primaryColor valid:text-primaryColor"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  aria-label={
                    showPasswordConfirmation 
                      ? "Cacher le mot de passe"
                      : "Afficher le mot de passe"
                  }
                  className="absolute right-3 top-12 text-xl text-gray-400 hover:text-gray-600 transition-colors cursor-pointer no-select"
                  onClick={() =>
                    setShowPasswordConfirmation(!showPasswordConfirmation)
                  }
                >
                  {showPasswordConfirmation ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Bouton d'inscription */}
            <button
              disabled={loading}
              type="submit"
              className="w-full py-3 text-sm sm:text-base sm:py-4 bg-secondaryColor text-white rounded-lg font-semibold hover:bg-secondaryColor/90 focus:ring-2 focus:ring-secondaryColor focus:ring-opacity-50"
            >
              {loading ? <Spinner /> : "S'inscrire"}
            </button>

            <p className="text-center text-gray-500 mt-4">
              Vous avez déjà un compte ?{" "}
              <Link href="/login" className="text-primaryColor hover:underline">
                Connectez-vous
              </Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
