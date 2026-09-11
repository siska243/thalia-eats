"use client"
import React, {useEffect} from 'react'
import {useRouter} from 'next/navigation'
import {MdCancel} from "react-icons/md";

/**
 * Retour d'un paiement abandonné.
 *
 * Cette page appelait `/commande/cancel` au chargement, c'est-à-dire qu'elle
 * ANNULAIT LA COMMANDE. Abandonner un paiement — fermer l'onglet du
 * prestataire, revenir en arrière, manquer de réseau — détruisait donc la
 * commande, alors que le client voulait seulement réessayer plus tard. Elle
 * vidait aussi le panier, ne laissant rien à reprendre.
 *
 * C'est très probablement l'origine des commandes trouvées en base avec
 * `cancel_at` renseigné et le statut resté à « en attente de paiement » : une
 * annulation partielle, écrite par cette page.
 *
 * Désormais elle n'écrit rien. La commande reste en attente de paiement, et le
 * client repart de `/ordering` pour la régler. L'annulation, elle, reste
 * possible depuis « Mes commandes » — un geste explicite, avec confirmation.
 */
export default function CancelPage() {
    const router = useRouter();

    useEffect(() => {
        if (typeof window === "undefined") return;

        // Seule chose à effacer : la référence du paiement abandonné, que la
        // page d'attente interrogerait sinon indéfiniment. Le panier et la
        // commande ne sont pas touchés.
        localStorage.removeItem("flex_pay_number_order_thalia_eats");
    }, []);

    return (
        <div className="flex items-center justify-center h-screen pt-[150px] bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div data-aos="fade-left"
                 className="bg-white box-shadow-custom rounded-lg p-6 sm:p-8 lg:p-10 max-w-xl w-full text-center">
                <div data-aos="fade-left" className="flex justify-center mb-4 md:mb-6">
                    <MdCancel className="w-12 h-12 md:w-16 md:h-16 text-yellow-500"/>
                </div>
                <h1 data-aos="fade-left" className="text-xl sm:text-2xl font-bold text-yellow-600 mb-4">
                    Paiement annulé
                </h1>
                <p data-aos="fade-left" className="text-sm sm:text-base text-gray-600 mb-6">
                    Votre commande est conservée, elle attend simplement son règlement.
                    Vous pouvez reprendre le paiement quand vous le souhaitez.
                </p>
                <div data-aos="fade-left" className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => router.push("/ordering")}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 sm:px-6 rounded-md transition duration-200 text-sm md:text-base shadow-md hover:shadow-lg"
                    >
                        Reprendre le paiement
                    </button>
                    <button
                        onClick={() => router.push("/historique")}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 sm:px-6 rounded-md transition duration-200 text-sm md:text-base shadow-md hover:shadow-lg"
                    >
                        Mes commandes
                    </button>
                </div>
            </div>
        </div>
    );
}
