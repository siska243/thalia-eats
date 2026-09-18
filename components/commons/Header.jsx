"use client";
import {useEffect, useRef} from "react";
import Link from "next/link";
import NavBar from "./NavBar";
import TopBar from "./TopBar";
import logo from "@/public/assets/logo-thalia.png";
import Image from "next/image";

export default function Header() {
  const cadre = useRef(null);

  /*
   * L'en-tete publie sa propre hauteur dans `--header-h`, que les pages
   * consomment pour se decaler. Un ResizeObserver plutot qu'une mesure unique :
   * la barre du haut ne se rend qu'apres montage, et l'en-tete change aussi de
   * hauteur au redimensionnement (la barre passe sur deux lignes en mobile).
   */
  useEffect(() => {
    const element = cadre.current;
    if (!element) return;

    const publier = () => {
      document.documentElement.style.setProperty(
        "--header-h",
        `${Math.round(element.getBoundingClientRect().height)}px`
      );
    };

    publier();
    const observateur = new ResizeObserver(publier);
    observateur.observe(element);
    return () => observateur.disconnect();
  }, []);

  return (
    <header ref={cadre} className="fixed top-0  w-full border-b bg-white z-[9999]">
      <div className="max-w-[1300px] mx-auto px-3 md:px-5 left-0 right-0">
        {/* Top Bar (Visible on all screens) */}
        <TopBar />

        {/* Main Header */}
        <div className="py-2 md:py-4">
          <div className=" flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
              src={logo}
              alt="Thalia Eats"
              width={80}
              height={80}
              className="h-14 w-14 md:h-20 md:w-20"
              priority
            />
            </Link>
            {/* Navigation Bar */}
            <NavBar />
          </div>
        </div>

      </div>
    </header>
  );
}
