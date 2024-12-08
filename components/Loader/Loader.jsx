import logo from "@/public/assets/logo-thalia.png";
import Image from "next/image";
export default function Loader() {
    return (
        <div className="flex items-center justify-center h-full bg-white z-[999] absolute top-0 right-0 left-0">
            <div className="flex flex-col items-center">
                {/* Image avec une animation */}
                <Image
                    src={logo} // Remplacez par le chemin de votre image
                    alt="Logo de thalia eats"
                    className="w-24 h-24 animate-spin-slow"
                    height={600}
                    width={600}
                />
            </div>
        </div>
    );
}