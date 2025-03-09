import React, { useState } from "react";
import Notify from "../toastify/Notify";
import useReferentialData from "@/hooks/useQueryTanStack";
import { Route } from "@/helpers/Route";
import { FetchData } from "@/helpers/FetchData";
import Spinner from "../Loader/Spinner";

export default function UpdateAdresse() {
  const { data, isLoading, isError, isFetched } = useReferentialData({
    url: Route.default,
    queryKey: "dafault",
  });
  const [town, setTown] = useState("");
  const [street, setStreet] = useState("");
  const [numberStreet, setNumberStreet] = useState("");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);

  console.log("Les odnnées sont bien chargées...", data);

  // fonction pour envoyer les données
  const handlerSendData = async (e) => {
    e.preventDefault();
    if (!town || !street || !numberStreet || !reference) {
      Notify("Veuillez remplir tous les champs", "error");
      return;
    }
    try {
      setLoading(true);
      const formData = {
        town,
        street,
        number_street: numberStreet,
        principal_adresse: reference,
      };
      const response = await FetchData.sendData(Route.update_adresse, formData);
      if (response.name === "AxiosError") {
        const {
          response: {
            data: { message, error },
          },
        } = response;
        Notify(error, "error");
      } else {
        Notify("Adresse mise à jour !", "success");
        setTown("");
        setStreet("");
        setNumberStreet("");
        setReference("");
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" w-full h-full rounded-xl  relative flex gap-8">
      <div data-aos="fade-right" className="box-shadow-custom p-5 rounded-xl w-full bg-white">
        <p className="mb-10 text-primaryColor uppercase text-base font-semibold ">
          Mettre à jour votre adresse
        </p>
        <div className="  bg-white ">
          <form className="w-full h-full space-y-6 " onSubmit={handlerSendData}>
            {/* commune and quartier */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* commune select */}
              <div className="flex flex-col">
                <label htmlFor="commune" className="text-gray-700 mb-2">
                  Commune
                </label>
                <select
                  name=""
                  id="commune"
                  className="w-full py-2 px-4 sm:py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-primaryColor valid:border-primaryColor valid:text-primaryColor"
                  required
                  onChange={(e) => setTown(e.target.value)}
                >
                  <option value="" className="text-sm">
                    Selectionner la commune
                  </option>
                  {data?.town?.map((town) => {
                    return (
                      <option value={town.slug} key={town.uid}>
                        {town.title}
                      </option>
                    );
                  })}
                </select>
              </div>
              {/* avenue input */}
              <div className="flex flex-col">
                <label htmlFor="avenue" className="text-gray-700 mb-2">
                  Avenue
                </label>
                <input
                  type="text"
                  id="avenue"
                  required
                  className="w-full py-2 px-4 sm:py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-primaryColor valid:border-primaryColor valid:text-primaryColor"
                  placeholder="Quelle est votre Avenue"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>
            </div>

            {/* numero avaenue and la reférence de l'avenue  */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* numero avenue */}

              <div className="flex flex-col">
                <label htmlFor="numero" className="text-gray-700 mb-2">
                  Numéro de l'avenue
                </label>
                <input
                  type="text"
                  id="numero"
                  required
                  className="w-full py-2 px-4 sm:py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-primaryColor valid:border-primaryColor valid:text-primaryColor"
                  placeholder="Le numéro de votre avenue"
                  value={numberStreet}
                  onChange={(e) => setNumberStreet(e.target.value)}
                />
              </div>
              {/* la reférence de l'avenue */}
              <div className="flex flex-col">
                <label htmlFor="ref" className="text-gray-700 mb-2">
                  Reférence
                </label>
                <input
                  type="text"
                  id="ref"
                  required
                  className="w-full py-2 px-4 sm:py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-primaryColor valid:border-primaryColor valid:text-primaryColor"
                  placeholder="la Reférence proche de votre domicile"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 text-sm sm:text-base sm:py-4 bg-secondaryColor text-white rounded-lg font-semibold hover:bg-secondaryColor/90 focus:ring-2 focus:ring-secondaryColor focus:ring-opacity-50"
            >
              {loading ? <Spinner /> : "Mise à jour"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
