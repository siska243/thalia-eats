"use client";
import React, { useState } from "react";
import Image from "next/image";
import foodsImg from "@/public/assets/images/foodsImg.png";
import Link from "next/link";
import { FetchData } from "@/helpers/FetchData";
import { Route } from "@/helpers/Route";
import { setToken } from "@/server/manageToken";
import { redirect } from "next/navigation";
import { loginRedirect } from "@/server/server-redirect";
import Spinner from "@/components/Loader/Spinner";
import logo from "@/public/assets/logo-thalia.png";
import Notify from "@/components/toastify/Notify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

        const { response: { data: { message } } } = response;
        Notify(message, "error");

      } else {
        console.log(response);
        const { token } = response;
        if (token) {
          Notify("Connexion réussie", "success");
          await loginRedirect({ token, url: "/" });

        }
      }
    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen h-full pt-[220px] md:pt-[230px]  flex items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(rgba(3, 8, 31, 0.92), rgba(3, 8, 31, 0.92)), url(${logo.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
      <section className="max-w-[1300px] mx-auto px-4 md:px-5  h-full w-full flex justify-center items-center mb-10 py-5">
        <div className="max-w-[600px] h-full w-full grid overflow-hidden rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative">
          {/* forlulaire d'inscription */}
          <div className="  bg-white ">
            <form
              className="w-full h-full space-y-6 md:p-10 p-4"
              onSubmit={handlerSubmit}
            >
              <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-800 mb-8">
                Connexion
              </h2>

              <div className="flex flex-col">
                <label htmlFor="email" className="text-gray-600 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="py-2 px-4 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondaryColor focus:outline-none"
                  placeholder="Entrez votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col relative">
                <label htmlFor="password" className="text-gray-600 mb-2">
                  Mot de passe
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  className="py-2 px-4 sm:py-3  rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondaryColor focus:outline-none"
                  placeholder="Entrez votre mot de passe"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute right-3 top-11 text-2xl text-gray-400 cursor-pointer no-select"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full py-3 text-sm sm:text-base sm:py-4 bg-secondaryColor text-white rounded-lg font-semibold hover:bg-secondaryColor/90 focus:ring-2 focus:ring-secondaryColor focus:ring-opacity-50"
              >
                {
                  loading ? (<Spinner />) : "Se connecter"
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
      </section>
    </div>
  );
}
