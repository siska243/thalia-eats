import Link from "next/link";

import PageLegale, {ListeLegale, SectionLegale} from "@/components/commons/PageLegale";

export const metadata = {
    title: "Politique de confidentialité — Thalia",
    description:
        "Ce que Thalia Eats et Thalia Trans collectent, pourquoi, avec qui c’est partagé et quels sont vos droits.",
};

/**
 * La politique de confidentialité.
 *
 * L'ancienne version datait de novembre 2025 et ne parlait que des repas :
 * ni la location, ni la géolocalisation d'une course, ni les sous-traitants
 * réels n'y figuraient. Elle promettait aussi « des offres » par
 * notification, ce que le produit n'envoie pas.
 *
 * TOUT CE QUI EST ÉCRIT ICI EST VÉRIFIABLE DANS LE CODE : les données
 * nommées sont celles que les formulaires demandent et que l'API stocke, et
 * les tiers nommés sont ceux que le site charge réellement.
 */
export default function PolitiqueConfidentialite() {
    return (
        <PageLegale titre="Politique de confidentialité" miseAJour="17 octobre 2026">
            <p>
                Cette politique couvre les deux services de Thalia : la commande de repas livrés
                (<strong>Thalia Eats</strong>) et la location de véhicule avec chauffeur (
                <strong>Thalia Trans</strong>), sur le site comme sur les applications mobiles.
            </p>

            <SectionLegale titre="1. Ce que nous collectons">
                <p className="text-ink-muted">
                    Uniquement ce dont le service a besoin pour fonctionner.
                </p>

                <ListeLegale
                    items={[
                        <>
                            <strong>Votre compte</strong> — nom, numéro de téléphone, adresse
                            électronique. Le téléphone est indispensable : c’est par lui que le
                            livreur ou le chauffeur vous joint.
                        </>,
                        <>
                            <strong>Vos adresses</strong> — celles que vous enregistrez, avec
                            leur commune et, si vous l’avez posé sur la carte, leur point exact.
                        </>,
                        <>
                            <strong>Vos commandes et réservations</strong> — ce que vous avez
                            commandé, où, quand, pour quel montant, et leur statut.
                        </>,
                        <>
                            <strong>Position pendant une course</strong> — celle du livreur ou du
                            chauffeur est relevée pendant la course seulement, pour que vous
                            puissiez la suivre. Elle cesse d’être relevée dès la fin, et les
                            relevés sont effacés après le délai de conservation.
                        </>,
                        <>
                            <strong>Votre position, si vous l’autorisez</strong> — pour vous
                            proposer les restaurants qui vous livrent. Votre appareil vous demande
                            sa propre permission, et vous pouvez la retirer.
                        </>,
                        <>
                            <strong>Données techniques</strong> — adresse IP et journaux du
                            serveur, conservés pour la sécurité et le dépannage.
                        </>,
                    ]}
                />

                <p className="text-ink-muted">
                    Nous ne collectons <strong>jamais</strong> vos codes de paiement : ils se
                    saisissent chez l’opérateur, qui ne nous les transmet pas.
                </p>
            </SectionLegale>

            <SectionLegale titre="2. Pourquoi">
                <ListeLegale
                    items={[
                        "Exécuter ce que vous demandez : préparer, livrer, acheminer, encaisser.",
                        "Vous tenir informé de l’avancement de votre commande ou de votre course.",
                        "Vous permettre de retrouver votre historique et vos adresses.",
                        "Prévenir la fraude et protéger les comptes.",
                        "Respecter nos obligations comptables et fiscales.",
                    ]}
                />
                <p className="text-ink-muted">
                    Nous ne vendons aucune donnée et n’envoyons pas de publicité par notification.
                </p>
            </SectionLegale>

            <SectionLegale titre="3. Avec qui c’est partagé">
                <ListeLegale
                    items={[
                        <>
                            <strong>Le restaurant</strong> qui prépare votre commande : ce qu’il
                            faut préparer, et pour quelle heure.
                        </>,
                        <>
                            <strong>Le livreur ou le chauffeur</strong> : votre prénom, votre
                            numéro et l’adresse, le temps de la course.
                        </>,
                        <>
                            <strong>L’opérateur de paiement</strong> que vous choisissez —
                            FlexPay, EasyPay ou Stripe — pour encaisser.
                        </>,
                        <>
                            <strong>Google</strong>, si vous autorisez les cartes ou les
                            notifications. Voir la page{" "}
                            <Link
                                href="/cookies"
                                className="font-semibold text-brand-600 underline-offset-4 hover:underline"
                            >
                                cookies
                            </Link>
                            .
                        </>,
                        <>
                            <strong>Les autorités</strong>, si la loi nous y oblige.
                        </>,
                    ]}
                />
            </SectionLegale>

            <SectionLegale titre="4. Combien de temps">
                <ListeLegale
                    items={[
                        "Votre compte et vos adresses : tant que le compte existe.",
                        "Vos commandes et réservations : le temps exigé par nos obligations comptables.",
                        "Les relevés de position d’une course : effacés automatiquement après le délai de conservation réglé par l’administration — ils ne servent qu’au suivi et à l’analyse du service.",
                        "Vos choix de cookies : jusqu’à ce que vous en changiez, ou que vous effaciez les données du site.",
                    ]}
                />
            </SectionLegale>

            <SectionLegale titre="5. Vos droits">
                <p className="text-ink-muted">
                    Vous pouvez demander à consulter vos données, les faire corriger, les faire
                    effacer, ou en obtenir une copie. Vous pouvez aussi retirer à tout moment une
                    autorisation que vous aviez donnée — position, notifications, cartes.
                </p>
                <p className="text-ink-muted">
                    Écrivez-nous par le{" "}
                    <Link
                        href="/support"
                        className="font-semibold text-brand-600 underline-offset-4 hover:underline"
                    >
                        support
                    </Link>
                    . Nous répondons et, quand c’est possible, nous agissons dans le mois.
                    L’effacement d’un compte ne supprime pas les factures que la loi nous oblige à
                    conserver.
                </p>
            </SectionLegale>

            <SectionLegale titre="6. Sécurité">
                <p className="text-ink-muted">
                    Les échanges passent par une connexion chiffrée, les mots de passe sont
                    stockés sous une forme qui ne permet pas de les relire, et l’accès aux données
                    est limité aux personnes qui en ont besoin. Aucun système n’est infaillible :
                    si une faille touchait vos données, nous vous préviendrions.
                </p>
            </SectionLegale>

            <SectionLegale titre="7. Les enfants">
                <p className="text-ink-muted">
                    Le service ne s’adresse pas aux moins de 18 ans. Si vous constatez qu’un
                    mineur a créé un compte, signalez-le nous : nous le supprimerons.
                </p>
            </SectionLegale>

            <SectionLegale titre="8. Changements">
                <p className="text-ink-muted">
                    Cette politique peut évoluer. La date de dernière mise à jour figure en haut
                    de cette page, et un changement notable vous sera signalé sur le site.
                </p>
            </SectionLegale>

            <p className="text-caption text-ink-muted">
                Voir aussi les{" "}
                <Link
                    href="/cgu"
                    className="font-semibold text-brand-600 underline-offset-4 hover:underline"
                >
                    conditions d’utilisation
                </Link>{" "}
                et les{" "}
                <Link
                    href="/mentions-legales"
                    className="font-semibold text-brand-600 underline-offset-4 hover:underline"
                >
                    mentions légales
                </Link>
                .
            </p>
        </PageLegale>
    );
}
