
import OrderingDisplay from '@/components/ordering/OrderingDisplay'
import {IoBagCheck} from "react-icons/io5";
import {ProductType, ShopType} from "@/types/main";


interface Props {
    ordering: ShopType[],
    removeProduct: (str: ProductType) => void
}

export default function CommandeList({ordering, removeProduct}: Props) {


    return (
        <div className="border border-gray-300 mt-4 overflow-hidden bg-[#f9f9f9] rounded-xl">
            {/* Header */}
            <div data-aos="fade-up"
                 className="bg-green-700 p-4 w-full h-[120px] flex justify-center items-center gap-4">
        <span className="text-4xl text-white">
          <IoBagCheck/>
        </span>
                <h5 className="text-2xl text-white font-semibold">
                    {
                        "Ma commande"
                    }
                </h5>
            </div>

            {ordering?.length > 0 ? <OrderingDisplay ordering={ordering} removeProduct={removeProduct}/> :
                <p className="p-4 text-gray-600">Votre panier est vide</p>}

        </div>
    );
}
