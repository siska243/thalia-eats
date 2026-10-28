import Link from "next/link";

import PageLegale, {ListeLegale, SectionLegale} from "@/components/commons/PageLegale";

export const metadata = {
    title: "Supprimer mon compte — Thalia",
    description:
        "Comment supprimer votre compte Thalia et vos données personnelles, depuis l’application, depuis le site ou sur demande.",
};

/**
 * La page publique de demande de suppression de compte.
 *
 * Google Play l'exige de toute application qui permet de créer un compte :
 * la suppression doit être possible DEPUIS l'application, et une adresse web
 * doit l'expliquer SANS avoir à installer l'application. C'est cette adresse
 * qui est déclarée dans le formulaire « Sécurité des données » de la Play
 * Console.
 *
 * Elle est donc publique et ne demande aucune connexion : quelqu'un qui a
 * désinstallé l'application, ou qui a perdu l'accès à son compte, doit
 * pouvoir lire quoi faire.
 *
 * Ce qui est écrit ici décrit exactement ce que fait le serveur
 * (`User::supprimerLeCompte()`) : les champs nommés sont ceux qui sont
 * effacés, et la conservation annoncée est celle qui a lieu réellement.
 */
export default function SuppressionCompte() {
    return (
        <PageLegale titre="Supprimer mon compte" miseAJour="28 octobre 2026">
            <p>
                Vous pouvez supprimer votre compte Thalia à tout moment. La suppression est
                définitive : elle efface vos données personnelles et vous déconnecte de tous vos
                appareils.
            </p>

            <SectionLegale titre="Depuis l’application mobile">
                <p className="text-ink-muted">
                    Ouvrez <strong>Mon compte</strong>, puis <strong>Supprimer mon compte</strong>.
                    Votre mot de passe vous est redemandé, et un message vous demande de confirmer.
                </p>
            </SectionLegale>

            <SectionLegale titre="Depuis le site">
                <p className="text-ink-muted">
                    Connectez-vous, puis ouvrez{" "}
                    <Link href="/reglages" className="underline">
                        vos réglages
                    </Link>
                    . La suppression se trouve en bas de la page.
                </p>
            </SectionLegale>

            <SectionLegale titre="Si vous ne pouvez plus vous connecter">
                <p className="text-ink-muted">
                    Écrivez à{" "}
                    <a href="mailto:thaliaeat.original@gmail.com" className="underline">
                        thaliaeat.original@gmail.com
                    </a>{" "}
                    depuis l’adresse électronique de votre compte, avec « suppression de compte »
                    en objet. Nous traitons la demande sous 30 jours.
                </p>
            </SectionLegale>

            <SectionLegale titre="Ce qui est effacé">
                <ListeLegale
                    items={[
                        <>
                            <strong>Votre identité</strong> — nom, prénom, adresse électronique,
                            numéro de téléphone.
                        </>,
                        <>
                            <strong>Vos adresses</strong> — adresse principale, rue et numéro,
                            commune, et tout votre carnet d’adresses de livraison.
                        </>,
                        <>
                            <strong>Vos accès</strong> — mot de passe, connexion Google, et toutes
                            vos sessions ouvertes.
                        </>,
                        <>
                            <strong>Vos notifications</strong> — les jetons de vos appareils, pour
                            que plus rien ne vous soit envoyé.
                        </>,
                    ]}
                />
            </SectionLegale>

            <SectionLegale titre="Ce qui est conservé, et pourquoi">
                <p className="text-ink-muted">
                    Vos commandes, vos paiements et vos livraisons sont conservés, mais{" "}
                    <strong>détachés de votre identité</strong> : ils ne portent plus votre nom, ni
                    vos coordonnées, ni vos adresses. Nous y sommes tenus par nos obligations
                    comptables et fiscales. Si vous gérez un restaurant sur Thalia, l’enseigne et
                    son catalogue restent en place : seul votre compte s’en détache.
                </p>
            </SectionLegale>

            <SectionLegale titre="Si une commande est en cours">
                <p className="text-ink-muted">
                    La suppression est refusée tant qu’une commande ou une location est en cours,
                    ou reste à régler. Annulez-la, ou attendez qu’elle se termine, puis réessayez.
                    Nous ne pouvons pas effacer les coordonnées d’un client qu’un livreur est en
                    train de chercher.
                </p>
            </SectionLegale>

            <p className="text-ink-muted">
                Pour le détail de ce que nous collectons et de vos droits, voir la{" "}
                <Link href="/privacy" className="underline">
                    politique de confidentialité
                </Link>
                .
            </p>
        </PageLegale>
    );
}
