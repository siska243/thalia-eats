import CardList from "./CardList"
import Total from "./Total";
import TotalPay from "./TotalPay"
import Checkout from "./Checkout"
import ConfirmAdress from "@/components/ordering/ConfirmAdress";
export default function CurrentOrderDisplay({ currentOrder }) {

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
            <ConfirmAdress />
            <Checkout />
        </>
    );
}
