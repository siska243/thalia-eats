import { useSelector } from "react-redux";
import CardList from "./CardList";
import Total from "./Total";
import ConfirmAddress from "@/components/ordering/ConfirmAdress";
import Checkout from "@/components/ordering/Checkout";

export default function OrderingDisplay({ ordering, removeProduct }) {

    return (
        <>
            {/* Liste des produits */}
            <div>
                {ordering.map((product, index) => (
                    <CardList key={index} products={product} removeProduct={removeProduct} />
                ))}
            </div>
            <Total currentOrder={ordering ?? []} ordering={ordering ?? []} />
            <ConfirmAddress />
            <Checkout />
        </>
    );
}
