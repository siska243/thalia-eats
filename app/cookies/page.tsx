"use client";

import Link from "next/link";

import PageLegale, {ListeLegale, SectionLegale} from "@/components/commons/PageLegale";
import {useConsentement} from "@/providers/consentement-provider";

/**
 * Le détail des traceurs, et le moyen de revenir sur son choix.
 *
 * Une page de cookies qui ne liste pas les traceurs réels n'informe
 * personne. Celle-ci nomme chacun d'eux, dit qui le reçoit et ce qu'il coûte
 * de le refuser — rien n'y est écrit qui ne soit vérifiable dans le code.
 *
 * Le bouton de réglage est en haut : c'est pour lui qu'on vient.
 */
export default function PageCookies() {
    const {consentement, rouvrir} = useConsentement();

    return (
        <PageLegale titre="Cookies et traceurs" miseAJour="17 octobre 2026">
            <section className="flex flex-col gap-3 rounded-card bg-surface p-5 shadow-card">
                <p className="text-body text-ink">
                    {consentement
                        ? `Vous avez autorisé : ${
                              [
                                  consentement.cartes ? "les cartes" : null,
                                  consentement.notifications ? "les notifications" : null,
                              ]
                                  .filter(Boolean)
                                  .join(" et ") || "aucun service extérieur"
                          }.`
                        : "Vous n’avez pas encore fait de choix."}
                </p>

                <button
                    type="button"
                    onClick={rouvrir}
                    className="inline-flex min-h-11 w-fit items-center rounded-pill bg-brand-500 px-6 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600"
                >
                    Modifier mes choix
                </button>
            </section>

            <SectionLegale titre="Ce que nous n’utilisons pas">
                <p className="text-ink-muted">
                    Ce site ne mesure pas son audience et n’affiche aucune publicité. Il n’y a ni
                    Google Analytics, ni Tag Manager, ni pixel de réseau social, ni aucun traceur
                    publicitaire. Nous ne revendons aucune donnée.
                </p>
            </SectionLegale>

            <SectionLegale titre="1. Nécessaires au service">
                <p className="text-ink-muted">
                    Ils ne se refusent pas : sans eux, le site ne peut pas vous reconnaître ni
                    tenir votre commande. Ils restent entre votre navigateur et notre serveur.
                </p>

                <ListeLegale
                    items={[
                        <>
                            <strong>Cookie de session</strong> — vous garde connecté d’une page à
                            l’autre. Déposé par nous, effacé à la déconnexion.
                        </>,
                        <>
                            <strong>Panier et adresse de livraison</strong> — conservés dans votre
                            navigateur pour que vous ne ressaisissiez pas tout à chaque visite.
                            Ils ne partent nulle part tant que vous ne commandez pas.
                        </>,
                        <>
                            <strong>Commune de livraison</strong> — sert à savoir quels
                            restaurants vous livrent.
                        </>,
                        <>
                            <strong>Vos choix de cookies</strong> — pour ne pas vous reposer la
                            question à chaque page.
                        </>,
                    ]}
                />
            </SectionLegale>

            <SectionLegale titre="2. Cartes — à votre choix">
                <p className="text-ink-muted">
                    Les cartes viennent de <strong>Google Maps</strong>. Les afficher transmet
                    votre adresse IP à Google, qui peut poser ses propres cookies. Tant que vous
                    ne l’autorisez pas, le script de Google n’est pas chargé du tout.
                </p>
                <p className="text-ink-muted">
                    Si vous refusez : la carte laisse place à un bouton, et vous saisissez votre
                    adresse à la main. Vous pouvez commander normalement.
                </p>
            </SectionLegale>

            <SectionLegale titre="3. Notifications — à votre choix">
                <p className="text-ink-muted">
                    Les notifications passent par <strong>Firebase Cloud Messaging</strong>, de
                    Google. Les autoriser enregistre un composant technique dans votre navigateur
                    et obtient un identifiant qui lui est rattaché, pour que nous puissions vous
                    prévenir de l’avancement de votre commande. Votre navigateur vous demandera
                    ensuite sa propre permission.
                </p>
                <p className="text-ink-muted">
                    Si vous refusez : vous suivez votre commande sur le site, qui se met à jour
                    tout seul. Rien n’est perdu, vous êtes prévenu un peu plus tard.
                </p>
            </SectionLegale>

            <SectionLegale titre="4. Paiement">
                <p className="text-ink-muted">
                    Le paiement se fait chez l’opérateur que vous choisissez — FlexPay, EasyPay ou
                    Stripe. Vous quittez alors le site pour sa page, qui suit ses propres règles.
                    Nous ne voyons jamais votre code secret ni votre numéro de carte.
                </p>
            </SectionLegale>

            <SectionLegale titre="5. Revenir sur votre choix">
                <p className="text-ink-muted">
                    À tout moment, par le bouton en haut de cette page ou par le lien « Cookies »
                    du pied de page. Vous pouvez aussi effacer les données de site dans votre
                    navigateur : la question vous sera reposée.
                </p>
                <p className="text-ink-muted">
                    Le jour où un nouveau service extérieur entrerait sur le site, votre choix
                    actuel ne le couvrirait pas et la question vous serait reposée.
                </p>
            </SectionLegale>

            <p className="text-caption text-ink-muted">
                Voir aussi la{" "}
                <Link
                    href="/privacy"
                    className="font-semibold text-brand-600 underline-offset-4 hover:underline"
                >
                    politique de confidentialité
                </Link>{" "}
                et les{" "}
                <Link
                    href="/cgu"
                    className="font-semibold text-brand-600 underline-offset-4 hover:underline"
                >
                    conditions d’utilisation
                </Link>
                .
            </p>
        </PageLegale>
    );
}
