import Image from "next/image";
import cookImg from "@/public/assets/images/cook.png";
import Link from "next/link";

export default function SideMenu() {
  const menu = [
    {
      name: "pizzas",
    },
    {
      name: "Garlic Bread",
    },
    {
      name: "Calzone",
    },
    {
      name: "Kebabas",
    },
    {
      name: "Salads",
    },
    {
      name: "Cold drinks",
    },
    {
      name: "Happy Meal",
    },
    {
      name: "Desserts",
    },
    {
      name: "Hot drinks",
    },
    {
      name: "Sauces",
    },
  ];
  return (
    <div className="py-5 border rounded-lg border-[#BCBCBC] bg-[#FBFBFB] overflow-hidden">
      <div className="flex gap-3 pl-5">
        <Image src={cookImg} width={30} height={20} />
        <h3 className="text-2xl font-semibold text-black">Menu</h3>
      </div>
      <ul className="py-5">
        <li className="block bg-secondaryColor text-white">
          <Link
            href="/"
            className="block w-full p-5 text-sm capitalize font-medium"
          >
            Pizzas
          </Link>
        </li>
        {menu.map(({ name }, index) => {
          return (
            <li
              key={index}
              className="block  text-[#282828] hover:bg-secondaryColor hover:text-white"
            >
              <Link
                href="/"
                className="block w-full p-5 text-sm capitalize font-medium"
              >
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
