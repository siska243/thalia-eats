import Image from "next/image";
import foodsImg from "@/public/assets/images/foodsImg.png";
import Link from "next/link";

export default function EditAccount() {
  return (
    <div className=" w-full  overflow-hidden rounded-xl  relative">
      {/* forlulaire de modification du mot de passe */}
      <div className="  bg-white ">
        <form className="w-full h-full space-y-6 p-5 lg:p-10">
          <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-800 mb-8">
            Mettre à jour vos informations
          </h2>

          {/* Email et Téléphone */}
          {/* <div className="grid md:grid-cols-2 gap-4">
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
          </div> */}
          {/* Mot de passe et Confirmation */}
          <div className="grid lg:grid-cols-2 gap-4">
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
          <div>
            <div className="flex flex-col">
              <label htmlFor="adresse" className="text-gray-600 mb-2">
                Adresse
              </label>
              <textarea
                id="adresse"
                className="py-2 px-4 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondaryColor focus:outline-none w-full h-[100px]"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-sm sm:text-base sm:py-4 bg-secondaryColor text-white rounded-lg font-semibold hover:bg-secondaryColor/90 focus:ring-2 focus:ring-secondaryColor focus:ring-opacity-50"
          >
            Mettre à jour
          </button>
        </form>
      </div>

      {/* image de fonr */}
      {/* <div className="hidden sm:block h-full relative">
        <Image
          src={foodsImg}
          alt="image food"
          className="w-full h-full object-cover z-[–1]"
        />
        <div className="absolute h-full inset-0 bg-secondaryColor/85"></div>
      </div> */}
    </div>
  );
}
