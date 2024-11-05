import Link from "next/link";
import NavBar from "./NavBar";
import TopBar from "./TopBar";

export default function Header() {
  return (
    <div className="max-w-[1300px] mx-auto px-5 z-[1000]">
      <TopBar />
      <header className="bg-white py-16">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-secondaryColor text-3xl font-semibold">
            Thalia<span className="text-primaryColor">Eats</span>
          </Link>
          <NavBar className="flex-1" />
        </div>
      </header>
    </div>
  );
}
