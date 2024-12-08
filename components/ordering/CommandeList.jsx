import { IoBagCheck } from "react-icons/io5";
import CardList from "./CardList";
import Total from "./Total";
import TotalPay from "./TotalPay";
import Checkout from "./Checkout";
import { useSelector } from "react-redux";

export default function CommandeList({ ordering, removeProduct }) {

  const currentOrder = useSelector((state) => state.cart?.currentOrder);

  return (
    <div className="border border-gray-300 mt-4 overflow-hidden bg-[#f9f9f9] rounded-xl">
      {/* Header */}
      <div className="bg-green-700 p-4 w-full h-[120px] flex justify-center items-center gap-4">
        <span className="text-4xl text-white">
          <IoBagCheck />
        </span>
        <h5 className="text-2xl text-white font-semibold">Mon Panier</h5>
      </div>

      {/* Contenu du panier */}
      {ordering && ordering.length > 0 ? (
        <>
          {/* Liste des produits */}
          <div>
            {ordering.map((product, index) => (
              <CardList key={index} products={product} removeProduct={removeProduct} />
            ))}
          </div>

          {/* Composants Totaux */}
          <Total currentOrder={currentOrder == undefined ? [] : currentOrder} />
          {/* afficher les prix uniquement quand la commande current existe */}
          {
            currentOrder && currentOrder.length > 0 && (
              <>
                <TotalPay currentOrder={currentOrder} />
                <Checkout />
              </>
            )
          }
        </>
      ) : (
        <p className="p-4 text-gray-600">Votre panier est vide</p>
      )}
    </div>
  );
}
