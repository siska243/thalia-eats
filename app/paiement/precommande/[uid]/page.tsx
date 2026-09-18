"use client";

import React, {Suspense, useCallback, useEffect, useMemo, useState} from "react";
import {useParams, useSearchParams} from "next/navigation";
import {MdError, MdLocationPin, MdPhoneAndroid, MdAccountCircle} from "react-icons/md";
import {BiLoader} from "react-icons/bi";
import {Checkbox, Text} from "rizzui";
import ChampTexte from "@/components/auth/ChampTexte";
import ChoixPaiement from "@/components/ordering/ChoixPaiement";
import LignesPrix from "@/components/ordering/LignesPrix";
import ListInfoUser from "@/components/ordering/ListInfoUser";
import ModalMobileMoney from "@/components/ordering/ModalMobileMoney";
import EcranPaiement from "@/components/payement/EcranPaiement";
import PhoneNumber from "@/components/forms/phone-number";
import Loader from "@/components/Loader/Loader";
import Notify from "@/components/toastify/Notify";
import {FetchData} from "@/helpers/FetchData";
import {Route} from "@/helpers/Route";
import {formatPrix} from "@/helpers/openingHours";

type Produit = {title?: string | null; quantity: number; price: number};

type Recapitulatif = {
    uid: string;
    reference: string;
    statut: string;
    expires_at: string;
    restaurant: {name: string; slug: string} | null;
    commune: string | null;
    currency: {code: string; slug: string} | null;
    sous_total: number;
    frais_livraison: number;
    service_price: number;
    total: number;
    produits: Produit[];
    coordonnees_figees: boolean;
    coordonnees: {
        adresse: string;
        destinataire: {name: string; phone: string};
    } | null;
    carte_disponible: boolean;
};

type ErreurEcran = {titre: string; message: string};

/**
 * La forme d'une erreur rendue par `FetchData` : axios y est RETOURNE, jamais
 * leve. C'est la convention de tout le site, on ne la change pas ici.
 */
type ReponseErreur = {
    name?: string;
    response?: {
        status?: number;
        data?: {
            title?: string;
            message?: string;
            error?: string;
            errors?: Record<string, string[]>;
        };
    };
};

const Page = () => (
    <Suspense fallback={<Loader />}>
        <PaiementPrecommande />
    </Suspense>
);

/**
 * Le paiement d'une pre-commande, celle que le client a passee en parlant a un
 * assistant.
 *
 * Cette page vivait en Blade, servie par le backend : un ecran qui ne
 * ressemblait pas au site, avec ses propres champs et son propre choix de
 * paiement. Un client qui a commande par la conversation changeait de monde en
 * cliquant sur son lien. Elle reutilise donc les composants du parcours de
 * commande — `ChoixPaiement`, `ModalMobileMoney`, `LignesPrix`, `ChampTexte`,
 * `PhoneNumber`, `EcranPaiement` — et non des copies.
 *
 * L'autorisation n'est pas un jeton : c'est la signature portee par l'URL. Le
 * lien du client contient `expires` et `signature`, calcules par le backend sur
 * l'adresse d'API — `URL::temporarySignedRoute` signe l'hote avec le reste, un
 * lien signe pour thaliaeats.com ne pourrait pas etre verifie sur
 * app.thaliaeats.com. On les repasse donc tels quels a chaque appel.
 */
