import { FaClock } from "react-icons/fa6";
import CommandeList from "./CommandeList";

export default function Order({ ordering, removeProduct }) {
  return (
    <section>
      {/* top */}
      <div className="p-5 w-full rounded-xl bg-primaryColor h-[120px] flex justify-center items-center gap-4">
        <span>
          <FaClock className="text-3xl text-white" />
        </span>
        <p className="text-white">Open until 3:00 AM</p>
      </div>

      {/* commande list */}
      <CommandeList ordering={ordering === undefined ? [] : ordering} removeProduct={removeProduct} />
    </section>
  );
}
