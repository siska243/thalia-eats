"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdAccountCircle } from "react-icons/md";
import { HiMiniBars3CenterLeft } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import Account from "../account/Account";

export default function NavBar() {
  const { user } = useGetCurrentUser();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const links = [
    { path: "/", name: "Accueil" },
    { path: "/restaurant", name: "Restaurant" },
    { path: "/ordering", name: "Commande" },
  ];

  const pathname = usePathname();

  return (
    <>
      {/* Menu pour grand écran */}
      <nav className="hidden md:flex items-center md:gap-4 lg:gap-6">
        <ul className="flex gap-6">
          {links.map(({ path, name }, index) => (
            <Link
              key={index}
              href={path}
              className={`link-animation text-secondaryColor ${path === pathname &&
                "before:bg-primaryColor text-white before:h-full"
                }`}
            >
              {name}
            </Link>
          ))}
        </ul>
        {!user ? (
          <Link
            href="/login"
            className="py-3 px-6 rounded-full bg-secondaryColor border border-secondaryColor"
          >
            {/* bouton login and sign up */}
            <button className="flex gap-2 items-center">
              <MdAccountCircle className="text-primaryColor text-xl" />
              <span className="text-thirdColor">Login/SignUp</span>
            </button>
          </Link>
        ) : (
          <Account account={user} isMobile={false} />
        )}
      </nav>
      {/* *************************$ */}
      {/* Bouton mobile */}
      <button
        className="md:hidden border p-3 rounded-xl bg-secondaryColor text-primaryColor"
        onClick={toggleMenu}
      >
        <HiMiniBars3CenterLeft
          className={`text-xl ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
        />
      </button>

      {/* ***************** */}
      {/* Menu mobile */}
      <div
        className={`fixed top-0 right-0 w-full h-screen  z-[9999] transform transition-transform duration-500 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"
          } bg-secondaryColor/80 backdrop-blur-md `}
      >
        {/* Bouton de fermeture dans le menu mobile */}
        <button
          className="absolute top-10 right-10 text-primaryColor text-2xl"
          onClick={() => setIsMenuOpen(false)}
        >
          <IoMdClose />
        </button>
        {/* ********************* */}
        {/* Liens du menu mobile */}
        <ul className="flex flex-col items-center gap-6 mt-20">
          {links.map(({ path, name }, index) => (
            <Link
              key={index}
              href={path}
              className={`link-animation  text-2xl text-white py-2 px-6 block ${path === pathname && "before:bg-primaryColor  before:h-full"
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {name}
            </Link>
          ))}
        </ul>

        {/* Bouton Login/SignUp dans le menu mobile */}
        {!user ? (
          <Link
            href="/login"
            className="py-3 px-6 rounded-full bg-secondaryColor border border-secondaryColor"
          >
            {/* bouton login and sign up */}
            <button className="flex gap-2 items-center">
              <MdAccountCircle className="text-primaryColor text-xl" />
              <span className="text-thirdColor">Login/SignUp</span>
            </button>
          </Link>
        ) : (
          <Account account={user} isMobile={true} />
        )}
      </div>
    </>
  );
}
