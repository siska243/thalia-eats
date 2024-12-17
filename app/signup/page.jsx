"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FetchData } from "@/helpers/FetchData";
import { Route } from "@/helpers/Route";
import Spinner from "@/components/Loader/Spinner";

export default function Signup() {
  const [name, setName] = useState("")
  const [last_name, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [champsVide, setChampsVid] = useState(true)
  // fonction pour vider les champs
  const viderChamps = () => {
    setName("")
    setLastName("")
    setEmail("")
    setPhone("")
    setPassword("")
    setConfirmPassword("")
  }
  const verifyChampsVide = () => {
    if (name == " " || last_name == "" || email == "" || phone == "" || password == "" || confirmPassword == "") {
      setChampsVid(true)
    }
    else {
      setChampsVid(false)
    }
  }
  // fonction pour envoyer les données
  const handlerSubmit = async (e) => {
    e.preventDefault();
    verifyChampsVide()
    if (champsVide) {
      console.log('veuillez remplier tous les champs');
    }
    else {
      if (password !== confirmPassword) {
        console.log("veuillez entrez le même mot de passe");
        return
      }
      try {
        setLoading(true);
        viderChamps()
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
        } else {
          console.log("Inscription réussie :", response);
          // Ajoutez ici la logique pour rediriger ou afficher un message
        }
      } catch (e) {
        console.log(e);
      }
      finally {
        setLoading(false);
      }
    }

  }
  return (
    <div className="h-full pt-[220px] md:pt-[230px]">
      <section className="max-w-[1300px] mx-auto px-5 h-full w-full flex justify-center items-center mb-10 py-5">
        <div className="max-w-[900px] h-full w-full overflow-hidden rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative">
          {/* Formulaire d'inscription */}
          <div className="bg-white">
            <form className="w-full h-full space-y-6 p-10 lg:p-16" onSubmit={handlerSubmit}>
              <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-800 mb-8">
                Inscription
              </h2>

              {/* Nom et Prénom */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="firstName" className="text-gray-600 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="py-2 px-4 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondaryColor focus:outline-none"
                    placeholder="Entrez votre prénom"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="lastName" className="text-gray-600 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="py-2 px-4 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondaryColor focus:outline-none"
                    placeholder="Entrez votre nom"
                    required
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email et Téléphone */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-gray-600 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="py-2 px-4 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondaryColor focus:outline-none"
                    placeholder="Entrez votre email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="phone" className="text-gray-600 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="py-2 px-4 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondaryColor focus:outline-none"
                    placeholder="Entrez votre téléphone"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Mot de passe et Confirmation */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="password" className="text-gray-600 mb-2">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="py-2 px-4 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondaryColor focus:outline-none"
                    placeholder="Entrez votre mot de passe"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="confirmPassword" className="text-gray-600 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="py-2 px-4 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondaryColor focus:outline-none"
                    placeholder="Confirmez votre mot de passe"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Bouton d'inscription */}
              <button
                type="submit"
                className="w-full py-3 text-sm sm:text-base sm:py-4 bg-secondaryColor text-white rounded-lg font-semibold hover:bg-secondaryColor/90 focus:ring-2 focus:ring-secondaryColor focus:ring-opacity-50"
              >
                {
                  loading ? (<Spinner />) : "S'inscrire"
                }

              </button>

              <p className="text-center text-gray-500 mt-4">
                Vous avez déjà un compte ?{" "}
                <Link href="/login" className="text-primaryColor hover:underline">
                  Connectez-vous
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
