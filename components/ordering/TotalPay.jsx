import { calcul_price, total } from "@/helpers/calculePrice";
import { FaCircleArrowRight, FaCircleArrowDown } from "react-icons/fa6";

export default function TotalPay({ currentOrder }) {

  const frais_livraison = currentOrder ? currentOrder.price_delivery : 0;
  const service_price = currentOrder ? currentOrder.price_service : 0
  const { products } = currentOrder
  const total_prix = total(calcul_price(products), service_price, frais_livraison)

  
  return (
    <div data-aos="fade-up" className="p-5 border-b border-gray-300">
      <div className="bg-primaryColor p-5 flex items-center justify-between rounded-xl text-white mb-5 ">
        <p  className="">Total à payer</p>
        <span>{total_prix} {products[0]?.currency?.code} </span>
      </div>
    </div>
  );
}
