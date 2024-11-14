import { MdDeleteForever } from "react-icons/md";
import Total from "./Total";

export default function CardList({ list }) {
  return (
    <div className="py-5 px-4 border-b border-gray-300">
      {/* list content */}
      <div className="flex items-center gap-3 justify-between">
        <div className="flex gap-3">
          {/* plat quantité */}
          <p className="bg-primaryColor flex items-center w-[40px] h-[40px] rounded-full flex-shrink-0 justify-center text-white text-lg font-medium">
            1 <span>X</span>
          </p>
          {/* contenu de plat commandé */}
          <div className="flex flex-col gap-2">
            {/* le prix */}
            <div className="flex items-center text-green-700 font-semibold">
              <span>€</span>
              <p>{list.prix}</p>
            </div>
            {/* nom et description */}
            <div>
              <h2 className="text-black text-base font-semibold">
                {list.name}
              </h2>
              <p className="text-xs">{list.contenu}</p>
            </div>
          </div>
        </div>

        {/* bouton suppresion */}

        <button className="flex-shrink-0 text-gray-500">
          <a href="">
            <MdDeleteForever className="text-3xl " />
          </a>
        </button>
      </div>
    </div>
  );
}
