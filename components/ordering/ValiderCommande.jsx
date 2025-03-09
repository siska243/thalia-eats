import React from 'react'
import ListInfoUser from './ListInfoUser';
import { MdAccountCircle, MdPhoneAndroid, MdLocationPin } from "react-icons/md";

export default function ValiderCommande({ currentOrder }) {
    const { user } = currentOrder;

    // fonction pour valider la commande
    return (
        <div data-aos="fade-up">
            <p className='mb-5 text-primaryColor uppercase text-base font-semibold '>
                Coordonnées de la commande
            </p>
            <ListInfoUser title={user?.full_name} Icon={MdAccountCircle} />
            <ListInfoUser title={user?.phone} Icon={MdPhoneAndroid} />
            <ListInfoUser currentOrder={currentOrder} Icon={MdLocationPin} Isdevery_address={true} />
        </div>
    )
}
