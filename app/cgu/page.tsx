import Link from "next/link";

import PageLegale, {ListeLegale, SectionLegale} from "@/components/commons/PageLegale";

export const metadata = {
    title: "Conditions d’utilisation — Thalia",
    description:
        "Les règles de commande, de livraison, de réservation et de paiement de Thalia Eats et Thalia Trans.",
};

/**
 * Les conditions d'utilisation.
 *
 * Le pied de page annonçait « Conditions d'utilisation » et renvoyait vers
 * la politique de confidentialité : un lien mort depuis l'ouverture.
 *
 * TOUT CE QUI EST ÉCRIT ICI EST VÉRIFIABLE DANS LE CODE — l'acompte, le
 * créneau perdu, le délai de prévenance, le refus hors zone, le plat épuisé.
 * Une condition qui promet autre chose que ce que le logiciel fait n'engage
 * personne et se retourne contre l'éditeur le jour d'un litige.
 *
 * Les montants et les durées ne sont PAS écrits en chiffres ici : ils se
 * règlent en administration (pourcentage d'acompte, délai de prévenance,
 * rayon de livraison) et changeraient sans que cette page le sache.
 */
export default function PageCGU() {
    return (
        <PageLegale titre="Conditions d’utilisation" miseAJour="17 octobre 2026">
            <p>
                Ces conditions régissent l’usage du site et des applications Thalia, qui réunissent
                deux services : la commande de repas livrés (<strong>Thalia Eats</strong>) et la
                location de véhicule avec chauffeur (<strong>Thalia Trans</strong>). En créant un
                compte ou en passant commande, vous les acceptez.
            </p>

            <SectionLegale titre="1. Qui fait quoi">
                <p className="text-ink-muted">
                    Thalia est un intermédiaire. Les repas sont préparés par les restaurants
                    partenaires, qui en répondent ; les courses sont assurées par des chauffeurs,
                    avec les véhicules du parc. Nous mettons en relation, encaissons et suivons
                    l’exécution.
                </p>
            </SectionLegale>

            <SectionLegale titre="2. Votre compte">
                <ListeLegale
                    items={[
                        "Un numéro de téléphone joignable est nécessaire : c’est par lui que le livreur ou le chauffeur vous contacte.",
                        "Vous répondez de l’exactitude de l’adresse de livraison ou du point de prise en charge. Une adresse fausse peut rendre la livraison impossible, et la commande reste due.",
                        "Vous gardez vos identifiants pour vous. Prévenez-nous si vous pensez que quelqu’un d’autre y a accès.",
                    ]}
                />
            </SectionLegale>

            <SectionLegale titre="3. Commander un repas">
                <ListeLegale
                    items={[
                        "Un restaurant fermé n’accepte pas de commande : ses horaires sont affichés et la commande est refusée en dehors.",
                        "Certains plats ont un stock limité. Un plat épuisé reste visible mais ne peut pas être ajouté au panier ; s’il s’épuise pendant que vous commandez, la commande est refusée avant le paiement.",
                        "La livraison n’est possible que dans un rayon autour du restaurant. Au-delà, la commande est refusée et la distance vous est indiquée.",
                        "Les frais de livraison dépendent de la commune et vous sont annoncés avant le paiement. Le prix facturé est toujours celui calculé par nos serveurs.",
                    ]}
                />
            </SectionLegale>

            <SectionLegale titre="4. Réserver un véhicule">
                <ListeLegale
                    items={[
                        "Une course se commande à l’avance : un délai minimum sépare la demande du départ, le temps de joindre un chauffeur. Les créneaux trop proches ne sont pas réservables.",
                        "La location se compte à l’heure ou à la journée, selon ce que le véhicule propose. Toute heure ou journée entamée est due.",
                        "Un véhicule ne dessert que sa ville, et parfois seulement certaines communes. Une demande hors de cette zone est refusée.",
                        "Certains types de course imposent une durée minimale ou un mode de facturation ; ils vous sont annoncés au moment du choix.",
                        "Le prix retenu est celui affiché au moment de la réservation : un changement de tarif ultérieur ne s’applique pas à une réservation déjà faite.",
                    ]}
                />
            </SectionLegale>

            <SectionLegale titre="5. Acompte et créneau">
                <p className="text-ink-muted">
                    Une réservation de véhicule se confirme par un <strong>acompte</strong>, dont
                    le pourcentage vous est indiqué avant le paiement. Le solde se règle en
                    espèces au chauffeur.
                </p>
                <p className="text-ink-muted">
                    <strong>Le véhicule n’est retenu qu’une fois l’acompte payé.</strong> Tant
                    qu’il ne l’est pas, un autre client peut réserver le même créneau. Si cela
                    arrive, votre réservation est perdue et votre acompte vous est remboursé —
                    c’est la seule situation où nous annulons de notre propre fait.
                </p>
                <p className="text-ink-muted">
                    Une réservation non réglée expire d’elle-même après un délai affiché à
                    l’écran, et libère le créneau.
                </p>
            </SectionLegale>

            <SectionLegale titre="6. Paiement">
                <ListeLegale
                    items={[
                        "Le paiement se fait par mobile money ou par carte, chez l’opérateur que vous choisissez. Nous ne voyons ni votre code secret ni votre numéro de carte.",
                        "Un paiement non abouti ne vaut pas commande : rien n’est préparé ni retenu tant que l’opérateur n’a pas confirmé.",
                        "Les prix sont indiqués dans la devise affichée, toutes taxes comprises le cas échéant.",
                    ]}
                />
            </SectionLegale>

            <SectionLegale titre="7. Annulation et remboursement">
                <ListeLegale
                    items={[
                        "Un repas dont la préparation a commencé ne peut plus être annulé : le restaurant a engagé des frais.",
                        "Une réservation de véhicule annulée donne lieu au remboursement prévu par nos réglages du moment, indiqué avant le paiement.",
                        "Un créneau perdu au profit d’un autre client est remboursé intégralement.",
                    ]}
                />
            </SectionLegale>

            <SectionLegale titre="8. Ce que vous ne devez pas faire">
                <ListeLegale
                    items={[
                        "Passer des commandes fictives, ou pour une adresse qui n’existe pas.",
                        "Tenter d’accéder aux données d’un autre client, ou à nos interfaces d’administration.",
                        "Automatiser l’usage du service sans notre accord écrit.",
                        "Vous faire passer pour un restaurant, un chauffeur ou un livreur partenaire.",
                    ]}
                />
                <p className="text-ink-muted">
                    Nous pouvons suspendre un compte qui enfreint ces règles, après vous en avoir
                    averti quand les circonstances le permettent.
                </p>
            </SectionLegale>

            <SectionLegale titre="9. Responsabilité">
                <p className="text-ink-muted">
                    Nous répondons de l’acheminement et de l’encaissement. La qualité et la
                    composition des plats relèvent du restaurant qui les prépare : signalez-nous
                    tout problème, nous ferons le lien. Nous ne garantissons pas que le service
                    soit disponible sans interruption — une panne de réseau, d’opérateur de
                    paiement ou de fournisseur de cartes peut l’empêcher.
                </p>
            </SectionLegale>

            <SectionLegale titre="10. Modification de ces conditions">
                <p className="text-ink-muted">
                    Nous pouvons modifier ces conditions. La date de dernière mise à jour figure
                    en haut de cette page. Un changement notable vous sera signalé sur le site.
                </p>
            </SectionLegale>

            <SectionLegale titre="11. Droit applicable et litiges">
                <p className="text-ink-muted">
                    Ces conditions sont régies par le droit de la République démocratique du
                    Congo. En cas de différend, nous cherchons d’abord une solution amiable :
                    écrivez-nous, nous répondons. À défaut d’accord, les tribunaux compétents de
                    Kinshasa sont saisis.
                </p>
            </SectionLegale>

            <SectionLegale titre="12. Nous écrire">
                <p className="text-ink-muted">
                    Par le{" "}
                    <Link
                        href="/support"
                        className="font-semibold text-brand-600 underline-offset-4 hover:underline"
                    >
                        support
                    </Link>
                    , ou aux coordonnées des{" "}
                    <Link
                        href="/mentions-legales"
                        className="font-semibold text-brand-600 underline-offset-4 hover:underline"
                    >
                        mentions légales
                    </Link>
                    .
                </p>
            </SectionLegale>
        </PageLegale>
    );
}
