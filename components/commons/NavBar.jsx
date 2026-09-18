"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {MdAccountCircle} from "react-icons/md";
import {HiMiniBars3CenterLeft} from "react-icons/hi2";
import {IoMdClose} from "react-icons/io";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import Account from "../account/Account";

/**
 * La navigation principale.
 *
 * Trois corrections :
 *
 * - deux entrees etaient restees en anglais sur un site francais : « Cart »
 *   pour le panier, et « Login/SignUp » pour la connexion.
 * - le panneau mobile n'avait pas de `md:hidden` : il restait monte sur
 *   desktop, simplement pousse hors cadre par une translation. Ouvert par un
 *   raccourci clavier ou un changement de largeur, il recouvrait la page.
 * - il mesurait `h-screen`, donc `100vh`. Sur mobile, `vh` compte la barre
 *   d'adresse du navigateur : le bas du menu passait sous l'ecran, et le
 *   dernier lien devenait inatteignable. `svh` mesure la hauteur reellement
 *   visible.
 *
 * Le defilement de la page est aussi bloque pendant que le menu est ouvert :
 * sans ca, faire glisser le menu faisait defiler la page derriere lui.
 */
export default function NavBar() {
    const {user} = useGetCurrentUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const links = [
        {path: "/", name: "Accueil"},
        {path: "/restaurant", name: "Restaurants"},
        {path: "/ordering", name: "Panier"},
        {path: "/tracking", name: "Ma commande"},
        {path: "/historique", name: "Historique"},
    ];

    useEffect(() => {
        if (!isMenuOpen) return;

        const precedent = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = precedent;
        };
    }, [isMenuOpen]);

    /*
     * Naviguer ferme le menu : sans ca il restait ouvert sur la page suivante.
     *
     * Ajuste pendant le rendu plutot que dans un effet — c'est le motif que
     * React documente pour reagir au changement d'une valeur. Dans un effet,
     * la page suivante s'affichait une fraction de seconde avec le menu encore
     * ouvert par-dessus, avant le second rendu qui le refermait.
     */
    const [pathnamePrecedent, setPathnamePrecedent] = useState(pathname);

    if (pathname !== pathnamePrecedent) {
        setPathnamePrecedent(pathname);
        setIsMenuOpen(false);
    }

    return (
        <>
            <nav className="hidden items-center md:flex md:gap-4 lg:gap-6">
                <ul className="flex gap-5 lg:gap-6">
                    {links.map(({path, name}) => (
                        <li key={path}>
                            <Link
                                href={path}
                                aria-current={path === pathname ? "page" : undefined}
                                className={`link-animation text-secondaryColor ${
                                    path === pathname
                                        ? "before:bg-primaryColor text-white before:h-full"
                                        : ""
                                }`}
                            >
                                {name}
                            </Link>
                        </li>
                    ))}
                </ul>

                {!user ? (
                    <Link
                        href="/login"
                        className="flex items-center gap-2 rounded-pill border border-secondaryColor bg-secondaryColor px-6 py-3 transition-opacity duration-150 hover:opacity-90"
                    >
                        <MdAccountCircle className="text-xl text-primaryColor" />
                        <span className="text-thirdColor">Connexion</span>
                    </Link>
                ) : (
                    <Account account={user} isMobile={false} />
                )}
            </nav>

            <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Ouvrir le menu"
                aria-expanded={isMenuOpen}
                className="rounded-control border bg-secondaryColor p-3 text-primaryColor md:hidden"
            >
                <HiMiniBars3CenterLeft className="text-xl" />
            </button>

            <div
                className={`fixed right-0 top-0 z-[9999] h-svh w-full overflow-y-auto bg-secondaryColor/95 backdrop-blur-md transition-transform duration-300 ease-in-out md:hidden ${
                    isMenuOpen ? "translate-x-0" : "pointer-events-none translate-x-full"
                }`}
                aria-hidden={!isMenuOpen}
            >
                <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Fermer le menu"
                    className="absolute right-6 top-8 p-2 text-2xl text-primaryColor"
                >
                    <IoMdClose />
                </button>

                <ul className="mt-24 flex flex-col items-center gap-5">
                    {links.map(({path, name}) => (
                        <li key={path}>
                            <Link
                                href={path}
                                aria-current={path === pathname ? "page" : undefined}
                                className={`link-animation block px-6 py-2 text-2xl text-white ${
                                    path === pathname ? "before:h-full before:bg-primaryColor" : ""
                                }`}
                            >
                                {name}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="mt-8 px-6 pb-12">
                    {!user ? (
                        <Link
                            href="/login"
                            className="mx-auto flex max-w-xs items-center justify-center gap-2 rounded-pill border border-primaryColor px-6 py-4"
                        >
                            <MdAccountCircle className="text-xl text-primaryColor" />
                            <span className="text-thirdColor">Connexion</span>
                        </Link>
                    ) : (
                        <Account account={user} isMobile={true} />
                    )}
                </div>
            </div>
        </>
    );
}
