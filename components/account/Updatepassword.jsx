"use client";
import { useState } from "react";
import Notify from "../toastify/Notify";
import { Route } from "@/helpers/Route";
import { FetchData } from "@/helpers/FetchData";
import Spinner from "../Loader/Spinner";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [current_password, setCurrentPassword] = useState("");

  //   rendre visibles les mots de passe

  const [showCurrentPassWord, setShowCurrentPassWord] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [loading, setLoading] = useState(false);

  // Fonction pour valider et envoyer les données
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!password || !passwordConfirmation) {
      Notify("Veuillez remplir tous les champs", "error");
      return;
    }

    if (password !== passwordConfirmation) {
      Notify("Les mots de passe ne correspondent pas", "error");
      return;
    }

    try {
      setLoading(true);
      const formData = {
        password,
        confirm_password: passwordConfirmation,
        current_password,
      };
      const response = await FetchData.sendData(
        Route.update_password,
        formData
      );

      if (response.name === "AxiosError") {
        const {
          response: {
            data: { message },
          },
        } = response;
        Notify(message || "Erreur lors de la mise à jour", "error");
      } else {
        Notify("Mot de passe mis à jour avec succès !", "success");
        setPassword("");
        setPasswordConfirmation("");
        setCurrentPassword("");
      }
    } catch (error) {
      Notify("Une erreur inattendue s'est produite", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full rounded-xl relative flex gap-8">
      <div data-aos="fade-left" className="box-shadow-custom p-5 rounded-xl w-full bg-white">
        <p className="mb-10 text-primaryColor uppercase text-base font-semibold">
          Mettre à jour votre mot de passe
        </p>
        <form
          className="w-full h-full space-y-6"
          onSubmit={handleUpdatePassword}
        >
          {/* Nouveau mot de passe */}
          <div className="flex flex-col relative">
            <label htmlFor="current-password" className="text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              type={showCurrentPassWord ? "text" : "password"}
              id="current-password"
              className="py-2 w-full px-4 sm:py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-primaryColor valid:border-primaryColor valid:text-primaryColor placeholder:text-sm pr-10"
              placeholder="Votre mot de passe"
              value={current_password}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <button
              type="button"
              aria-label={
                showCurrentPassWord
                  ? "Cacher le mot de passe"
                  : "Afficher le mot de passe"
              }
              className="absolute right-3 top-12 text-xl text-gray-400 hover:text-gray-600 transition-colors cursor-pointer no-select"
              onClick={() => setShowCurrentPassWord(!showCurrentPassWord)}
            >
              {showCurrentPassWord ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Nouveau mot de passe */}
            <div className="flex flex-col relative">
              <label htmlFor="password" className="text-gray-700 mb-2">
                Nouveau mot de passe
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="py-2 w-full px-4 sm:py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-primaryColor valid:border-primaryColor valid:text-primaryColor placeholder:text-sm pr-16"
                placeholder="Votre nouveau mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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

            {/* Confirmation du mot de passe */}
            <div className="flex flex-col relative">
              <label
                htmlFor="passwordConfirmation"
                className="text-gray-700 mb-2"
              >
                Confirmation du mot de passe
              </label>
              <input
                type={showPasswordConfirmation ? "text" : "password"}
                id="passwordConfirmation"
                className="py-2 w-full px-4 sm:py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-primaryColor valid:border-primaryColor valid:text-primaryColor placeholder:text-sm pr-16"
                placeholder="Confirmez votre mot de passe"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
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

          <button
            type="submit"
            className="w-full py-3 text-sm sm:text-base sm:py-4 bg-secondaryColor text-white rounded-lg font-semibold hover:bg-secondaryColor/90 focus:ring-2 focus:ring-secondaryColor focus:ring-opacity-50"
          >
            {loading ? <Spinner /> : "Mettre à jour"}
          </button>
        </form>
      </div>
    </div>
  );
}
