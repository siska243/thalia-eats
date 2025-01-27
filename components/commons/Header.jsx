"use client";
import Link from "next/link";
import NavBar from "./NavBar";
import TopBar from "./TopBar";
import logo from "@/public/assets/logo-thalia.png";
import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0  w-full border-b bg-white z-[9999]">
      <div className="max-w-[1300px] mx-auto px-3 md:px-5 left-0 right-0">
        {/* Top Bar (Visible on all screens) */}
        <TopBar />

        {/* Main Header */}
        <div className="py-4">
          <div className=" flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image src={logo} alt="logo thalia eat" width={80} height={80} />
            </Link>
            {/* Navigation Bar */}
            <NavBar />
          </div>
        </div>

      </div>
    </header>
  );
}
