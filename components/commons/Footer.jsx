import Link from "next/link";
import Image from "next/image";
import {MdOutlineMailOutline, MdOutlineWhatsapp} from "react-icons/md";
import appleImg from "@/public/assets/images/apple-logo.jpg";
import googleImg from "@/public/assets/images/google-logo.png";

/**
 * Le pied de page.
 *
 * L'annee du copyright etait ecrite en dur (« 2025 ») : elle se perime toute
 * seule, et personne ne pense a la corriger.
 */
export default function Footer() {
    return (
        <footer className="w-full bg-surface-sunken">
            <section className="mx-auto grid max-w-[1300px] gap-8 px-4 py-14 sm:px-5 md:grid-cols-2 lg:grid-cols-3">
                <div>
                    <Link
                        href="/"
                        className="text-display font-extrabold text-secondaryColor"
                    >
                        Thalia Eats
                    </Link>

                    <p className="mt-3 max-w-xs text-caption leading-6 text-ink-muted">
                        Les restaurants de Kinshasa, commandés en ligne et livrés chez vous.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                        <Link
                            href="/"
                            className="h-10 w-[120px] overflow-hidden rounded-control"
                        >
                            <Image src={appleImg} className="h-full w-full object-cover" alt="App Store" />
                        </Link>

                        <Link
                            href="/"
                            className="h-10 w-[120px] overflow-hidden rounded-control"
                        >
                            <Image
                                src={googleImg}
                                className="h-full w-full object-cover"
                                alt="Google Play"
                            />
                        </Link>
                    </div>
                </div>

                <nav>
                    <h2 className="mb-4 text-body font-bold text-secondaryColor">
                        Pages légales
                    </h2>

                    <ul className="flex flex-col gap-3">
                        <li>
                            <Link
                                href="/privacy"
                                className="text-caption text-ink-muted underline-offset-4 hover:text-ink hover:underline"
                            >
                                Conditions d&apos;utilisation
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/privacy"
                                className="text-caption text-ink-muted underline-offset-4 hover:text-ink hover:underline"
                            >
                                Politique de confidentialité
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/support"
                                className="text-caption text-ink-muted underline-offset-4 hover:text-ink hover:underline"
                            >
                                Support
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div>
                    <h2 className="mb-4 text-body font-bold text-secondaryColor">Contact</h2>

                    <ul className="flex flex-col gap-3">
                        <li>
                            <a
                                href="mailto:thaliaeat.original@gmail.com"
                                className="flex items-center gap-2 text-caption text-ink-muted underline-offset-4 hover:text-ink hover:underline"
                            >
                                <MdOutlineMailOutline className="shrink-0 text-xl" />
                                <span className="break-all">thaliaeat.original@gmail.com</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://wa.me/33605864276"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-caption text-ink-muted underline-offset-4 hover:text-ink hover:underline"
                            >
                                <MdOutlineWhatsapp className="shrink-0 text-xl" />
                                +33 6 05 86 42 76
                            </a>
                        </li>
                    </ul>
                </div>
            </section>

            <div className="bg-secondaryColor">
                <p className="mx-auto max-w-[1300px] px-4 py-5 text-center text-caption text-white/70 sm:px-5">
                    Thalia Eats © {new Date().getFullYear()}, tous droits réservés.
                </p>
            </div>
        </footer>
    );
}
