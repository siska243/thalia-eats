"use client";

import React, {Suspense, useMemo, useState} from "react";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import {FaCalendarDays, FaCheck, FaLocationDot, FaUsers} from "react-icons/fa6";

import {
    creneauLisible,
    dureeFacturee,
    libelleDuMode,
    lignesDuPrix,
    modeDepuisParam,
    zonePriseEnCharge,
} from "@/helpers/rental";
import {formatPrix} from "@/helpers/openingHours";
import {Route} from "@/helpers/Route";
import useReferentialData from "@/hooks/useQueryTanStack";
import {
    useNomsCommerciaux,
    useRentalActions,
    useRentalBooking,
    useRentalConfig,
    useRentalVehicle,
} from "@/hooks/useRental";
import ChampTexte from "@/components/auth/ChampTexte";
import CarnetAdresses from "@/components/ordering/CarnetAdresses";
import useAdresses from "@/hooks/useAdresses";
import type {AdresseEnregistree} from "@/types/adresse";
import PhoneNumber from "@/components/forms/phone-number";
import {estValide, pourLaSaisie, pourLeCompte} from "@/helpers/telephone";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import {FetchData} from "@/helpers/FetchData";
import ChoixPaiement from "@/components/ordering/ChoixPaiement";
import ModalMobileMoney from "@/components/ordering/ModalMobileMoney";
import HorsZone from "@/components/rental/HorsZone";
import PhotoVehicule from "@/components/rental/PhotoVehicule";

type Commune = {uid: string; slug: string; title: string};

/**
 * Les engagements de la maison : ce que l'acompte achète, et ce qui se passe
 * si le créneau est perdu. Deux phrases, reprises mot pour mot du mobile.
 */
const ENGAGEMENTS = [
    "Le véhicule est retenu dès que l'acompte est reçu.",
    "Créneau pris par quelqu'un d'autre : acompte remboursé intégralement.",
];

const Page = () => (
    <Suspense>
        <TunnelReservation />
    </Suspense>
);

/**
 * La réservation et le paiement de l'acompte.
 *
 * Décalque de `(rental)/checkout.tsx` du mobile pour le fond, et du tunnel de
 * commande du site pour la forme : ce sont les mêmes deux cartes de paiement
 * et la même fenêtre de saisie du numéro que `/checkout`, et non une
 * imitation. Écrire un second tunnel aurait fait diverger le traitement du
 * retour de la passerelle, alors que c'est le même paiement.
 *
 * Deux étapes ici, trois sur le téléphone : la saisie du numéro ne fait pas
 * d'étape sur le web, elle vit dans la fenêtre qui précède immédiatement le
 * débit, là où le site la met déjà pour les repas. Le bouton qui porte le
 * montant est donc celui qui paie vraiment.
 *
 * La réservation n'est créée qu'au dernier bouton, juste avant d'engager le
 * paiement. La créer plus tôt laisserait derrière chaque client qui abandonne
 * une réservation non payée, et le véhicule paraîtrait convoité sans l'être.
 *
 * Aucun montant ne part d'ici. Seuls le véhicule, le créneau et le mode sont
 * envoyés : le serveur recalcule le prix.
 */
