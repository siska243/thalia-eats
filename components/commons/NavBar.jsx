"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdAccountCircle } from "react-icons/md";

export default function NavBar() {
  const links = [
    {
      path: "/",
      name: "Home",
    },

    {
      path: "/restaurants",
      name: "Restaurants",
    },
    // {
    //   path: "/track-order",
    //   name: "track order",
    // },
    {
      path: "/ordering",
      name: "Ordering",
    },
  ];
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-6">
      <ul className="flex gap-6">
        {links.map(({ path, name }, index) => {
          return (
            <Link
              key={index}
              href={path}
              className={`link-animation text-secondaryColor ${
                path === pathname &&
                "before:bg-primaryColor text-white before:h-full"
              }`}
            >
              {name}
            </Link>
          );
        })}
      </ul>
      <Link
        href="login"
        className="py-3 px-6  rounded-full bg-secondaryColor border border-secondaryColor"
      >
        <button className="flex gap-2 items-center">
          <MdAccountCircle className="text-primaryColor text-xl" />
          <span className="text-thirdColor">Login/SignUp</span>
        </button>
      </Link>
    </nav>
  );
}
