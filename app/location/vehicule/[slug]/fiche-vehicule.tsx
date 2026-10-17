"use client";

import React, {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {FaChevronLeft, FaUsers} from "react-icons/fa6";

import {
    creneauLisible,
    creneauRental,
    departLePlusTot,
    departTropProche,
    dureeFacturee,
    heuresPourMode,
    libelleDuMode,
    lignesDuPrix,
    minimumAnnonce,
    ModeTarifaire,
    proposeLaJournee,
    proposeLHeure,
    seuilJourneeAvantageuse,
} from "@/helpers/rental";
import {formatPrix} from "@/helpers/openingHours";
import {TypeCourse, useBornesDuree, useNomsCommerciaux, useRentalVehicle} from "@/hooks/useRental";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import EmptyState from "@/components/ui/EmptyState";
import Bascule from "@/components/rental/Bascule";
import ModalitesLocation from "@/components/rental/ModalitesLocation";
import PhotoVehicule from "@/components/rental/PhotoVehicule";
import TypeCoursePicker from "@/components/rental/TypeCoursePicker";
import {tarifApplique} from "@/helpers/tarifApplique";
import SelecteurCreneau from "@/components/rental/SelecteurCreneau";

/**
 * Le départ proposé à l'ouverture : la prochaine heure ronde réservable.
 *
 * C'était DEMAIN, même heure. Le propriétaire, le 17 octobre : « on est le 17
 * et je veux commander une voiture pour le 17, mais c'est impossible car
 * c'est le 18 qui apparaît ». Proposer demain à quelqu'un qui veut partir
 * dans deux heures lui fait corriger la date à chaque visite.
 *
 * On part donc du premier instant réservable et on arrondit à l'heure ronde
 * supérieure : la valeur proposée est déjà valable, et il n'y a rien à
 * corriger pour que le bouton s'ouvre.
 */
const departParDefaut = (plusTot: Date) => {
    const date = new Date(plusTot);

    // L'heure ronde d'APRÈS : arrondir vers le bas replacerait le départ
    // avant le délai, et refermerait le bouton qu'on vient d'ouvrir.
    if (date.getMinutes() > 0 || date.getSeconds() > 0) {
        date.setHours(date.getHours() + 1);
    }

    date.setMinutes(0, 0, 0);

    return date;
};

/**
 * La fiche d'un véhicule, et le choix du créneau.
 *
 * Décalque de `(rental)/vehicle.tsx` du mobile. C'est ici, et pas au
 * catalogue, que le client choisit ses dates : il regarde d'abord la voiture,
 * comme il regarde la carte d'un restaurant avant de commander. Le prix
 * n'existe qu'à partir de là, parce qu'il dépend des heures.
 *
 * Le montant affiché vient du serveur, jamais d'un calcul local : c'est la
 * règle posée après la faille des commandes de repas, où le prix venait du
 * client. Tant que la cotation n'est pas revenue, les montants sont absents et
 * un tiret s'affiche — on ne devine jamais un prix ici.
 */
export default function FicheVehicule({slug}: {slug: string}) {
    const router = useRouter();
    const {user} = useGetCurrentUser();
    const noms = useNomsCommerciaux();

    // Les bornes et le délai de prévenance viennent des réglages, pas du code :
    // ce sont des règles commerciales que le propriétaire change en
    // administration.
    const bornes = useBornesDuree();

    /*
     * Le temps passe pendant qu'on compose sa demande.
     *
     * Un creneau choisi a 23h50 pour 00h30 devient trop proche en restant a
     * l'ecran : le client cliquait « Reserver » et se faisait refuser par le
     * serveur sans avoir rien change. Ce battement rouvre la question toutes
     * les trente secondes, et le bouton se ferme tout seul.
     *
     * Trente secondes et non une : la minute affichee ne change pas plus
     * vite, et reveiller React a chaque seconde pour une bordure de delai
     * n'apporte rien.
     */
    const [horloge, setHorloge] = useState(() => Date.now());

    useEffect(() => {
        const battement = setInterval(() => setHorloge(Date.now()), 30_000);

        return () => clearInterval(battement);
    }, []);

    const [startsAt, setStartsAt] = useState(() => departParDefaut(departLePlusTot()));
    const [hours, setHours] = useState(3);
    const [mode, setMode] = useState<ModeTarifaire>("hourly");

    /*
     * Le type de course, et l'option parking qu'il propose parfois.
     *
     * Les deux changent le PRIX : ils entrent donc dans la requête de la
     * fiche, sinon l'écran annoncerait un montant que la réservation ne
     * tiendrait pas.
     */
    const [typeChoisi, setTypeChoisi] = useState<TypeCourse | null>(null);
    const [parking, setParking] = useState(false);

    const creneau = useMemo(() => creneauRental(startsAt, hours), [startsAt, hours]);

    const {data: vehicle, isLoading} = useRentalVehicle(
        slug,
        creneau.debut,
        creneau.fin,
        mode,
        typeChoisi?.id,
        parking,
    );

    const devise = vehicle?.quote?.currency?.code ?? vehicle?.currency?.code;
    const libre = vehicle?.available !== false;

    const lignes = lignesDuPrix(vehicle?.quote);

    /*
     * Le choix du mode ne s'affiche que si le véhicule est proposé à la
     * journée : un segment unique n'est pas un choix, c'est du bruit, et il
     * laisserait croire qu'une option est indisponible.
     */
    /*
     * Le tarif QUI S'APPLIQUE, et non celui du vehicule.
     *
     * La bascule annonçait le prix habituel pendant que le total appliquait
     * celui du type : deux nombres pour la meme course, et le client ne
     * savait pas lequel croire. Le serveur tranche, l'ecran lit.
     */
    /*
     * Les types proposes par CE vehicule, et non tout le referentiel.
     *
     * Configurer un tarif pour un type, c'est rendre ce type disponible sur ce
     * vehicule. Un vehicule sans aucun tarif n'en propose aucun, et l'ecran se
     * comporte alors exactement comme avant.
     */
    const typesCourse = vehicle?.course_types ?? [];

    const tarifHoraire = tarifApplique(vehicle, "hourly");
    const tarifJournalier = tarifApplique(vehicle, "daily");

    /*
     * Ce que le vehicule PROPOSE, et non ce qu'il a comme tarif.
     *
     * La bascule ne s'affiche que si les DEUX modes sont proposes : un
     * segment qu'on ne peut pas prendre n'est pas un choix. Et l'en-tete ne
     * porte que les tarifs proposes — afficher un prix qu'on ne peut pas
     * reserver est pire que de ne rien dire.
     */
    const journeeProposee = proposeLaJournee(vehicle);
    const heureProposee = proposeLHeure(vehicle);
    const choixDuMode = journeeProposee && heureProposee;

    /*
     * Le minimum le plus CONTRAIGNANT du vehicule et du type choisi : le
     * serveur refusera le plus strict, et annoncer le plus doux ferait
     * composer une demande vouee au refus.
     */
    const minimumHeures = minimumAnnonce(vehicle, typeChoisi);

    /*
     * « On ne peut pas commander a la meme heure, le minimum c'est 1 h
     * avant » : la meme regle que le serveur oppose, posee ici pour que le
     * client la voie avant de payer plutot qu'apres.
     */
    const tropProche = departTropProche(startsAt, bornes, horloge);

    /*
     * La fiche en etapes — « tu le mets en 2 ou 3 etapes pour ne pas
     * apparaitre long ».
     *
     * L'ETAPE DU TYPE DISPARAIT quand le vehicule n'en propose aucun : une
     * etape vide se compterait quand meme dans « 1 sur 3 » et allongerait
     * justement ce qu'on cherche a raccourcir. La plupart des vehicules n'en
     * proposent pas — ils verront deux etapes.
     *
     * Le vehicule, lui, reste visible a TOUTES les etapes dans la colonne de
     * gauche : on ne demande pas de choisir un creneau pour une voiture qu'on
     * ne voit plus. C'est deja le principe du tunnel de paiement.
     */
    const etapes = [
        ...(typesCourse.length ? (["course"] as const) : []),
        "creneau" as const,
        "prix" as const,
    ];

    const [etape, setEtape] = useState(0);

    const courante = etapes[Math.min(etape, etapes.length - 1)];
    const derniere = etape >= etapes.length - 1;

    const titres: Record<(typeof etapes)[number], {titre: string; detail: string}> = {
        course: {
            titre: "Quelle course ?",
            detail: "Le type choisi peut imposer la durée et le mode de tarification.",
        },
        creneau: {
            titre: "Votre créneau",
            detail: "Le prix se calcule à partir de ces dates.",
        },
        prix: {
            titre: "Ce que vous payez",
            detail: "L’acompte retient le véhicule, le reste se règle au chauffeur à la fin de la course.",
        },
    };

    /*
     * À partir de cette heure-là, la journée coûte moins cher que le cumul des
     * heures. Le plafond horaire reste celui demandé, mais le client est
     * prévenu avant de payer plus pour moins de voiture.
     */
    const seuilJournee = seuilJourneeAvantageuse(vehicle, bornes);

    const changerDeMode = (choisi: ModeTarifaire) => {
        setMode(choisi);
        // La durée suit le mode : trois heures facturées à la journée, c'est
        // une journée pleine, et le client ne l'apprendrait qu'au total.
        // Le mode PRECEDENT est passe : la conversion garde le nombre
        // affiche, et n'a pas a deviner l'unite d'ou il vient.
        setHours((heures) => heuresPourMode(choisi, heures, bornes, mode));
    };

    /**
     * Choisir un type peut imposer le mode et allonger la durée.
     *
     * Le serveur refuse l'autre mode plutôt que de basculer en silence ; on
     * évite donc au client de composer une demande vouée au refus. Les règles
     * viennent de la ligne du référentiel, jamais d'un code écrit ici.
     */
    const choisirLeType = (type: TypeCourse) => {
        setTypeChoisi(type);
        // L'option parking appartient au type : changer de type la referme.
        setParking(false);

        if (type.forced_mode && type.forced_mode !== mode) changerDeMode(type.forced_mode);

        if (type.minimum_hours) {
            setHours((heures) => Math.max(heures, type.minimum_hours!));
        }
    };

    const reserver = () => {
        const options = [
            typeChoisi ? `&course_type_id=${typeChoisi.id}` : "",
            parking ? "&parking=1" : "",
        ].join("");

        const destination = `/location/reservation?slug=${encodeURIComponent(slug)}&starts_at=${encodeURIComponent(
            creneau.debut,
        )}&ends_at=${encodeURIComponent(creneau.fin)}&mode=${mode}${options}`;

        if (!user) {
            // Le catalogue se regarde sans compte, réserver en demande un. On
            // garde le chemin du retour : le client retrouve le même véhicule
            // et le même créneau, et n'a pas à refaire son choix.
            router.push(`/login?retour=${encodeURIComponent(destination)}`);

            return;
        }

        router.push(destination);
    };

    if (isLoading && !vehicle) {
        return (
            <div className="min-h-svh bg-surface-sunken pt-[calc(var(--header-h)+24px)]">
                <div className="mx-auto flex max-w-[1100px] flex-col gap-4 px-4 pb-16 sm:px-5">
                    <div className="h-64 animate-pulse rounded-card bg-surface" />
                    <div className="h-52 animate-pulse rounded-card bg-surface" />
                </div>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="min-h-svh bg-surface-sunken pt-[calc(var(--header-h)+24px)]">
                <EmptyState
                    title="Véhicule introuvable"
                    message="Ce véhicule n'est plus proposé à la location."
                    action={
                        <Link
                            href="/location"
                            className="inline-flex min-h-11 items-center rounded-pill bg-brand-500 px-7 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600"
                        >
                            Retour au catalogue
                        </Link>
                    }
                />
            </div>
        );
    }

    return (
        <div className="min-h-svh bg-surface-sunken pt-[calc(var(--header-h)+24px)]">
            <div className="mx-auto max-w-[1100px] px-4 pb-16 sm:px-5">
                <Link
                    href="/location"
                    className="mb-4 inline-flex min-h-11 items-center gap-2 text-caption font-semibold text-ink-muted hover:text-ink"
                >
                    <FaChevronLeft aria-hidden /> Tous les véhicules
                </Link>

                <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr] lg:items-start">
                    <section className="overflow-hidden rounded-card bg-surface shadow-card">
                        <div className="relative h-56 w-full sm:h-80">
                            <PhotoVehicule src={vehicle.image} alt="" />
                        </div>

                        <div className="flex flex-col gap-2 p-4 sm:p-5">
                            <h1 className="text-display font-extrabold text-secondaryColor">
                                {vehicle.name}
                            </h1>

                            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-ink-muted">
                                {vehicle.seats ? (
                                    <span className="flex items-center gap-1">
                                        <FaUsers aria-hidden /> {vehicle.seats} personnes
                                    </span>
                                ) : null}
                                <span>{vehicle.reference}</span>
                            </p>

                            {vehicle.description ? (
                                <p className="text-body leading-7 text-ink-muted">
                                    {vehicle.description}
                                </p>
                            ) : null}

                            <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-body font-bold text-brand-700">
                                {heureProposee ? (
                                    <span>
                                        {formatPrix(tarifHoraire, devise)}
                                        <span className="text-caption font-normal text-ink-muted">
                                            {" "}
                                            / heure
                                        </span>
                                    </span>
                                ) : null}

                                {journeeProposee ? (
                                    <span>
                                        {formatPrix(tarifJournalier, devise)}
                                        <span className="text-caption font-normal text-ink-muted">
                                            {" "}
                                            / jour
                                        </span>
                                    </span>
                                ) : null}
                            </p>

                            <ModalitesLocation
                                minimumHeures={minimumHeures}
                                acompte={vehicle.deposit_percentage}
                                montantAcompte={vehicle.quote?.deposit}
                                montantSolde={vehicle.quote?.balance}
                                devise={devise}
                            />
                        </div>
                    </section>

                    <div className="flex flex-col gap-5 lg:sticky lg:top-[calc(var(--header-h)+16px)]">
                        <section className="flex flex-col gap-4 rounded-card bg-surface p-4 shadow-card sm:p-5">
                            {/*
                              * L'indicateur est celui du tunnel de paiement :
                              * un formulaire decoupe sans repere est vecu
                              * comme plus long qu'un formulaire d'un seul
                              * tenant.
                              */}
                            <header className="flex flex-col gap-1">
                                <p className="text-caption text-ink-muted">
                                    Étape {etape + 1} sur {etapes.length}
                                </p>
                                <h2 className="text-title font-bold text-ink">
                                    {titres[courante].titre}
                                </h2>
                                <p className="text-caption text-ink-muted">
                                    {titres[courante].detail}
                                </p>

                                <div className="mt-1 flex gap-1.5" aria-hidden>
                                    {etapes.map((cle, rang) => (
                                        <span
                                            key={cle}
                                            className={`h-1 flex-1 rounded-pill transition-colors duration-200 ${
                                                rang <= etape ? "bg-brand-500" : "bg-surface-border"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </header>

                            {courante === "course" ? (
                                <TypeCoursePicker
                                    types={typesCourse}
                                    choisi={typeChoisi}
                                    onChoisir={choisirLeType}
                                    parking={parking}
                                    onParking={setParking}
                                    devise={devise}
                                />
                            ) : null}

                            {courante === "creneau" ? (
                                <>
                                    {/*
                                      * La bascule reste AVEC le creneau : elle
                                      * change la duree, et les separer ferait
                                      * revenir en arriere pour corriger ce
                                      * qu'on vient de poser.
                                      */}
                                    {choixDuMode ? (
                                        <Bascule
                                            etiquette="Mode de tarification"
                                            onglets={[
                                                {
                                                    cle: "hourly",
                                                    libelle: libelleDuMode("hourly"),
                                                    detail: `${formatPrix(tarifHoraire, devise)} / heure`,
                                                },
                                                {
                                                    cle: "daily",
                                                    libelle: libelleDuMode("daily"),
                                                    detail: `${formatPrix(tarifJournalier, devise)} / jour`,
                                                },
                                            ]}
                                            choisi={mode}
                                            onChoisir={changerDeMode}
                                        />
                                    ) : null}

                                    <SelecteurCreneau
                                        startsAt={startsAt}
                                        hours={hours}
                                        mode={mode}
                                        peutBasculer={choixDuMode}
                                        seuilJournee={seuilJournee}
                                        prixJournee={formatPrix(tarifJournalier, devise)}
                                        bornes={bornes}
                                        nomService={noms.rental}
                                        onChange={(date, duree) => {
                                            setStartsAt(date);
                                            setHours(duree);
                                        }}
                                    />
                                </>
                            ) : null}

                            {courante === "prix" ? (
                                <>
                                    <div className="flex items-baseline justify-between gap-3">
                                        <span className="text-caption text-ink-muted">
                                            {creneauLisible(creneau.debut, creneau.fin)}
                                        </span>
                                        <span className="text-caption text-ink-muted">
                                            {dureeFacturee(
                                                vehicle.quote?.mode ?? mode,
                                                vehicle.quote?.billed_units,
                                                hours,
                                            )}
                                        </span>
                                    </div>

                                    <dl className="flex flex-col gap-1.5">
                                        {lignes.secondaires.map((ligne) => (
                                            <div
                                                key={ligne.cle}
                                                className="flex justify-between gap-3"
                                            >
                                                <dt className="text-body text-ink-muted">
                                                    {ligne.libelle}
                                                </dt>
                                                <dd className="text-body font-semibold text-ink">
                                                    {formatPrix(ligne.montant, devise) || "—"}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>

                                    <p className="text-caption text-ink-subtle">
                                        Le véhicule n’est retenu qu’une fois l’acompte payé. Si
                                        quelqu’un paie avant vous sur ce créneau, votre acompte
                                        vous est remboursé.
                                    </p>

                                    {!libre ? (
                                        <p
                                            role="status"
                                            className="rounded-control bg-warning-surface px-3 py-2.5 text-caption text-warning"
                                        >
                                            Ce véhicule est déjà pris sur ce créneau. Revenez à
                                            l’étape précédente pour choisir un autre horaire.
                                        </p>
                                    ) : null}
                                </>
                            ) : null}
                        </section>

                        {/*
                         * L'acompte reste visible a TOUTES les etapes : c'est
                         * la somme qu'on va demander, et la perdre de vue en
                         * cours de route serait un recul.
                         */}
                        <section className="flex flex-col gap-3 rounded-card bg-surface p-4 shadow-card sm:p-5">
                            <div className="flex items-center justify-between gap-3 rounded-control bg-surface-sunken px-3 py-2.5">
                                <span className="text-body font-semibold text-ink">
                                    {lignes.accent.libelle}
                                </span>
                                <strong className="text-title font-bold text-brand-700">
                                    {formatPrix(lignes.accent.montant, devise) || "—"}
                                </strong>
                            </div>

                            <div className="flex items-center gap-3">
                                {etape > 0 ? (
                                    <button
                                        type="button"
                                        onClick={() => setEtape((rang) => rang - 1)}
                                        className="inline-flex min-h-12 items-center justify-center rounded-pill border border-surface-border bg-surface px-6 text-body font-semibold text-ink transition-colors duration-150 hover:bg-surface-sunken"
                                    >
                                        Retour
                                    </button>
                                ) : null}

                                {/*
                                 * L'indisponibilite ne bloque que la DERNIERE
                                 * etape : un creneau pris se change a l'etape
                                 * d'avant, et figer le bouton des le debut
                                 * empecherait justement d'y aller.
                                 */}
                                <button
                                    type="button"
                                    onClick={
                                        derniere ? reserver : () => setEtape((rang) => rang + 1)
                                    }
                                    disabled={derniere && (!libre || tropProche)}
                                    className="inline-flex min-h-12 flex-1 items-center justify-center rounded-pill bg-brand-500 px-6 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {!derniere
                                        ? "Continuer"
                                        : tropProche
                                          ? "Départ trop proche"
                                          : !libre
                                            ? "Indisponible"
                                          : user
                                            ? "Réserver"
                                            : "Se connecter pour réserver"}
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
