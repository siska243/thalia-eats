import React, {useState} from "react";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import ListInfoUser from "./ListInfoUser";
import {
    MdAccountCircle,
    MdEmail,
    MdPhoneAndroid,
    MdLocationPin,
} from "react-icons/md";
import {useDispatch, useSelector} from "react-redux";
import ValiderCommande from "./ValiderCommande";
import useCreateOrdering, {notification} from "@/hooks/useCreateOrdering";
import useCart from "@/hooks/useCart";
import Spinner from "@/components/Loader/Spinner";

export default function UserInfo({handlerNewAdresse, isNewAdresse}) {
    const {user} = useGetCurrentUser();
    const {handleCustomOrder}=useCart()

    const [isLoading,setIsLoading]=useState(false)


    return (
        <>
            <div data-aos="fade-up" className="box-shadow-custom p-5 rounded-xl">
                {/* Les informations du client */}
                <p className="mb-5 text-primaryColor uppercase text-base font-semibold ">
                    Les informations du client
                </p>

                {user && user.user ? (
                    <div className="flex flex-col ">
                        <ListInfoUser
                            title={user?.user?.full_name}
                            Icon={MdAccountCircle}
                        />
                        <ListInfoUser title={user?.user?.email} Icon={MdEmail}/>
                        <ListInfoUser title={user?.user?.phone} Icon={MdPhoneAndroid}/>
                        {user?.user?.principal_adresse && (
                            <ListInfoUser
                                title={`${user?.user?.principal_adresse}, N°${user?.user?.number_street}, C/${user?.user?.town_id?.title}`}
                                Icon={MdLocationPin}
                            />
                        )}

                        {/* s'assurer qu'il y a bel et bien une commande dans le panier */}


                        <div>
                            {/* Section pour activer/désactiver l'utilisation de l'adresse */}
                            <p className="mt-4 text-primaryColor font-semibold">Si vous avez déjà enregistré votre
                                adresse.</p>
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-secondaryColor">
                                    Utilisez-la comme informations de livraison ?
                                </p>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={!isNewAdresse}
                                        onChange={handlerNewAdresse}
                                        className="sr-only peer"
                                        aria-label="Utiliser cette adresse comme informations de livraison"
                                    />
                                    <div
                                        className={`w-11 h-6 rounded-full transition-colors ${
                                            !isNewAdresse ? "bg-primaryColor" : "bg-gray-200"
                                        }`}
                                    >
                        <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                !isNewAdresse ? "translate-x-5" : "translate-x-0"
                            }`}
                        ></span>
                                    </div>
                                </label>
                            </div>


                            {/* Bouton Enregistrer */}
                            <div data-aos="fade-up" className="mt-8">
                                {!isNewAdresse && (
                                    <button
                                        disabled={isLoading}

                                        onClick={()=>{

                                            const data=user?.user
                                            const current_address= {
                                                    adresse: `${data.principal_adresse} ${data.street} ${data.number_street} ${data?.town_id?.title}`,
                                                    town: data?.town_id,
                                                    reference: "",
                                                    street: data.street,
                                                    number_street: data.number_street
                                            }

                                            localStorage.setItem("thalia_eat_order_delivery_address",JSON.stringify(current_address))

                                            setIsLoading(true)

                                            setTimeout(()=>{
                                                handleCustomOrder(current_address?.town)
                                                notification("Votre adresse est enregistré avec success")
                                                setIsLoading(false)
                                            },1000)
                                        }}
                                        className="px-10 py-2 text-sm sm:text-base sm:py-3 bg-secondaryColor text-white rounded-lg font-semibold hover:bg-secondaryColor/90 focus:ring-2 focus:ring-secondaryColor focus:ring-opacity-50 inline-block">
                                        {isLoading ? <Spinner /> : "Enregistrer votre adresse de livraison"}
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>
                ) : (
                    <p className="text-gray-500">
                        Veuillez vous connecter pour voir ces informations.
                    </p>
                )}
            </div>
        </>
    );
}
