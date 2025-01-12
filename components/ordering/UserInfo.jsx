import React from 'react'
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import ListInfoUser from "./ListInfoUser"
import { MdAccountCircle, MdEmail, MdPhoneAndroid, MdLocationPin } from "react-icons/md";
import { useSelector } from 'react-redux';
import ValiderCommande from "./ValiderCommande"
import useCreateOrdering from '@/hooks/useCreateOrdering';


export default function UserInfo({ handlerNewAdresse, isNewAdresse }) {
    const { user } = useGetCurrentUser();
    const currentOrder = useSelector((state) => state.cart?.currentOrder);
    const { ordering } = useCreateOrdering()
    const hasCurrentOrder = Array.isArray(currentOrder) && currentOrder.length > 0;
    return (
        <>
            {hasCurrentOrder ? (
                // Si currentOrder existe
                <div className="box-shadow-custom p-5 rounded-xl">

                    <ValiderCommande currentOrder={currentOrder} />
                </div>
            ) : (
                // Sinon, afficher le reste
                <div className="box-shadow-custom p-5 rounded-xl">
                    {/* Les informations du client */}
                    <p className='mb-5 text-primaryColor uppercase text-base font-semibold '>
                        Les informations du client
                    </p>

                    {user && user.user ? (
                        <div className='flex flex-col '>
                            <ListInfoUser title={user?.user?.full_name} Icon={MdAccountCircle} />
                            <ListInfoUser title={user?.user?.email} Icon={MdEmail} />
                            <ListInfoUser title={user?.user?.phone} Icon={MdPhoneAndroid} />
                            {
                                user.user.principal_adresse && (
                                    <ListInfoUser title={`${user?.user?.principal_adresse}, N°${user?.user?.number_street}, C/${user?.user?.town_id?.title}`} Icon={MdLocationPin} />
                                )
                            }

                            {/* s'assurer qu'il y a bel et bien une commande dans le panier */}


                            {ordering && ordering.length > 0 && (
                                <div>
                                    {/* Section pour activer/désactiver l'utilisation de l'adresse */}
                                    <div className="flex items-center justify-between mt-4">
                                        <p className="text-secondaryColor">
                                            Utiliser cette adresse comme informations de livraison ?
                                        </p>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            {/* Checkbox pour basculer */}
                                            <input
                                                type="checkbox"
                                                checked={!isNewAdresse} // Contrôle basé sur l'état
                                                onChange={handlerNewAdresse} // Fonction de bascule
                                                className="sr-only peer"
                                                aria-label="Utiliser cette adresse comme informations de livraison"
                                            />
                                            <div className={`w-11 h-6 rounded-full transition-colors ${!isNewAdresse ? 'bg-primaryColor' : 'bg-gray-200'}`}>
                                                <span
                                                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${!isNewAdresse ? "translate-x-5" : "translate-x-0"}`}
                                                ></span>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Bouton Enregistrer */}
                                    <div className='mt-4'>
                                        {!isNewAdresse && (
                                            <button className="px-10 py-2 text-sm sm:text-base sm:py-3 bg-secondaryColor text-white rounded-lg font-semibold hover:bg-secondaryColor/90 focus:ring-2 focus:ring-secondaryColor focus:ring-opacity-50 inline-block">
                                                Enregistrer
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-500">Veuillez vous connecter pour voir ces informations.</p>
                    )}
                </div>
            )}
        </>
    );



}