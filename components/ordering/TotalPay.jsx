import { FaCircleArrowRight, FaCircleArrowDown } from "react-icons/fa6";

export default function TotalPay() {
  return (
    <div className="p-5 border-b border-gray-300">
      <div className="bg-primaryColor p-5 flex items-center justify-between rounded-xl text-white mb-5">
        <p>Total to pay</p>
        <span>€127.90</span>
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
