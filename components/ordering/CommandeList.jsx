import { IoBagCheck } from "react-icons/io5";
import CardList from "./CardList";
import Total from "./Total";
import TotalPay from "./TotalPay";
import Checkout from "./Checkout";

export default function CommandeList() {
  const commandeList = [
    {
      name: "Farm House Xtreme Pizza",
      contenu: "1 McChicken™, 1 Big Mac™, ",
      prix: 27.9,
    },
    {
      name: "Farm House Xtreme Pizza",
      contenu: "1 McChicken™, 1 Big Mac™,  1 Royal Cheeseburger",
      prix: 27.9,
    },
    {
      name: "Farm House Xtreme Pizza",
      contenu: "1 McChicken™, 1 Big Mac™,  1 Royal Cheeseburger",
      prix: 27.9,
    },
    {
      name: "Farm House Xtreme Pizza",
      contenu: "1 McChicken™, 1 Big Mac™,  1 Royal Cheeseburger",
      prix: 27.9,
    },
  ];
  return (
    <div className="border border-gray-300 mt-4 overflow-hidden bg-[#f9f9f9] rounded-xl">
      <div className="bg-green-700 p-4 w-full h-[120px] flex justify-center items-center gap-4">
        <span className="text-4xl text-white">
          <IoBagCheck />
        </span>
        <h5 className="text-2xl text-white font-semibold">My Basket</h5>
      </div>

      {/* commande items */}

      <div>
        {commandeList.map((list, index) => {
          return <CardList key={index} list={list} />;
        })}
      </div>

      {/* total  componant*/}
      <Total />
      {/* total à payer commponent */}
      <TotalPay />
      {/* checkout component */}
      <Checkout />
    </div>
  );
}