const TunnelReservation = () => {
    const router = useRouter();
    const params = useSearchParams();

    const slug = params.get("slug") ?? undefined;
    const debut = params.get("starts_at") ?? undefined;
    const fin = params.get("ends_at") ?? undefined;

    /**
     * Une réservation déjà créée, qu'on vient seulement régler.
     *
     * Le bouton « Payer l'acompte » du détail d'une course arrive par là : la
     * réservation existe, son créneau est figé, il ne reste qu'à payer. Sans
     * ce cas, la page s'ouvrait sans slug ni créneau, ne trouvait aucun
     * véhicule, et le bouton semblait ne rien faire.
     */
    const uidARegler = params.get("uid") ?? undefined;
    const reglementSeul = !!uidARegler;

    const {data: reservation} = useRentalBooking(uidARegler);

    /*
     * Le mode choisi sur la fiche voyage par l'URL, comme le créneau. Seul le
     * MODE voyage : aucun montant ne part d'ici.
     */
    const mode = modeDepuisParam(params.get("mode"));

    /*
     * Le type de course choisi sur la fiche, retrouvé dans le référentiel.
     *
     * Seul son IDENTIFIANT voyage : ses règles viennent de la configuration,
     * une seule source. Les recopier dans l'URL aurait figé un commentaire
     * exigé ou un tarif de parking au moment du clic.
     */
    /*
     * L'IDENTIFIANT vient de l'URL, les REGLES du vehicule charge.
     *
     * L'identifiant doit etre connu avant la requete — c'est lui qui fait
     * chiffrer la course — tandis que la duree minimale, le mode impose et
     * l'option parking vivent sur la ligne du referentiel que le vehicule
     * rapporte. Une seule source pour les regles.
     */
    const typeCourseId = Number(params.get("course_type_id")) || undefined;
    const parking = params.get("parking") === "1";
    const [commentaire, setCommentaire] = useState("");

    const {data: vehicle} = useRentalVehicle(
        slug,
        debut,
        fin,
        mode,
        typeCourseId,
        parking,
    );

    const typeCourse =
        (vehicle?.course_types ?? []).find((type) => type.id === typeCourseId) ?? null;
    const {reserver, payerAcompte} = useRentalActions();

    const {data: configRental} = useRentalConfig();
    const noms = useNomsCommerciaux();

    // Les communes du site, toutes : c'est en en choisissant une hors zone que
    // le client découvre que la course se traite à la main, par WhatsApp. Ne
    // lister que les communes desservies masquerait la question.
    const {data: referentiel} = useReferentialData<{town?: Commune[]}>({
        url: Route.default,
        queryKey: "default",
    });

    // Régler une réservation existante saute l'adresse : elle est figée dessus.
    const [etape, setEtape] = useState(reglementSeul ? 1 : 0);
    const [erreur, setErreur] = useState<string | null>(null);
    const [enCours, setEnCours] = useState<null | "carte" | "mobile">(null);
    const [modalOuverte, setModalOuverte] = useState(false);
    const [phone, setPhone] = useState<string | null>(null);

    /*
     * Le numero que le chauffeur appellera.
     *
     * Il n'etait demande nulle part : le client reservait, et personne
     * n'avait de quoi le joindre. Le serveur ne porte pas de telephone sur la
     * reservation — `CourseChauffeurResource` rend celui du COMPTE — donc
     * c'est bien le compte qu'il faut renseigner, et non un champ de plus
     * dans la reservation qui n'irait nulle part.
     *
     * Pre-rempli depuis le compte : le client l'a donne en s'inscrivant, le
     * lui redemander de zero serait une saisie pour rien. Il reste modifiable,
     * parce qu'on ne prend pas toujours la course sur le telephone qui a
     * servi a creer le compte.
     */
    // `useGetCurrentUser` n'est pas type : le compte arrive en `{}`. On ne
    // lit que les quatre champs dont on a besoin, nommes ici.
    const {user} = useGetCurrentUser() as {
        user?: {email?: string; name?: string; last_name?: string; phone?: string} | null;
    };
    /*
     * Le compte stocke le format local, « 0810000001 », et le composant de
     * saisie travaille en international sans le plus, « 243810000001 ». Les
     * deux conversions vivent dans `helpers/telephone`, une fois : la forme
     * enregistree ne peut pas dependre de l'ecran ou le numero a ete tape.
     */
    const telephoneDuCompte = pourLaSaisie(user?.phone);
    const [telephone, setTelephone] = useState("");
    const telephoneRetenu = telephone || telephoneDuCompte;

    const [communeSlug, setCommuneSlug] = useState("");
    const [avenue, setAvenue] = useState("");
    const [numero, setNumero] = useState("");
    const [repere, setRepere] = useState("");

    /*
     * Le carnet d'adresses, comme au moment de commander un repas.
     *
     * Le site faisait ressaisir l'adresse a chaque course alors que le serveur
     * la gardait et que l'application la proposait : meme client, meme compte,
     * deux experiences. Le carnet est le MEME composant que le parcours repas,
     * et la meme lecture — une seconde liste d'adresses aurait fini par en
     * montrer une autre.
     *
     * Il n'est lu que pour un client connecte : la route exige un jeton.
     */
    const carnet = useAdresses(!!user);
    const [choisie, setChoisie] = useState<string | null>(null);

    /*
     * Choisir REMPLIT les champs au lieu de les remplacer.
     *
     * C'est ce que fait deja `ConfirmAdress` cote repas : le client voit
     * l'adresse reprise, peut corriger un repere qui a change, et le texte
     * envoye au serveur reste compose a un seul endroit, plus bas.
     */
    const choisirDuCarnet = (adresse: AdresseEnregistree) => {
        setChoisie(adresse.slug);
        setCommuneSlug(adresse.town?.slug ?? "");
        setAvenue(adresse.street ?? "");
        setNumero(adresse.number_street ?? "");
        setRepere(adresse.reference ?? "");
        setErreur(null);
    };

    const supprimerDuCarnet = async (adresse: AdresseEnregistree) => {
        try {
            await carnet.supprimer.mutateAsync(adresse.slug);

            if (choisie === adresse.slug) setChoisie(null);
        } catch (e) {
            // Une suppression silencieusement ratee laisse croire qu'elle a eu
            // lieu, et l'adresse revient au rechargement.
            setErreur((e as Error).message);
        }
    };

    const commune = referentiel?.town?.find((item) => item.slug === communeSlug);

    /*
     * La location se fait avec chauffeur et uniquement dans Kinshasa : les
     * communes ouvertes viennent de la configuration. La page prévient avant,
     * le serveur refuse après avec le code `hors_zone` — les deux sont
     * nécessaires, et c'est son message qui s'affiche.
     */
    const zone = useMemo(
        () => zonePriseEnCharge(communeSlug, configRental?.towns),
        [communeSlug, configRental?.towns],
    );

    /** Le texte envoyé au serveur, reconstitué à partir de l'adresse saisie. */
    const lieuDePriseEnCharge = useMemo(
        () =>
            [`${avenue} ${numero}`.trim(), commune?.title?.trim(), repere.trim()]
                .filter(Boolean)
                .join(", "),
        [avenue, commune, numero, repere],
    );

    /*
     * Les montants viennent de la réservation quand on en règle une : ils y
     * sont figés depuis sa création. Jamais recalculés ici.
     */
    const devise = reglementSeul
        ? reservation?.currency?.code
        : (vehicle?.quote?.currency?.code ?? vehicle?.currency?.code);
    const acompte = reglementSeul ? reservation?.deposit : vehicle?.quote?.deposit;
    const lignes = lignesDuPrix(reglementSeul ? reservation : vehicle?.quote);

    /** Le véhicule montré en tête, celui de la réservation le cas échéant. */
    const vehiculeAffiche = reglementSeul ? reservation?.vehicle : vehicle;

    const continuer = () => {
        setErreur(null);

        /*
         * Le numero d'avenue n'est PAS exige.
         *
         * Beaucoup d'adresses de Kinshasa n'en ont pas, et le reclamer faisait
         * inventer un chiffre au client — une fausse precision est pire qu'une
         * absence pour le chauffeur qui cherche. La commune, l'avenue et le
         * repere suffisent a venir prendre quelqu'un ; c'est le repere qui
         * fait le travail sur le terrain.
         */
        if (!telephoneRetenu) {
            setErreur("Indiquez le numéro sur lequel le chauffeur vous appellera.");

            return;
        }

        /*
         * Et il doit se composer. Ce numéro-là est écrit sur le COMPTE plus
         * bas : un numéro faux ne gâchait pas seulement cette course, il
         * restait sur le compte et revenait pré-rempli à la suivante.
         */
        if (!estValide(telephoneRetenu)) {
            setErreur("Ce numéro de téléphone n’est pas valide. Exemple : 0810000000.");

            return;
        }

        if (!communeSlug || !avenue.trim() || !repere.trim()) {
            setErreur("Indiquez la commune, l’avenue et un repère où le chauffeur doit vous prendre.");

            return;
        }

        /*
         * Hors zone, on n'avance pas : le serveur refuserait, et le client
         * aurait choisi son moyen de paiement pour rien. Le bloc au-dessus
         * porte le message du serveur et le contact.
         */
        if (zone.etat === "hors-zone") {
            setErreur("Cette commune n’est pas desservie. Écrivez-nous pour organiser la course.");

            return;
        }

        setEtape(1);
    };

    /** Crée la réservation si besoin, puis engage l'acompte. */
    const payer = async (method: "mobile" | "cart") => {
        /*
         * Ces gardes ne valent que pour la CRÉATION d'une réservation. Régler
         * une réservation existante n'a ni slug ni créneau dans l'URL, ils sont
         * figés dessus : les appliquer là rendait le bouton muet, un retour
         * sans message, et le client cliquait dans le vide.
         */
        if (!reglementSeul && (!slug || !debut || !fin)) {
            setErreur("Ce créneau n’est plus disponible. Choisissez-en un autre.");

            return;
        }

        if (reglementSeul && !reservation?.uid) {
            setErreur("Cette réservation n’a pas fini de charger. Réessayez dans un instant.");

            return;
        }

        /*
         * La réservation s'adresse au véhicule par son identifiant chiffré,
         * pas par son slug : le parcours entier navigue au slug, mais le
         * serveur le déchiffre et répondrait « Ce véhicule est introuvable »
         * sur un véhicule parfaitement existant.
         */
        if (!reglementSeul && !vehicle?.uid) {
            setErreur("Le véhicule n’a pas fini de charger. Réessayez dans un instant.");

            return;
        }

        /*
         * Le numéro À DÉBITER, qui n'est pas forcément celui du contact. Il
         * n'était vérifié nulle part côté site : la passerelle le refusait, et
         * le client ne pouvait pas deviner lequel des deux numéros posait
         * problème.
         */
        if (method === "mobile" && !estValide(phone)) {
            setErreur("Le numéro à débiter n’est pas valide. Exemple : 0810000000.");

            return;
        }

        /*
         * Le commentaire exigé par LE TYPE, demandé ici.
         *
         * C'est la ligne du référentiel qui l'exige, pas un code écrit ici :
         * un quatrième type qui le demande sera traité sans relivraison. Le
         * serveur refuse de toute façon — on évite seulement au client d'aller
         * jusqu'au paiement pour l'apprendre.
         */
        if (!reglementSeul && typeCourse?.note_required && !commentaire.trim()) {
            setErreur(`Précisez votre course « ${typeCourse.title} » avant de continuer.`);

            return;
        }

        setErreur(null);
        // `ChoixPaiement` nomme ses deux boutons « carte » et « mobile », la
        // passerelle attend « cart » : le libelle de l'ecran et le litteral du
        // contrat ne sont pas la meme chose, et c'est le contrat qui fait foi.
        setEnCours(method === "cart" ? "carte" : "mobile");

        try {
            /*
             * Le numero change est ecrit sur le COMPTE, pas sur la
             * reservation : c'est celui-la que le chauffeur lira. L'echec
             * n'arrete pas la reservation — perdre une course parce qu'un
             * numero n'a pas pu etre enregistre serait absurde — mais il se
             * dit, sinon le client croirait avoir corrige son numero.
             */
            if (user && telephoneRetenu && telephoneRetenu !== telephoneDuCompte) {
                const reponse = await FetchData.sendData(Route.update_user, {
                    email: user.email,
                    name: user.name,
                    last_name: user.last_name,
                    // Reconverti au format local : le mobile analyse le numero
                    // du compte en supposant ce format, et l'international le
                    // lui rendrait illisible.
                    phone: pourLeCompte(telephoneRetenu),
                });

                if (reponse?.name === "AxiosError") {
                    setErreur(
                        "Votre numéro n'a pas pu être enregistré sur votre compte. La réservation continue.",
                    );
                }
            }

            let booking = reservation;

            if (!reglementSeul) {
                booking = await reserver.mutateAsync({
                    vehicle: vehicle!.uid,
                    starts_at: debut!,
                    ends_at: fin!,
                    pricing_mode: mode,
                    pickup_location: lieuDePriseEnCharge,
                    // La commune, quand on la connaît : c'est elle que le
                    // serveur confronte à la zone desservie.
                    pickup_town_id: zone.etat === "desservie" ? zone.townId : undefined,
                    // Le type, son commentaire et l'option parking. Absents,
                    // le serveur chiffre et accepte exactement comme avant.
                    course_type_id: typeCourse?.id,
                    course_note: commentaire.trim() || undefined,
                    parking: parking || undefined,
                });
            }

            if (!booking?.uid) {
                setErreur("Cette réservation est introuvable.");

                return;
            }

            const suivi = `${window.location.origin}/location/courses/${encodeURIComponent(booking.uid)}`;

            const resultat = await payerAcompte.mutateAsync({
                uid: booking.uid,
                method,
                phone: method === "mobile" ? (phone ?? "").replace(/\s+/g, "") : "",
                // La passerelle carte dépose le client sur ces adresses : sans
                // elles, il atterrit sur l'accueil du site et non sur sa course.
                success_url: suivi,
                error_url: suivi,
                cancel_url: suivi,
            });

            if (method === "cart") {
                if (!resultat?.url) {
                    setErreur("Le paiement par carte est momentanément indisponible.");

                    return;
                }

                window.location.href = resultat.url;

                return;
            }

            /*
             * Mobile money : le débit se confirme sur le combiné, pas ici. Le
             * client part sur le détail de sa course, qui relit l'état toutes
             * les cinq secondes et porte le compte à rebours. Le paramètre dit
             * à cette page qu'une demande vient de partir sur son téléphone :
             * sans un mot, il y lisait « en attente de paiement » sans savoir
             * qu'il avait quelque chose à valider.
             */
            setModalOuverte(false);
            router.push(`${suivi.replace(window.location.origin, "")}?paiement=engage`);
        } catch (e) {
            setErreur((e as Error).message);
        } finally {
            setEnCours(null);
        }
    };

    return (
        <div className="min-h-svh bg-surface-sunken pt-[calc(var(--header-h)+24px)]">
            <div className="mx-auto max-w-4xl px-4 pb-16 sm:px-5">
                <header className="mb-5">
                    <p className="text-caption text-ink-muted">
                        Étape {etape + 1} sur 2 · {noms.rental}
                    </p>
                    <h1 className="text-display font-extrabold text-secondaryColor">
                        {etape === 0 ? "Où vous prend-on ?" : "Vérifiez et payez l’acompte"}
                    </h1>
                    <p className="mt-2 text-body text-ink-muted">
                        {etape === 0
                            ? "Le chauffeur vient vous chercher à cette adresse."
                            : "L’acompte retient le véhicule, le reste se règle au chauffeur à la fin de la course."}
                    </p>
                </header>

                {/* Le véhicule reste visible aux deux étapes : au moment de
                    taper un numéro à débiter, le client ne voyait plus ce
                    qu'il réserve. */}
                {vehiculeAffiche ? (
                    <div className="mb-5 flex items-center gap-3 rounded-card border border-surface-border bg-surface p-3">
                        <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-control bg-surface-sunken">
                            <PhotoVehicule src={vehiculeAffiche.image} alt="" />
                        </span>

                        <div className="min-w-0">
                            <p className="line-clamp-1 text-body font-bold text-ink">
                                {vehiculeAffiche.name}
                            </p>
                            <p className="flex flex-wrap items-center gap-x-3 text-caption text-ink-muted">
                                {vehiculeAffiche.seats ? (
                                    <span className="flex items-center gap-1">
                                        <FaUsers aria-hidden /> {vehiculeAffiche.seats} personnes
                                    </span>
                                ) : null}
                                <span>
                                    {libelleDuMode(
                                        reglementSeul
                                            ? (reservation?.pricing_mode ?? mode)
                                            : (vehicle?.quote?.mode ?? mode),
                                    )}
                                </span>
                            </p>
                        </div>
                    </div>
                ) : null}

                {etape === 0 ? (
                    <section className="flex flex-col gap-5 rounded-card bg-surface p-4 shadow-card sm:p-6">
                        <p className="text-caption text-ink-muted">
                            Les champs marqués d&apos;un
                            <span className="text-danger" aria-hidden>
                                {" * "}
                            </span>
                            sont obligatoires.
                        </p>

                        {/* Le carnet en tete : on y revient pour reprendre une
                            adresse connue bien plus souvent que pour en saisir
                            une neuve. Meme disposition que cote repas. */}
                        {user && carnet.adresses.length ? (
                            <div className="flex flex-col gap-4">
                                <CarnetAdresses
                                    adresses={carnet.adresses}
                                    choisie={choisie}
                                    onChoisir={choisirDuCarnet}
                                    onSupprimer={supprimerDuCarnet}
                                />

                                <div className="flex items-center gap-3">
                                    <span className="h-px flex-1 bg-surface-border" />
                                    <span className="text-caption text-ink-subtle">
                                        ou saisir une nouvelle adresse
                                    </span>
                                    <span className="h-px flex-1 bg-surface-border" />
                                </div>
                            </div>
                        ) : null}

                        <div className="grid gap-5 sm:grid-cols-2">
                            {/*
                              * Le composant telephone du depot, et non un
                              * champ texte : il porte l'indicatif, le drapeau
                              * et le format du pays. C'est celui qu'utilise
                              * deja la fenetre mobile money — deux saisies
                              * differentes pour un numero, sur le meme site,
                              * se mettent a accepter des formes differentes.
                              */}
                            <PhoneNumber
                                className="w-full"
                                country="cd"
                                preferredCountries={["cd"]}
                                label={
                                    <>
                                        Votre téléphone
                                        <span className="text-danger" aria-hidden>
                                            {" *"}
                                        </span>
                                    </>
                                }
                                helperText="Le chauffeur vous appellera sur ce numéro"
                                value={telephone || telephoneDuCompte}
                                onChange={(valeur: string) => setTelephone(valeur)}
                                inputProps={{name: "telephone", required: true}}
                            />

                            <div className="flex flex-col">
                                <label
                                    htmlFor="commune-prise-en-charge"
                                    className="mb-2 text-caption font-semibold text-ink"
                                >
                                    Commune
                                    <span className="text-danger" aria-hidden>
                                        {" *"}
                                    </span>
                                </label>
                                <select
                                    id="commune-prise-en-charge"
                                    value={communeSlug}
                                    onChange={(e) => setCommuneSlug(e.target.value)}
                                    className="min-h-12 w-full rounded-control border border-surface-border bg-surface px-4 text-body text-ink outline-none transition-colors duration-150 focus:border-brand-500"
                                >
                                    <option value="">Sélectionner la commune</option>
                                    {referentiel?.town?.map((item) => (
                                        <option key={item.uid} value={item.slug}>
                                            {item.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <ChampTexte
                                label="Avenue"
                                requis
                                placeholder="Nom de votre avenue"
                                value={avenue}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setAvenue(e.target.value)
                                }
                            />

                            <ChampTexte
                                label="Numéro"
                                placeholder="Numéro de l'avenue"
                                value={numero}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setNumero(e.target.value)
                                }
                            />

                            <ChampTexte
                                label="Repère"
                                requis
                                placeholder="Un repère proche de vous"
                                aide="Ce qui aide le chauffeur à vous trouver"
                                value={repere}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setRepere(e.target.value)
                                }
                            />
                        </div>

                        {/*
                          * Le commentaire, quand le type le demande. Il vit
                          * avec l'adresse : c'est là que le client décrit sa
                          * course, pas au moment de payer.
                          */}
                        {typeCourse?.note_required ? (
                            <ChampTexte
                                label={`Précisions sur votre course « ${typeCourse.title} »`}
                                requis
                                placeholder="Destination, numéro de vol, heure d'arrivée…"
                                aide={typeCourse.description ?? undefined}
                                value={commentaire}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setCommentaire(e.target.value)
                                }
                            />
                        ) : null}

                        {zone.etat === "hors-zone" ? (
                            <HorsZone
                                message={configRental?.out_of_zone_message}
                                whatsapp={configRental?.whatsapp_number}
                                service={noms.rental}
                            />
                        ) : null}

                        {erreur ? (
                            <p
                                role="alert"
                                className="rounded-control bg-danger-surface px-4 py-3 text-caption font-semibold text-danger"
                            >
                                {erreur}
                            </p>
                        ) : null}

                        <button
                            type="button"
                            onClick={continuer}
                            className="inline-flex min-h-12 w-full items-center justify-center rounded-pill bg-brand-500 px-6 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600 sm:w-auto sm:self-end sm:px-10"
                        >
                            Continuer
                        </button>
                    </section>
                ) : (
                    <div className="flex flex-col gap-5">
                        <section className="flex flex-col gap-3 rounded-card bg-surface p-4 shadow-card sm:p-6">
                            <div className="flex items-start gap-2">
                                <FaCalendarDays className="mt-1 shrink-0 text-brand-600" aria-hidden />
                                <div className="min-w-0 flex-1">
                                    <p className="text-caption text-ink-muted">Créneau</p>
                                    <p className="text-body text-ink">
                                        {creneauLisible(
                                            reglementSeul ? reservation?.starts_at : debut,
                                            reglementSeul ? reservation?.ends_at : fin,
                                        )}
                                    </p>
                                    <p className="text-caption text-ink-subtle">
                                        Facturé{" "}
                                        {reglementSeul
                                            ? dureeFacturee(
                                                  reservation?.pricing_mode ?? mode,
                                                  reservation?.billed_units,
                                                  reservation?.duration_hours,
                                              )
                                            : dureeFacturee(
                                                  vehicle?.quote?.mode ?? mode,
                                                  vehicle?.quote?.billed_units,
                                                  vehicle?.quote?.duration_hours,
                                              )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2">
                                <FaLocationDot className="mt-1 shrink-0 text-ink-muted" aria-hidden />
                                <div className="min-w-0 flex-1">
                                    <p className="text-caption text-ink-muted">Prise en charge</p>
                                    <p className="text-body text-ink">
                                        {reglementSeul
                                            ? reservation?.pickup_location
                                            : lieuDePriseEnCharge}
                                    </p>
                                </div>

                                {/* L'adresse d'une réservation déjà créée ne se
                                    change plus ici : elle est figée dessus. */}
                                {reglementSeul ? null : (
                                    <button
                                        type="button"
                                        onClick={() => setEtape(0)}
                                        className="shrink-0 px-2 text-caption font-semibold text-brand-600 underline-offset-4 hover:underline"
                                    >
                                        Modifier
                                    </button>
                                )}
                            </div>

                            <div className="h-px bg-surface-border" />

                            <div className="flex items-center justify-between gap-3 rounded-control bg-surface-sunken px-3 py-2.5">
                                <span className="text-body font-semibold text-ink">
                                    {lignes.accent.libelle}
                                </span>
                                <strong className="text-title font-bold text-brand-700">
                                    {formatPrix(lignes.accent.montant, devise) || "—"}
                                </strong>
                            </div>

                            <dl className="flex flex-col gap-1.5">
                                {lignes.secondaires.map((ligne) => (
                                    <div key={ligne.cle} className="flex justify-between gap-3">
                                        <dt className="text-caption text-ink-muted">
                                            {ligne.libelle}
                                        </dt>
                                        <dd className="text-caption text-ink-muted">
                                            {formatPrix(ligne.montant, devise) || "—"}
                                        </dd>
                                    </div>
                                ))}
                            </dl>

                            <ul className="mt-1 flex flex-col gap-2">
                                {ENGAGEMENTS.map((phrase) => (
                                    <li key={phrase} className="flex items-start gap-2">
                                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-pill bg-success text-[9px] text-ink-inverse">
                                            <FaCheck aria-hidden />
                                        </span>
                                        <span className="text-caption text-ink-muted">
                                            {phrase}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {erreur ? (
                            <p
                                role="alert"
                                className="rounded-control bg-danger-surface px-4 py-3 text-caption font-semibold text-danger"
                            >
                                {erreur}
                            </p>
                        ) : null}

                        <ChoixPaiement
                            enCours={enCours}
                            onMobile={() => setModalOuverte(true)}
                            onCarte={() => payer("cart")}
                        />

                        <div className="flex flex-wrap items-center gap-4">
                            {reglementSeul ? null : (
                                <button
                                    type="button"
                                    onClick={() => setEtape(0)}
                                    className="min-h-11 text-caption font-semibold text-ink-muted underline-offset-4 hover:underline"
                                >
                                    Revenir à l’adresse
                                </button>
                            )}

                            <Link
                                href="/location"
                                className="min-h-11 text-caption font-semibold text-ink-muted underline-offset-4 hover:underline"
                            >
                                Choisir un autre véhicule
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <ModalMobileMoney
                ouvert={modalOuverte}
                onClose={() => setModalOuverte(false)}
                phone={phone}
                onPhone={setPhone}
                onSubmit={(e) => {
                    e.preventDefault();
                    payer("mobile");
                }}
                enCours={enCours === "mobile"}
                aide={`L’acompte de ${formatPrix(acompte, devise) || "—"} sera débité sur ce numéro.`}
            />
        </div>
    );
};

export default Page;