const PaiementPrecommande = () => {
    const params = useParams<{uid: string}>();
    const recherche = useSearchParams();

    const uid = params?.uid ?? "";
    const expires = recherche.get("expires");
    const signature = recherche.get("signature");

    const query = useMemo(
        () =>
            expires && signature
                ? `expires=${encodeURIComponent(expires)}&signature=${encodeURIComponent(signature)}`
                : "",
        [expires, signature]
    );

    const [recapitulatif, setRecapitulatif] = useState<Recapitulatif | null>(null);
    const [chargement, setChargement] = useState(true);
    const [erreurEcran, setErreurEcran] = useState<ErreurEcran | null>(null);

    // Le formulaire de livraison, affiche seulement si les coordonnees ne sont
    // pas encore figees.
    const [street, setStreet] = useState("");
    const [numberStreet, setNumberStreet] = useState("");
    const [reference, setReference] = useState("");
    const [destinataire, setDestinataire] = useState("");
    const [telephoneDestinataire, setTelephoneDestinataire] = useState<string | null>(null);
    const [erreursChamps, setErreursChamps] = useState<Record<string, string>>({});

    const [memeNumero, setMemeNumero] = useState(false);
    const [phone, setPhone] = useState<string | null>(null);
    const [modaleOuverte, setModaleOuverte] = useState(false);
    const [enCours, setEnCours] = useState<null | "carte" | "mobile">(null);
    const [enAttenteDeConfirmation, setEnAttenteDeConfirmation] = useState(false);

    /** Lit le recapitulatif. La signature voyage dans la chaine de requete. */
    useEffect(() => {
        // Un lien incomplet se voit au rendu : le dire par un setState dans
        // l'effet declencherait un rendu en cascade pour rien.
        if (!uid || !query) return;

        let annule = false;

        (async () => {
            const reponse = await FetchData.getSigned(
                Route.lien_paiement_precommande(uid, query)
            );

            if (annule) return;

            setChargement(false);

            // FetchData retourne les erreurs axios au lieu de les lever.
            if (reponse?.name === "AxiosError") {
                const statut = reponse.response?.status;
                const donnees = reponse.response?.data;

                setErreurEcran({
                    titre:
                        statut === 403
                            ? "Lien expiré ou invalide"
                            : statut === 404
                              ? "Pré-commande introuvable"
                              : (donnees?.title ?? "Paiement indisponible"),
                    message:
                        statut === 403
                            ? "Ce lien n'est plus valable. Demandez-en un nouveau à votre assistant, votre commande n'est pas perdue."
                            : (donnees?.message ??
                              "Nous n'avons pas pu charger cette pré-commande. Réessayez dans un instant."),
                });
                return;
            }

            setRecapitulatif(reponse?.data ?? null);
        })();

        return () => {
            annule = true;
        };
    }, [uid, query]);

    // Le telephone porte son message sous son propre champ ; les autres se
    // regroupent sous le formulaire, sinon un 422 sur un champ sans emplacement
    // dedie disparaitrait sans laisser de trace.
    const messagesDeChamps = Object.entries(erreursChamps)
        .filter(([champ]) => champ !== "recipient_phone")
        .map(([, message]) => message);

    const devise = recapitulatif?.currency?.code ?? null;
    const coordonneesAsaisir = recapitulatif ? !recapitulatif.coordonnees_figees : false;

    /** Les champs de livraison, tels que le backend les attend. */
    const coordonnees = useCallback(() => {
        if (!coordonneesAsaisir) return {};

        return {
            // Meme composition que `ConfirmAdress` du panier : avenue, numero,
            // commune. La commune vient du recapitulatif, jamais d'un champ —
            // elle a choisi la tranche de livraison, donc le total fige.
            adresse: `${street} ${numberStreet} ${recapitulatif?.commune ?? ""}`.trim(),
            street,
            number_street: numberStreet,
            reference,
            recipient_name: destinataire,
            recipient_phone: telephoneDestinataire ?? "",
        };
    }, [
        coordonneesAsaisir,
        street,
        numberStreet,
        reference,
        destinataire,
        telephoneDestinataire,
        recapitulatif?.commune,
    ]);

    /** Un mot avant de partir, plutot qu'un 422 aller-retour. */
    const formulaireIncomplet = (): string | null => {
        if (!coordonneesAsaisir) return null;

        if (!street || !numberStreet) return "Indiquez l'avenue et le numéro où livrer.";
        if (!destinataire) return "Indiquez le nom de la personne à livrer.";
        if (!telephoneDestinataire) {
            return "Indiquez le numéro que le livreur appellera.";
        }

        return null;
    };

    const traiterErreur = (reponse: ReponseErreur): boolean => {
        if (reponse?.name !== "AxiosError") return false;

        const donnees = reponse.response?.data;

        if (donnees?.errors) {
            setErreursChamps(
                Object.fromEntries(
                    Object.entries(donnees.errors as Record<string, string[]>).map(
                        ([champ, messages]) => [champ, messages[0]]
                    )
                )
            );
        }

        const statut = reponse.response?.status;

        if (statut === 410) {
            setErreurEcran({
                titre: "Pré-commande indisponible",
                message:
                    donnees?.message ??
                    "Cette pré-commande n'est plus payable. Demandez-en une nouvelle à votre assistant.",
            });
            return true;
        }

        // Laravel rend « Invalid signature. » et « Too Many Attempts. », en
        // anglais et sans rien dire au client de ce qu'il doit faire. Le cas
        // n'a rien d'exotique : le lien vit douze heures, et celui qui l'ouvre
        // près de la limite puis remplit le formulaire tombe sur le 403 au
        // moment de payer — c'est-à-dire au pire moment.
        if (statut === 403) {
            setErreurEcran({
                titre: "Lien expiré ou invalide",
                message:
                    "Ce lien n'est plus valable. Demandez-en un nouveau à votre assistant, votre commande n'est pas perdue.",
            });
            return true;
        }

        if (statut === 429) {
            Notify(
                "Trop de tentatives",
                "error",
                "Patientez une minute avant de réessayer. Votre commande est conservée."
            );
            return true;
        }

        Notify(
            donnees?.title ?? "Oups",
            "error",
            donnees?.message ??
                "Le paiement n'a pas pu être lancé. Vérifiez votre connexion et réessayez."
        );

        return true;
    };

    const payer = async (corps: Record<string, unknown>, methode: "carte" | "mobile") => {
        const manque = formulaireIncomplet();

        if (manque) {
            Notify("Informations de livraison", "error", manque);
            return;
        }

        setErreursChamps({});
        setEnCours(methode);

        try {
            const reponse = await FetchData.postSigned(
                Route.lien_paiement_precommande(uid, query),
                {...coordonnees(), ...corps}
            );

            if (traiterErreur(reponse)) return;

            if (reponse?.data?.method === "cart") {
                // Comme le panier : la passerelle carte prend la main.
                window.location.href = reponse.data.url;
                return;
            }

            setModaleOuverte(false);
            setEnAttenteDeConfirmation(true);
        } finally {
            setEnCours(null);
        }
    };

    const payerParCarte = () => payer({method: "cart"}, "carte");

    const ouvrirMobileMoney = () => {
        const manque = formulaireIncomplet();

        if (manque) {
            Notify("Informations de livraison", "error", manque);
            return;
        }

        // Rien a saisir si le client paie avec le numero du destinataire.
        if (memeNumero) {
            payer({method: "mobile", meme_numero: true}, "mobile");
            return;
        }

        setModaleOuverte(true);
    };

    const soumettreMobileMoney = (e: React.FormEvent) => {
        e.preventDefault();
        payer({method: "mobile", phone}, "mobile");
    };

    if (!query) {
        return (
            <EcranPaiement
                ton="echec"
                icone={<MdError className="h-9 w-9" />}
                titre="Lien incomplet"
                message="Ce lien de paiement est incomplet. Ouvrez-le depuis le message que vous avez reçu, sans le modifier, ou demandez-en un nouveau à votre assistant."
                actions={[
                    {href: "/", label: "Retour à l'accueil"},
                    {href: "/support", label: "Contacter le support"},
                ]}
            />
        );
    }

    if (chargement) return <Loader />;

    if (erreurEcran) {
        return (
            <EcranPaiement
                ton="echec"
                icone={<MdError className="h-9 w-9" />}
                titre={erreurEcran.titre}
                message={erreurEcran.message}
                actions={[
                    {href: "/", label: "Retour à l'accueil"},
                    {href: "/support", label: "Contacter le support"},
                ]}
            />
        );
    }

    if (enAttenteDeConfirmation) {
        return (
            <EcranPaiement
                ton="attente"
                icone={<BiLoader className="h-9 w-9 animate-spin-slow" />}
                titre="Paiement en attente"
                message="Validez le paiement depuis le message reçu sur votre téléphone. Votre commande est conservée en attendant."
                actions={[{href: "/", label: "Retour à l'accueil"}]}
            />
        );
    }

    if (!recapitulatif) return <Loader />;

    return (
        <div className="min-h-svh bg-surface-sunken px-4 pb-16 pt-[calc(var(--header-h)+24px)]">
            <div className="mx-auto max-w-6xl">
                <header>
                    <h1 className="text-display font-extrabold text-secondaryColor">
                        Régler votre commande
                    </h1>
                    <p className="mt-3 max-w-xl text-body leading-7 text-ink-muted">
                        Commande {recapitulatif.reference}
                        {recapitulatif.restaurant ? ` chez ${recapitulatif.restaurant.name}` : ""}.
                        Vérifiez le récapitulatif, complétez la livraison, puis choisissez
                        votre moyen de paiement.
                    </p>
                </header>

                {/*
                 * Deux colonnes : a gauche ce que le client remplit, a droite ce
                 * qu'il achete. Le recapitulatif reste colle au defilement sur
                 * grand ecran — un client qui doit remonter pour reverifier son
                 * total avant de payer est un client qui abandonne.
                 *
                 * Sur mobile les colonnes s'empilent et le recapitulatif passe en
                 * premier : sur un petit ecran on veut voir ce qu'on paie avant de
                 * saisir quoi que ce soit.
                 *
                 * La bascule est une grille CSS, jamais une mesure de la fenetre
                 * en JavaScript : `app/checkout/page.tsx` a justement ete corrige
                 * pour ca, parce que la valeur est fausse au premier rendu et que
                 * la page sautait d'une colonne a deux apres l'hydratation.
                 */}
                <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
                    <div className="order-2 flex flex-col gap-6 lg:order-1">
                        {coordonneesAsaisir ? (
                            <section className="rounded-card bg-surface p-5 shadow-card sm:p-6">
                                <h2 className="text-title font-bold text-secondaryColor">
                                    Où livrer&nbsp;?
                                </h2>
                                <p className="mt-2 text-caption text-ink-muted">
                                    Votre assistant n&apos;a retenu que la commune. Dites-nous
                                    où déposer la commande et qui le livreur doit appeler.
                                </p>

                                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                    <ChampTexte
                                        label="Avenue"
                                        placeholder="Nom de votre avenue"
                                        value={street}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setStreet(e.target.value)
                                        }
                                        required
                                    />

                                    <ChampTexte
                                        label="Numéro"
                                        placeholder="Numéro de l'avenue"
                                        value={numberStreet}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setNumberStreet(e.target.value)
                                        }
                                        required
                                    />

                                    <ChampTexte
                                        className="sm:col-span-2"
                                        label="Référence"
                                        placeholder="Un repère proche de chez vous"
                                        aide="Ce qui aide le livreur à vous trouver"
                                        value={reference}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setReference(e.target.value)
                                        }
                                    />

                                    <ChampTexte
                                        label="Personne à livrer"
                                        placeholder="Nom et prénom"
                                        value={destinataire}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setDestinataire(e.target.value)
                                        }
                                        required
                                    />

                                    <PhoneNumber
                                        className="w-full"
                                        country="cd"
                                        value={telephoneDestinataire ?? ""}
                                        onChange={(valeur: string) =>
                                            setTelephoneDestinataire(valeur)
                                        }
                                        preferredCountries={["cd"]}
                                        label="Numéro du destinataire"
                                        helperText="C'est le numéro que le livreur appellera"
                                        error={erreursChamps.recipient_phone}
                                    />
                                </div>

                                {/*
                                  * Tous les messages, pas seulement celui de
                                  * l'adresse : un 422 sur le nom du
                                  * destinataire ne doit pas se resumer a un
                                  * message generique. Le telephone garde le
                                  * sien sous son champ, ou il est utile.
                                  */}
                                {messagesDeChamps.length > 0 ? (
                                    <ul
                                        role="alert"
                                        className="mt-4 flex flex-col gap-1 rounded-control bg-danger-surface px-4 py-3 text-caption font-semibold text-danger"
                                    >
                                        {messagesDeChamps.map((message) => (
                                            <li key={message}>{message}</li>
                                        ))}
                                    </ul>
                                ) : null}
                            </section>
                        ) : (
                            <section className="rounded-card bg-surface p-5 shadow-card sm:p-6">
                                <h2 className="text-title font-bold text-secondaryColor">
                                    Livraison
                                </h2>
                                <p className="mt-2 text-caption text-ink-muted">
                                    Ces informations ont déjà été enregistrées et ne peuvent
                                    plus être modifiées depuis ce lien. Elles sont partiellement
                                    masquées&nbsp;: un lien de paiement peut avoir été transféré.
                                </p>

                                <div className="mt-4 flex flex-col">
                                    <ListInfoUser
                                        title={recapitulatif.coordonnees?.adresse}
                                        Icon={MdLocationPin}
                                    />
                                    <ListInfoUser
                                        title={recapitulatif.coordonnees?.destinataire.name}
                                        Icon={MdAccountCircle}
                                    />
                                    <ListInfoUser
                                        lastBorder
                                        title={recapitulatif.coordonnees?.destinataire.phone}
                                        Icon={MdPhoneAndroid}
                                    />
                                </div>
                            </section>
                        )}

                        <section>
                            <h2 className="mb-1 text-title font-bold text-secondaryColor">
                                Comment payer&nbsp;?
                            </h2>
                            <p className="mb-5 text-caption text-ink-muted">
                                Le montant débité est celui du récapitulatif, il ne change plus.
                            </p>

                            {!coordonneesAsaisir ? (
                                <Checkbox
                                    size="lg"
                                    inputClassName="border-2"
                                    className="mb-5"
                                    checked={memeNumero}
                                    onChange={() => setMemeNumero(!memeNumero)}
                                    label={
                                        <Text className="text-caption">
                                            Débiter le numéro du destinataire (
                                            {recapitulatif.coordonnees?.destinataire.phone})
                                        </Text>
                                    }
                                />
                            ) : null}

                            <ChoixPaiement
                                enCours={enCours}
                                onMobile={ouvrirMobileMoney}
                                onCarte={payerParCarte}
                                carteIndisponible={!recapitulatif.carte_disponible}
                                raisonCarteIndisponible="Le montant est trop bas pour un paiement par carte, réglez par mobile money."
                            />
                        </section>
                    </div>

                    <aside className="order-1 lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:order-2">
                        <div className="rounded-card bg-surface p-5 shadow-card sm:p-6">
                            <h2 className="text-title font-bold text-secondaryColor">
                                Votre commande
                            </h2>

                            {recapitulatif.commune ? (
                                <p className="mt-1 text-caption text-ink-muted">
                                    Livraison à {recapitulatif.commune}
                                </p>
                            ) : null}

                            <ul className="mt-5 flex flex-col gap-3 border-b border-surface-border pb-5">
                                {recapitulatif.produits.map((produit, index) => (
                                    <li
                                        key={`${produit.title}-${index}`}
                                        className="flex items-baseline justify-between gap-3"
                                    >
                                        <span className="text-body text-ink">
                                            <span className="font-semibold">
                                                {produit.quantity}&times;
                                            </span>{" "}
                                            {produit.title ?? "Plat"}
                                        </span>
                                        <span className="shrink-0 text-body text-ink-muted">
                                            {formatPrix(produit.price * produit.quantity, devise)}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-5">
                                <LignesPrix
                                    sousTotal={recapitulatif.sous_total}
                                    livraison={recapitulatif.frais_livraison}
                                    service={recapitulatif.service_price}
                                    total={recapitulatif.total}
                                    devise={devise}
                                    totalDominant
                                />
                            </div>

                            <p className="mt-5 text-caption text-ink-subtle">
                                Ce prix est figé jusqu&apos;au{" "}
                                {new Date(recapitulatif.expires_at).toLocaleString("fr-FR", {
                                    dateStyle: "long",
                                    timeStyle: "short",
                                })}
                                .
                            </p>
                        </div>
                    </aside>
                </div>
            </div>

            <ModalMobileMoney
                ouvert={modaleOuverte}
                onClose={() => setModaleOuverte(false)}
                phone={phone}
                onPhone={setPhone}
                onSubmit={soumettreMobileMoney}
                enCours={enCours === "mobile"}
                aide="Le numéro qui recevra la demande de paiement"
            />
        </div>
    );
};

export default Page;
