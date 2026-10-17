"use client";

import Link from "next/link";
import {MdOutlineMailOutline, MdOutlineWhatsapp} from "react-icons/md";

import {useNomsCommerciaux, useRentalConfig} from "@/hooks/useRental";

/**
 * Le pied de page.
 *
 * Quatre défauts, tous corrigés le 17 octobre à la demande du propriétaire
 * (« dans le web tu améliores le footer ») :
 *
 * 1. IL NE PARLAIT QUE DES REPAS. Thalia Trans est la moitié du produit et
 *    n'y figurait nulle part, alors que le reste du site l'annonce dès le
 *    hero.
 * 2. AUCUNE NAVIGATION DE SERVICE. Une seule colonne de liens légaux : rien
 *    pour revenir aux restaurants, aux courses ou au support. C'est pourtant
 *    ce qu'on cherche dans un pied de page quand on est arrivé en bas.
 * 3. DEUX BOUTONS DE TÉLÉCHARGEMENT QUI MENAIENT À `/`. Promettre une
 *    application et renvoyer sur l'accueil est pire que de ne rien promettre.
 *    Ils sont retirés tant qu'il n'y a pas de fiche à ouvrir.
 * 4. LA MARQUE ÉCRITE EN DUR. Les noms viennent des réglages partout
 *    ailleurs ; ici « Thalia Eats » ne bougeait pas quand on le changeait en
 *    administration. Le numéro WhatsApp aussi vient des réglages, avec repli
 *    sur celui du pied de page.
 */
const LienColonne = ({href, children}) => (
    <li>
        <Link
            href={href}
            className="text-caption text-ink-muted underline-offset-4 hover:text-ink hover:underline"
        >
            {children}
        </Link>
    </li>
);

const Colonne = ({titre, children}) => (
    <nav>
        <h2 className="mb-4 text-body font-bold text-secondaryColor">{titre}</h2>
        <ul className="flex flex-col gap-3">{children}</ul>
    </nav>
);

export default function Footer() {
    const noms = useNomsCommerciaux();
    const {data: config} = useRentalConfig();

    /*
     * Le numéro du service, réglé en administration. Repli sur celui qui
     * figurait ici : mieux vaut un numéro qui a servi qu'aucun numéro le
     * temps que la configuration arrive.
     */
    const whatsapp = config?.whatsapp_number?.trim() || "+33 6 05 86 42 76";
    const whatsappLien = `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`;

    return (
        <footer className="w-full bg-surface-sunken">
            <section className="mx-auto grid max-w-[1300px] gap-10 px-4 py-14 sm:px-5 md:grid-cols-2 lg:grid-cols-4">
                <div className="md:col-span-2 lg:col-span-1">
                    <Link href="/" className="text-title font-extrabold text-secondaryColor">
                        Thalia
                    </Link>

                    <p className="mt-3 max-w-xs text-caption leading-6 text-ink-muted">
                        Deux services à Kinshasa : <strong>{noms.food}</strong> livre les
                        restaurants chez vous, <strong>{noms.rental}</strong> vous trouve une
                        voiture avec chauffeur.
                    </p>
                </div>

                <Colonne titre={noms.food}>
                    <LienColonne href="/restaurant">Les restaurants</LienColonne>
                    <LienColonne href="/ordering">Mon panier</LienColonne>
                    <LienColonne href="/tracking">Suivre ma commande</LienColonne>
                    <LienColonne href="/historique">Mon historique</LienColonne>
                </Colonne>

                <Colonne titre={noms.rental}>
                    <LienColonne href="/location">Louer une voiture</LienColonne>
                    <LienColonne href="/location/courses">Mes courses</LienColonne>
                    <LienColonne href="/partenaires">Devenir partenaire</LienColonne>
                </Colonne>

                <div className="flex flex-col gap-8">
                    <Colonne titre="Informations">
                        <LienColonne href="/cgu">Conditions d&apos;utilisation</LienColonne>
                        <LienColonne href="/privacy">Politique de confidentialité</LienColonne>
                        <LienColonne href="/cookies">Cookies</LienColonne>
                        <LienColonne href="/mentions-legales">Mentions légales</LienColonne>
                        <LienColonne href="/support">Support</LienColonne>
                    </Colonne>

                    <div>
                        <h2 className="mb-4 text-body font-bold text-secondaryColor">Contact</h2>

                        <ul className="flex flex-col gap-3">
                            <li>
                                <a
                                    href="mailto:thaliaeat.original@gmail.com"
                                    className="flex items-center gap-2 text-caption text-ink-muted underline-offset-4 hover:text-ink hover:underline"
                                >
                                    <MdOutlineMailOutline className="shrink-0 text-xl" />
                                    <span className="break-all">
                                        thaliaeat.original@gmail.com
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href={whatsappLien}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-caption text-ink-muted underline-offset-4 hover:text-ink hover:underline"
                                >
                                    <MdOutlineWhatsapp className="shrink-0 text-xl" />
                                    {whatsapp}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <div className="bg-secondaryColor">
                <div className="mx-auto flex max-w-[1300px] flex-col items-center gap-2 px-4 py-5 text-caption text-white/70 sm:flex-row sm:justify-between sm:px-5">
                    {/* L'annee etait ecrite en dur (« 2025 ») : elle se perime
                        toute seule, et personne ne pense a la corriger. */}
                    <p>Thalia © {new Date().getFullYear()}, tous droits réservés.</p>

                    <p>Kinshasa, République démocratique du Congo</p>
                </div>
            </div>
        </footer>
    );
}
