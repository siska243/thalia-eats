"use client";

import Image from "next/image";
import Link from "next/link";
import fondImage from "@/public/assets/images/homeEat.png";
import {formatPrix} from "@/helpers/openingHours";
import {useNomsCommerciaux} from "@/hooks/useRental";

/**
 * Le hero, pleine page.
 *
 * Il tenait dans un cadre clair de 600 pixels, avec une pizza detouree et une
 * forme orange. Rien n'y donnait faim : la photo etait un decor, pas le sujet.
 *
 * Ici la photo occupe tout, et le texte se pose dessus. Un voile degrade part
 * du bleu nuit de la marque a gauche, la ou le texte doit se lire, et s'efface
 * a droite pour laisser la nourriture visible. C'est ce degrade qui tient la
 * lisibilite : sans lui, du blanc sur une photo est un pari.
 *
 * Les trois plats en bas sont ceux de l'API, avec leur restaurant et leur
 * prix. Ils remplacent trois fausses notifications redigees en anglais —
 * « We've Received your order! » — sur un site entierement francais.
 *
 * L'en-tete est `fixed` : il ne prend pas de place dans le flux, et la photo
 * demarre donc a zero, derriere lui. C'est seulement le *contenu* du hero qui
 * est decale vers le bas pour ne pas passer sous le menu. Decaler la section
 * entiere, comme le font les neuf autres pages, laissait une bande blanche
 * entre le menu et la photo.
 *
 * Pas de `placeholder="blur"` : `next.config.mjs` met `images.unoptimized` a
 * `true`, donc le point d'entree /_next/image est desactive. L'image floutee
 * de transition partait quand meme le chercher et recoltait un 404 a chaque
 * chargement de page.
 *
 * La hauteur est en svh plutot qu'en vh : sur mobile, vh compte la barre
 * d'adresse du navigateur et le bas du hero passait sous l'ecran.
 */
export default function Hero({previews = []}) {
    // Le nom commercial vient des reglages, jamais d'une chaine ecrite ici.
    const noms = useNomsCommerciaux();

    const plats = previews.slice(0, 3);

    return (
        <section className="relative">
            <div className="relative min-h-[620px] overflow-hidden md:min-h-svh">
                <Image
                    src={fondImage}
                    alt=""
                    aria-hidden
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center"
                />

                {/*
                  * Un fond uni sous le degrade : sur un ecran etroit la bande
                  * droite du degrade horizontal devenait presque transparente,
                  * et le texte se posait sur la photo sans contraste.
                  */}
                <div className="absolute inset-0 bg-secondaryColor/60 md:bg-transparent" aria-hidden />

                <div
                    className="absolute inset-0 bg-gradient-to-r from-secondaryColor via-secondaryColor/85 to-secondaryColor/20"
                    aria-hidden
                />
                <div
                    className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-secondaryColor/90 to-transparent"
                    aria-hidden
                />

                <div className="relative mx-auto flex min-h-[620px] w-full max-w-7xl flex-col justify-center px-4 pb-14 pt-[var(--header-h)] sm:px-6 lg:px-8 md:min-h-svh">
                    <div className="max-w-2xl">
                        {/* Les deux lignes de produit annoncees des la
                            premiere ligne : l'accueil ne parlait que de repas,
                            et rien n'y laissait deviner qu'on peut aussi
                            reserver une voiture avec chauffeur. */}
                        <p className="text-body text-brand-300">
                            Repas livrés et voitures avec chauffeur, à Kinshasa
                        </p>

                        <h1 className="mt-4 text-[38px] font-extrabold leading-[1.03] tracking-tight text-white sm:text-[54px] lg:text-[68px]">
                            Qu&apos;est-ce qu&apos;on mange aujourd&apos;hui&nbsp;?
                        </h1>

                        <p className="mt-6 max-w-lg text-body leading-7 text-white/80">
                            Choisissez un restaurant, composez votre commande, payez par mobile
                            money. Un livreur s&apos;en charge. Besoin de vous déplacer&nbsp;?{" "}
                            <Link
                                href="/location"
                                className="font-semibold text-brand-300 underline-offset-4 hover:underline"
                            >
                                {noms.rental}
                            </Link>{" "}
                            vous trouve une voiture avec chauffeur, à l&apos;heure ou à la journée.
                        </p>

                        <div className="mt-9 flex flex-wrap gap-3">
                            <Link
                                href="/restaurant"
                                className="inline-flex items-center justify-center rounded-pill bg-brand-500 px-8 py-4 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300"
                            >
                                Voir les restaurants
                            </Link>

                            <Link
                                href="/location"
                                className="inline-flex items-center justify-center rounded-pill border border-white/30 px-7 py-4 text-body font-semibold text-white backdrop-blur-sm transition-colors duration-150 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300"
                            >
                                Réserver une voiture
                            </Link>

                            <Link
                                href="/tracking"
                                className="inline-flex items-center justify-center rounded-pill px-5 py-4 text-body font-semibold text-white/80 transition-colors duration-150 hover:text-white"
                            >
                                Mes commandes
                            </Link>
                        </div>
                    </div>

                    {plats.length ? (
                        <ul className="mt-14 grid gap-3 sm:grid-cols-3 lg:max-w-3xl">
                            {plats.map((plat) => (
                                <li key={plat.uid ?? plat.slug}>
                                    <Link
                                        href={`/restaurant/${plat.restaurant?.slug ?? ""}`}
                                        className="flex h-full items-center gap-3 rounded-card bg-white/10 p-3 backdrop-blur-md ring-1 ring-white/20 transition-colors duration-200 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300"
                                    >
                                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-control">
                                            <Image
                                                src={plat.picture}
                                                alt={plat.title}
                                                fill
                                                sizes="48px"
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="line-clamp-1 text-caption font-semibold text-white">
                                                {plat.title}
                                            </p>
                                            <p className="line-clamp-1 text-caption text-white/60">
                                                {plat.restaurant?.name}
                                            </p>
                                        </div>

                                        {plat.price ? (
                                            <span className="shrink-0 text-caption font-bold text-brand-300">
                                                {formatPrix(plat.price, plat.currency?.code)}
                                            </span>
                                        ) : null}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
