import type {Metadata} from "next";

/**
 * Cette page ne doit jamais entrer dans un index.
 *
 * L'URL porte `expires` et `signature`, et cette signature EST le moyen
 * d'acces : elle suffit a lire la commande, a figer une adresse de livraison
 * et a declencher un debit. Un lien colle par inadvertance sur un forum, dans
 * un ticket public ou dans une conversation archivee ne doit pas se retrouver
 * dans un moteur de recherche par-dessus le marche.
 *
 * Ce fichier existe uniquement pour porter ces metadonnees : la page est un
 * composant client, elle ne peut pas exporter `metadata` elle-meme.
 */
export const metadata: Metadata = {
    title: "Régler votre commande",
    // Le Referer ne doit jamais emporter la signature. Un navigateur y met
    // l'URL COMPLETE sur une navigation de meme origine : le clic « Retour a
    // l'accueil » l'expedierait vers la requete suivante, et de la dans la
    // supervision.
    //
    // « strict-origin » et non « no-referrer », qui etait trop large : sur
    // « Payer par carte » la page part vers la passerelle, et FlexPay recevait
    // jusqu'ici l'origine seule (comportement par defaut en inter-domaines).
    // Ne plus rien lui envoyer du tout, sur un chemin de paiement, est un
    // risque qu'aucun test ne peut lever puisque la passerelle est simulee.
    // « strict-origin » retire le chemin ET la chaine de requete, y compris en
    // navigation de meme origine — la fuite par « Retour a l'accueil » reste
    // donc fermee a l'identique — mais la passerelle garde l'origine.
    //
    // Cette defense et le nettoyage de `request.headers` ne se remplacent pas :
    // l'une limite ce qui est emis, l'autre nettoie ce qui arrive malgre tout —
    // depuis un autre onglet, un vieux cache, un navigateur qui ignore la
    // consigne.
    referrer: "strict-origin",
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {index: false, follow: false},
    },
};

export default function LayoutPaiementPrecommande({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
