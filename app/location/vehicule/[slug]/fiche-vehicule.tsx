"use client";

import React, {useMemo, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {FaChevronLeft, FaUsers} from "react-icons/fa6";

import {
    creneauRental,
    departLePlusTot,
    dureeFacturee,
    heuresPourMode,
    libelleDuMode,
    lignesDuPrix,
    ModeTarifaire,
    proposeLaJournee,
    seuilJourneeAvantageuse,
} from "@/helpers/rental";
import {formatPrix} from "@/helpers/openingHours";
import {useBornesDuree, useNomsCommerciaux, useRentalVehicle} from "@/hooks/useRental";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import EmptyState from "@/components/ui/EmptyState";
import Bascule from "@/components/rental/Bascule";
import PhotoVehicule from "@/components/rental/PhotoVehicule";
import SelecteurCreneau from "@/components/rental/SelecteurCreneau";

/**
 * Le départ par défaut : demain, même heure, minutes remises à zéro.
 *
 * Personne ne loue une voiture pour tout de suite, et un départ de demain
 * respecte largement le délai de prévenance. Le garde reste : il se règle en
 * administration et pourrait un jour dépasser vingt-quatre heures.
 */
const departParDefaut = (plusTot: Date) => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setMinutes(0, 0, 0);

    return date.getTime() < plusTot.getTime() ? plusTot : date;
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

    const [startsAt, setStartsAt] = useState(() => departParDefaut(departLePlusTot()));
    const [hours, setHours] = useState(3);
    const [mode, setMode] = useState<ModeTarifaire>("hourly");

    const creneau = useMemo(() => creneauRental(startsAt, hours), [startsAt, hours]);

    const {data: vehicle, isLoading} = useRentalVehicle(slug, creneau.debut, creneau.fin, mode);

    const devise = vehicle?.quote?.currency?.code ?? vehicle?.currency?.code;
    const libre = vehicle?.available !== false;

    const lignes = lignesDuPrix(vehicle?.quote);

    /*
     * Le choix du mode ne s'affiche que si le véhicule est proposé à la
     * journée : un segment unique n'est pas un choix, c'est du bruit, et il
     * laisserait croire qu'une option est indisponible.
     */
    const choixDuMode = proposeLaJournee(vehicle);

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
        setHours((heures) => heuresPourMode(choisi, heures, bornes));
    };

    const reserver = () => {
        const destination = `/location/reservation?slug=${encodeURIComponent(slug)}&starts_at=${encodeURIComponent(
            creneau.debut,
        )}&ends_at=${encodeURIComponent(creneau.fin)}&mode=${mode}`;

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
                                        <FaUsers aria-hidden /> {vehicle.seats} places
                                    </span>
                                ) : null}
                                <span>{vehicle.reference}</span>
                            </p>

                            {vehicle.description ? (
                                <p className="text-body leading-7 text-ink-muted">
                                    {vehicle.description}
                                </p>
                            ) : null}

                            <p className="text-body font-bold text-brand-700">
                                {formatPrix(vehicle.hourly_rate, devise)}
                                <span className="text-caption font-normal text-ink-muted">
                                    {" "}
                                    / heure
                                </span>
                            </p>
                        </div>
                    </section>

                    <div className="flex flex-col gap-5 lg:sticky lg:top-[calc(var(--header-h)+16px)]">
                        <section className="flex flex-col gap-4 rounded-card bg-surface p-4 shadow-card sm:p-5">
                            <h2 className="text-title font-bold text-ink">Votre créneau</h2>

                            {choixDuMode ? (
                                <Bascule
                                    etiquette="Mode de tarification"
                                    onglets={[
                                        {
                                            cle: "hourly",
                                            libelle: libelleDuMode("hourly"),
                                            detail: `${formatPrix(vehicle.hourly_rate, devise)} / heure`,
                                        },
                                        {
                                            cle: "daily",
                                            libelle: libelleDuMode("daily"),
                                            detail: `${formatPrix(vehicle.daily_rate, devise)} / jour`,
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
                                prixJournee={formatPrix(vehicle.daily_rate, devise)}
                                bornes={bornes}
                                nomService={noms.rental}
                                onChange={(date, duree) => {
                                    setStartsAt(date);
                                    setHours(duree);
                                }}
                            />
                        </section>

                        {/*
                         * Le détail du prix, puis l'acompte détaché sur un fond
                         * creux. Les trois montants à plat se lisaient comme
                         * une liste de courses : celui qu'il faut sortir
                         * maintenant ne se distinguait pas de celui qu'on
                         * paiera au chauffeur.
                         */}
                        <section className="flex flex-col gap-3 rounded-card bg-surface p-4 shadow-card sm:p-5">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-title font-bold text-ink">Ce que vous payez</h2>
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
                                    <div key={ligne.cle} className="flex justify-between gap-3">
                                        <dt className="text-body text-ink-muted">
                                            {ligne.libelle}
                                        </dt>
                                        <dd className="text-body font-semibold text-ink">
                                            {formatPrix(ligne.montant, devise) || "—"}
                                        </dd>
                                    </div>
                                ))}
                            </dl>

                            <div className="flex items-center justify-between gap-3 rounded-control bg-surface-sunken px-3 py-2.5">
                                <span className="text-body font-semibold text-ink">
                                    {lignes.accent.libelle}
                                </span>
                                <strong className="text-title font-bold text-brand-700">
                                    {formatPrix(lignes.accent.montant, devise) || "—"}
                                </strong>
                            </div>

                            <p className="text-caption text-ink-subtle">
                                Le véhicule n’est retenu qu’une fois l’acompte payé. Si quelqu’un
                                paie avant vous sur ce créneau, votre acompte vous est remboursé.
                            </p>

                            {!libre ? (
                                <p
                                    role="status"
                                    className="rounded-control bg-warning-surface px-3 py-2.5 text-caption text-warning"
                                >
                                    Ce véhicule est déjà pris sur ce créneau. Choisissez un autre
                                    horaire ou une autre durée.
                                </p>
                            ) : null}

                            <button
                                type="button"
                                onClick={reserver}
                                disabled={!libre}
                                className="mt-1 inline-flex min-h-12 w-full items-center justify-center rounded-pill bg-brand-500 px-6 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {!libre
                                    ? "Indisponible"
                                    : user
                                      ? "Réserver"
                                      : "Se connecter pour réserver"}
                            </button>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
