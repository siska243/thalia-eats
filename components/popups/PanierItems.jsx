import Image from "next/image";
import { MdDeleteForever } from "react-icons/md";
export default function PanierItems({ item, handleDecrement, handleIncrement }) {
  const { product, quantity } = item


  return (
    <div className="bg-[#D9D9D999]/60 p-4 rounded-lg flex md:flex-row flex-col items-center justify-between gap-3 md:gap-0">
      <div className="flex items-center gap-3 flex-row">
        <div className="border-r-2 border-gray-300 pr-4 md:mr-4 mb-2 md:mb-0">
          <Image
            src={product.picture}
            alt={product.title}
            width={80}
            height={80}
            className="object-cover rounded-full w-[60px] h-[60px]"
          />
        </div>
        <div className="flex flex-col items-start">
          <h3 className="text-secondaryColor text-base font-medium">
            {product.title}
          </h3>
          <p className="text-primaryColor font-bold mt-2 text-center md:text-left">{product.price} <span className="text-sm text-secondaryColor">{product.currency.code}</span></p>
        </div>
      </div>

      {/* changer le prix */}


      <div className="flex items-center gap-3">
        {quantity > 1 ? (<button className="w-5 h-5 bg-secondaryColor text-white flex items-center justify-center rounded-full" onClick={handleDecrement}>
          -
        </button>) : (<button className="flex-shrink-0 text-gray-500 hover:text-red-600" onClick={handleDecrement}>
          <MdDeleteForever className="text-3xl " />
        </button>)}

        <input
          readOnly
          value={quantity}
          type="text"
          className="w-[60px] text-center h-10 rounded-md outline-none border border-white bg-white text-primaryColor font-bold"
        />
        <button className="w-5 h-5 bg-secondaryColor text-white flex items-center justify-center rounded-full" onClick={handleIncrement}>
          +
        </button>
      </div>
    </div>
  );
}
