import { FaCircleArrowRight } from "react-icons/fa6";

export default function Checkout() {
  return (
    <div>
      <div className="p-5">
        <button className="p-4 flex items-center justify-center gap-4 w-full bg-green-700 rounded-xl text-white ">
          <span>
            <FaCircleArrowRight />
          </span>
          <span className="text-lg font-medium">Checkout!</span>
        </button>
      </div>
    </div>
  );
}
