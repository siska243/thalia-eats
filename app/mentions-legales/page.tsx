import Link from "next/link";

import PageLegale, {SectionLegale} from "@/components/commons/PageLegale";
import {lignesIdentite} from "@/helpers/identite-editeur";

export const metadata = {
    title: "Mentions légales — Thalia",
    description: "L’éditeur du site Thalia, son hébergeur et ses moyens de contact.",
};

/**
 * Les mentions légales.
 *
 * L'identité de l'entreprise vit dans `helpers/identite-editeur.ts`, et les
 * champs vides ne sont PAS affichés : inventer une raison sociale ou un
 * numéro RCCM serait une fausse déclaration, et une mention fausse vaut
 * moins que pas de mention. La page se complète d'elle-même à mesure que le
 * propriétaire les renseigne.
 */
export default function PageMentionsLegales() {
    const lignes = lignesIdentite();

    return (
        <PageLegale titre="Mentions légales" miseAJour="17 octobre 2026">
            <SectionLegale titre="Éditeur du site">
                <dl className="flex flex-col divide-y divide-surface-border rounded-card bg-surface shadow-card">
                    {lignes.map((ligne) => (
                        <div
                            key={ligne.libelle}
                            className="flex flex-wrap justify-between gap-x-4 gap-y-1 px-5 py-3"
                        >
                            <dt className="text-caption text-ink-muted">{ligne.libelle}</dt>
                            <dd className="text-body font-semibold text-ink">{ligne.valeur}</dd>
                        </div>
                    ))}
                </dl>
            </SectionLegale>

            <SectionLegale titre="Propriété intellectuelle">
                <p className="text-ink-muted">
                    Les marques Thalia Eats et Thalia Trans, le logo, les textes et la présentation
                    du site appartiennent à l’éditeur. Les photographies des plats et des
                    enseignes appartiennent aux restaurants partenaires, qui nous autorisent à les
                    afficher. Toute reprise sans accord écrit est interdite.
                </p>
            </SectionLegale>

            <SectionLegale titre="Signaler un contenu">
                <p className="text-ink-muted">
                    Si une fiche de restaurant, une photographie ou un avis vous paraît illicite ou
                    vous porte préjudice, écrivez-nous par le{" "}
                    <Link
                        href="/support"
                        className="font-semibold text-brand-600 underline-offset-4 hover:underline"
                    >
                        support
                    </Link>{" "}
                    en indiquant la page concernée et le motif. Nous examinons chaque signalement
                    et retirons ce qui doit l’être.
                </p>
            </SectionLegale>

            <SectionLegale titre="Vos données">
                <p className="text-ink-muted">
                    Le détail de ce que nous collectons et de vos droits figure dans la{" "}
                    <Link
                        href="/privacy"
                        className="font-semibold text-brand-600 underline-offset-4 hover:underline"
                    >
                        politique de confidentialité
                    </Link>
                    , et le détail des traceurs sur la page{" "}
                    <Link
                        href="/cookies"
                        className="font-semibold text-brand-600 underline-offset-4 hover:underline"
                    >
                        cookies
                    </Link>
                    .
                </p>
            </SectionLegale>
        </PageLegale>
    );
}
