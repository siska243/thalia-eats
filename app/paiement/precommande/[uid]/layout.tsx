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
    // Ne jamais emettre le Referer depuis cette page. Un navigateur y met
    // l'URL COMPLETE sur une navigation de meme origine : le clic « Retour a
    // l'accueil » emporterait la signature vers la requete suivante, et de la
    // dans la supervision.
    //
    // Cette defense et le nettoyage de `request.headers` ne se remplacent pas :
    // l'une empeche l'emission, l'autre nettoie ce qui arrive malgre tout —
    // depuis un autre onglet, un vieux cache, un navigateur qui ignore la
    // directive.
    referrer: "no-referrer",
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
