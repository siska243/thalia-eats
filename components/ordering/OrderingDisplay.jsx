import { useSelector } from "react-redux";
import CardList from "./CardList";
import Total from "./Total";

export default function OrderingDisplay({ ordering, removeProduct }) {
    const { currentOrder } = useSelector((state) => state.cart);
    return (
        <>
            {/* Liste des produits */}
            <div>
                {ordering.map((product, index) => (
                    <CardList key={index} products={product} removeProduct={removeProduct} />
                ))}
            </div>
            <Total currentOrder={currentOrder ? currentOrder : []} ordering={ordering ? ordering : []} />
        </>
    );
}
