import Link from "next/link";
import NavBar from "./NavBar";
import TopBar from "./TopBar";

export default function Header() {
  return (
    <div className="max-w-[1300px] mx-auto sm:px-5 z-[99999] mb-5 sm:mb-0">
      {/* top bar en haut sur écran ecrans */}
      <div className="hidden sm:block">
        <TopBar />
      </div>
      {/* ********** */}
      <header className="bg-white py-2 sm:py-5 md:py-16 relative">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-secondaryColor text-2xl md:text-3xl font-semibold"
          >
            Thalia<span className="text-primaryColor">Eats</span>
          </Link>
          <NavBar className="flex-1" />
        </div>
      </header>
      {/* top bar en bas sur petits ecrans */}
      <div className="block sm:hidden ">
        <TopBar />
      </div>
    </div>
  );
}
