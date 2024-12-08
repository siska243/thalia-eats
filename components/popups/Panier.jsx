import { FaCircleArrowRight } from "react-icons/fa6";

import PanierItems from "./PanierItems";
import useCreateOrdering from "@/hooks/useCreateOrdering";
import Modal from "./Modal"
import Link from "next/link";

export default function Panier({ toggleShowPanier }) {

  const { ordering, handleAddProduct, removeProduct, calculateTotalPrice } = useCreateOrdering()

  return (
    <Modal toggleModal={toggleShowPanier}>
      {
        ordering && ordering.length > 0 ?
          <>
            <div className="py-4 px-6 h-[300px] lg:h-[400px] overflow-y-auto">
              {/* panier items */}
              <p className="mb-5 text-sm text-gray-500">
                Les plats dans votre Panier
              </p>
              <div className="flex flex-col gap-4 overflow-y-scroll">
                {ordering.map((item, index) => {
                  return <PanierItems key={index} item={item}
                    handleDecrement={() => removeProduct(item.product)}
                    handleIncrement={() => handleAddProduct(item.product)}
                  />;
                })}
              </div>
            </div>
            {/* le prix et la commande */}

            <div className="p-5">
              <div className="flex items-center  gap-3 md:gap-5 justify-between flex-col md:flex-row">
                <div className="bg-primaryColor py-3 px-5 rounded-md text-white flex items-center gap-4 flex-shrink-0">
                  <p className="">
                    Total: <span className="font-medium text-lg">{calculateTotalPrice()} </span>
                  </p>
                  <p>USD</p>
                </div>
                <p className="text-sm text-gray-700 font-medium text-center md:text-left">
                  La livraison et les taxes seront calculées à l'étape suivante.
                </p>
              </div>
              {/* **************** */}
              <div className="mt-5 flex items-center gap-3 flex-col md:flex-row md:gap-5 justify-end">
                <button className="text-sm underline text-gray-600" onClick={toggleShowPanier}>Retour</button>
                <Link href="/ordering" className="flex gap-5 items-center bg-green-700 text-white py-3 px-9 rounded-md" onClick={toggleShowPanier}>
                  <FaCircleArrowRight />
                  <span> Etape suivante</span>
                </Link>
              </div>
            </div>
          </>
          : <div className="py-4 px-6 ">
            {/* panier items */}
            <p className="mb-5 text-sm text-gray-500">
              Votre panier est vide
            </p>
          </div>
      }

    </Modal>

  );

}
