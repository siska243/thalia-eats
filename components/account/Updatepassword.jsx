'use client';
import { useState } from "react";
import Notify from "../toastify/Notify";
import { Route } from "@/helpers/Route";
import { FetchData } from "@/helpers/FetchData";
import Spinner from "../Loader/Spinner";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function UpdatePassword() {
   const [password, setPassword] = useState("");
   const [passwordConfirmation, setPasswordConfirmation] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
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
         const formData = { password };
         const response = await FetchData.sendData(Route.update_password, formData);

         if (response.name === "AxiosError") {
            const { response: { data: { message } } } = response;
            Notify(message || "Erreur lors de la mise à jour", "error");
         } else {
            Notify("Mot de passe mis à jour avec succès !", "success");
            setPassword("");
            setPasswordConfirmation("");
         }
      } catch (error) {
         Notify("Une erreur inattendue s'est produite", "error");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="w-full h-full rounded-xl relative flex gap-8">
         <div className="box-shadow-custom p-5 rounded-xl w-full bg-white">
            <p className="mb-10 text-primaryColor uppercase text-base font-semibold">
               Mettre à jour votre mot de passe
            </p>
            <form
               className="w-full h-full space-y-6"
               onSubmit={handleUpdatePassword}
            >
               {/* Nouveau mot de passe */}
               <div className="flex flex-col relative">
                  <label htmlFor="password" className="text-secondaryColor mb-2">
                     Nouveau mot de passe
                  </label>
                  <input
                     type={showPassword ? "text" : "password"}
                     id="password"
                     className="py-2 px-4 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondaryColor focus:outline-none placeholder:text-sm pr-16"
                     placeholder="Votre nouveau mot de passe"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                  />
                  <span
                     className="absolute right-3 top-11 text-2xl text-gray-400 cursor-pointer no-select"
                     onClick={() => setShowPassword(!showPassword)}
                  >
                     {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
               </div>

               {/* Confirmation du mot de passe */}
               <div className="flex flex-col relative">
                  <label htmlFor="passwordConfirmation" className="text-secondaryColor mb-2">
                     Confirmation du mot de passe
                  </label>
                  <input
                     type={showPasswordConfirmation ? "text" : "password"}
                     id="passwordConfirmation"
                     className="py-2 px-4 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondaryColor focus:outline-none placeholder:text-sm pr-16"
                     placeholder="Confirmez votre mot de passe"
                     value={passwordConfirmation}
                     onChange={(e) => setPasswordConfirmation(e.target.value)}
                     required
                  />
                  <span
                     className="absolute right-3 top-11 text-2xl text-gray-400 cursor-pointer no-select"
                     onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  >
                     {showPasswordConfirmation ? <FaEyeSlash /> : <FaEye />}
                  </span>
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
