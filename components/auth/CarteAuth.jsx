import Image from "next/image";
import Link from "next/link";
import logo from "@/public/assets/logo-thalia.png";

/**
 * Le cadre commun aux ecrans de connexion et d'inscription.
 *
 * Les deux pages redigeaient leur propre cadre, avec des largeurs, des marges
 * et des ombres differentes : on changeait visiblement de site en passant de
 * l'une a l'autre.
 */
export default function CarteAuth({titre, sousTitre, large = false, children, bas}) {
    return (
        <div className="flex min-h-svh items-center justify-center bg-surface-sunken px-4 pb-12 pt-[calc(var(--header-h)+24px)]">
            <div
                className={`w-full rounded-card bg-surface p-6 shadow-card sm:p-8 md:p-10 ${
                    large ? "max-w-3xl" : "max-w-md"
                }`}
            >
                <div className="mb-8 text-center">
                    <Link href="/" className="inline-block">
                        <Image src={logo} alt="Thalia Eats" width={72} height={72} />
                    </Link>

                    <h1 className="mt-4 text-display font-extrabold text-secondaryColor">
                        {titre}
                    </h1>

                    {sousTitre ? (
                        <p className="mt-2 text-body text-ink-muted">{sousTitre}</p>
                    ) : null}
                </div>

                {children}

                {bas ? (
                    <p className="mt-6 text-center text-body text-ink-muted">{bas}</p>
                ) : null}
            </div>
        </div>
    );
}
