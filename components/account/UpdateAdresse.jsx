import React, { useState } from 'react'
import Notify from '../toastify/Notify';
import useReferentialData from '@/hooks/useQueryTanStack';
import { Route } from '@/helpers/Route';
import { FetchData } from '@/helpers/FetchData';
import Spinner from '../Loader/Spinner';

export default function UpdateAdresse() {
   const { data, isLoading, isError, isFetched } = useReferentialData({ url: Route.default, queryKey: 'dafault' })
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
         Notify("Veuillez remplir tous les champs", "error")
         return
      }
      try {
         setLoading(true);
         const formData = {
            town,
            street,
            numberStreet,
            reference
         }
         const response = await FetchData.sendData(Route.update_adresse, formData);
         if (response.name == "AxiosError") {
            console.log(response);
            const { response: { data: { message, error } } } = response;
            Notify(error, "error");

         } else {
            console.log(response);
            Notify("Adresse mise à jour !", "success");
         }
      } catch (error) {
      } finally {
         setLoading(false);
      }


   }
   return (
      <div className=" w-full h-full rounded-xl  relative flex gap-8">
         <div className="box-shadow-custom p-5 rounded-xl w-full bg-white">
            <p className='mb-10 text-primaryColor uppercase text-base font-semibold '>Mettre à jour votre adresse</p>
            <div className="  bg-white ">
               <form
                  className="w-full h-full space-y-6 "
                  onSubmit={handlerSendData}

               >
                  {/* commune and quartier */}
                  <div className="grid md:grid-cols-2 gap-4">
                     {/* commune select */}
                     <div className="flex flex-col">
                        <label htmlFor="email" className="text-secondaryColor mb-2">
                           Commune
                        </label>
                        <select name="" id="commune" className="py-2 px-4 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondaryColor focus:outline-none text-gray-400 text-sm" required
                           onChange={(e) => setTown(e.target.value)}>
                           <option value="" className='text-sm'>Selectionner la commune</option>
                           {
                              data?.town?.map((town) => {
                                 return (
                                    <option value={town.slug} key={town.uid}>{town.title}</option>
                                 )
                              })
                           }


                        </select>
                     </div>
                     {/* avenue input */}
                     <div className="flex flex-col">
                        <label htmlFor="password" className="text-secondaryColor mb-2">
                           Avenue
                        </label>
                        <input
                           type="text"
                           id="Avenue"
                           required
                           className="py-2 px-4 sm:py-3  rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondaryColor focus:outline-none placeholder:text-sm"
                           placeholder="Quelle est votre Avenue"
                           value={street}
                           onChange={(e) => setStreet(e.target.value)}

                        />
                     </div>
                  </div>

                  {/* numero avaenue and la reférence de l'avenue  */}
                  <div className='grid md:grid-cols-2 gap-4'>

                     {/* numero avenue */}

                     <div className="flex flex-col">
                        <label htmlFor="password" className="text-secondaryColor mb-2">
                           Numéro de l'avenue
                        </label>
                        <input
                           type="text"
                           id="ref"
                           required
                           className="py-2 px-4 sm:py-3  rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondaryColor focus:outline-none placeholder:text-sm"
                           placeholder="Le numéro de votre avenue"
                           value={numberStreet}
                           onChange={(e) => setNumberStreet(e.target.value)}

                        />
                     </div>
                     {/* la reférence de l'avenue */}
                     <div className="flex flex-col">
                        <label htmlFor="password" className="text-secondaryColor mb-2">
                           Reférence
                        </label>
                        <input
                           type="text"
                           id="Avenue"
                           required
                           className="py-2 px-4 sm:py-3  rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondaryColor focus:outline-none placeholder:text-sm"
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
                     {
                        loading ? (<Spinner />) : "Mise à jour"
                     }

                  </button>
               </form>
            </div>
         </div>
      </div>
   )
}
