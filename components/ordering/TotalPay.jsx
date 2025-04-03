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
      <div className="flex flex-col gap-3">
        <button className="flex items-center justify-between w-full p-3 border border-gray-300 rounded-full text-sm">
          Choose your free item..
          <span className="text-gray-500 text-xl">
            <FaCircleArrowDown />
          </span>
        </button>
        <button className="flex items-center justify-between w-full p-3 border border-gray-300 rounded-full text-sm">
          Apply Coupon Code here
          <span className="text-green-500 text-xl">
            <FaCircleArrowRight />
          </span>
        </button>
      </div>
    </div>
  );
}
