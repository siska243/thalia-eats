import Link from "next/link";
import appleImg from "@/public/assets/images/apple-logo.jpg";
import googleImg from "@/public/assets/images/google-logo.png";
import Image from "next/image";

import {MdOutlineMailOutline, MdOutlineWhatsapp} from "react-icons/md";

export default function Footer() {
    return (
        <footer className="bg-[#D9D9D9] w-full">
            <section className="max-w-[1300px] mx-auto px-5 py-16 grid md:grid-cols-2 lg:grid-cols-3  gap-5">
                {/* Colonne 1 */}
                <div className="">
                    <Link
                        href="/"
                        className="text-secondaryColor text-2xl md:text-4xl font-bold"
                    >
                        ThaliaEats
                    </Link>
                    <div className="flex gap-1 mt-4 flex-wrap sm:flex-nowrap">
                        <Link
                            href="/"
                            className="w-[120px] h-[40px] rounded-md overflow-hidden"
                        >
                            <Image src={appleImg} className="h-full" alt="logo AppStore"/>
                        </Link>
                        <Link
                            href="/"
                            className="w-[120px] h-[40px] rounded-md overflow-hidden"
                        >
                            <Image
                                src={googleImg}
                                className="h-full"
                                alt="logo Google PlayStore"
                            />
                        </Link>
                    </div>
                    {/* <p className="font-normal text-base text-black max-w-[300px] mt-4">
            Entreprise # 490039-445, Enregistrée auprès de la Chambre des
            entreprises.
          </p> */}
                </div>

                {/* Colonne 2 */}
                <div className="">
                    <h5 className="mb-4 my-8 md:my-0 md:mb-8 text-base font-semibold">
                        Pages légales
                    </h5>
                    <div className="flex flex-col gap-3">
                        <Link href="/" className="text-sm font-normal underline">
                            Conditions d'utilisation
                        </Link>
                        <Link href="/" className="text-sm font-normal underline">
                            Confidentialité
                        </Link>
                    </div>
                </div>

                {/* Colonne 3 */}
                <div className="">
                    <h5 className="mb-4 my-8 md:my-0 md:mb-8 text-base font-semibold">
                        Contact
                    </h5>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2 items-center">
              <span className="text-xl">
                <MdOutlineMailOutline/>
              </span>
                            <Link href="mailto:thaliaeat.original@gmail.com" className="text-base font-[500] underline">
                                thaliaeat.original@gmail.com
                            </Link>
                        </div>
                        <div className="flex gap-2 items-center">
              <span className="text-xl">
                <MdOutlineWhatsapp/>
              </span>
                            <Link href="https://wa.me/33605864276" className="text-base font-[500] underline">
                                +33 6 05 86 42 76
                            </Link>
                        </div>

                    </div>
                </div>
            </section>

            {/* Section du bas */}
            <section className="bg-secondaryColor ">
                <div className="py-5 max-w-[1300px] mx-auto px-5">
                    <p className="text-xs text-center text-gray-300">
                        ThaliaEats Copyright 2025, Tous droits réservés.
                    </p>
                </div>
            </section>
        </footer>
    );
}
