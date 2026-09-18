import CardList from "./CardList";
import Total from "./Total";
import ConfirmAddress from "@/components/ordering/ConfirmAdress";
import Checkout from "@/components/ordering/Checkout";

/** Le contenu du panier : les lignes, le total, l'adresse, le paiement. */
export default function OrderingDisplay({ordering, removeProduct}) {
    return (
        <>
            <ul>
                {ordering.map((product, index) => (
                    <CardList key={index} products={product} removeProduct={removeProduct} />
                ))}
            </ul>

            <Total />
            <ConfirmAddress />
            <Checkout />
        </>
    );
}
