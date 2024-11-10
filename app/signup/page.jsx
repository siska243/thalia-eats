import React from "react";
import Image from "next/image";
import foodsImg from "@/public/assets/images/foodsImg.png";
import Link from "next/link";

export default function Signup() {
  return (
    <section className="max-w-[1300px] mx-auto px-5 h-full w-full flex justify-center items-center mb-10 py-5">
      <div className="max-w-[1100px] h-full w-full grid lg:grid-cols-[60%,40%] overflow-hidden rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative">
        {/* Formulaire d'inscription */}
        <div className="bg-white">
          <form className="w-full h-full space-y-6 p-10 lg:p-16">
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
                />
              </div>
            </div>

            {/* Bouton d'inscription */}
            <button
              type="submit"
              className="w-full py-3 text-sm sm:text-base sm:py-4 bg-secondaryColor text-white rounded-lg font-semibold hover:bg-secondaryColor/90 focus:ring-2 focus:ring-secondaryColor focus:ring-opacity-50"
            >
              S'inscrire
            </button>

            <p className="text-center text-gray-500 mt-4">
              Vous avez déjà un compte ?{" "}
              <Link href="/login" className="text-primaryColor hover:underline">
                Connectez-vous
              </Link>
            </p>
          </form>
        </div>

        {/* Image de fond */}
        <div className="hidden lg:block h-full relative">
          <Image
            src={foodsImg}
            alt="image food"
            className="w-full h-full object-cover z-[–1]"
          />
          <div className="absolute h-full inset-0 bg-secondaryColor/85"></div>
        </div>
      </div>
    </section>
  );
}
