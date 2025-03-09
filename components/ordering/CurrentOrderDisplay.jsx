import CardList from "./CardList"
import Total from "./Total";
import TotalPay from "./TotalPay"
import Checkout from "./Checkout"
export default function CurrentOrderDisplay({ currentOrder }) {
    console.log("currentOrder dans currentOrder",);

    return (
        <>
            {/* Liste des produits */}
            <div data-aos="fade-up">
                {currentOrder.products.map((product, index) => (
                    <CardList key={index} products={product} />
                ))}
            </div>

            {/* Composants Totaux */}
            <Total currentOrder={currentOrder} />
            <TotalPay currentOrder={currentOrder} />
            <Checkout />
        </>
    );
}
