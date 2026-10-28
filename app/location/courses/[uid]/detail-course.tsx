"use client";

import React, {Suspense, useState} from "react";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {FaChevronLeft} from "react-icons/fa6";

import {
    creneauLisible,
    dureeFacturee,
    finLisible,
    formatDateStringFr,
    formatDateTimeStringFr,
    formatTime,
    lignesDuPrix,
} from "@/helpers/rental";
import {formatPrix} from "@/helpers/openingHours";
import useExpiration from "@/hooks/useExpiration";
import {useRentalActions, useRentalBooking} from "@/hooks/useRental";
import Notify from "@/components/toastify/Notify";
import EmptyState from "@/components/ui/EmptyState";
import BlocChauffeur from "@/components/rental/BlocChauffeur";
import CarteSuivi from "@/components/rental/CarteSuivi";
import CodePriseEnCharge from "@/components/rental/CodePriseEnCharge";
import PastilleStatut from "@/components/rental/PastilleStatut";
import PhotoVehicule from "@/components/rental/PhotoVehicule";
import ProgressionCourse from "@/components/rental/ProgressionCourse";
import VueAPayer from "@/components/rental/VueAPayer";
import {apparenceDuStatut, compositionDeLaCourse} from "@/components/rental/statutCourse";

/** Une ligne libellé à gauche, valeur à droite : le bloc de détail du reçu. */
const Ligne = ({libelle, valeur}: {libelle: string; valeur?: string | null}) =>
    valeur ? (
        <div className="flex items-start justify-between gap-6">
            <dt className="shrink-0 text-body text-ink-muted">{libelle}</dt>
            <dd className="text-right text-body font-semibold text-ink">{valeur}</dd>
        </div>
    ) : null;

export default function DetailCourse({uid}: {uid: string}) {
    return (
        <Suspense>
            <Corps uid={uid} />
        </Suspense>
    );
}

/**
 * Le détail d'une course.
 *
 * Décalque de `(rental)/booking.tsx` du mobile. La page ne grise rien et ne
 * masque rien : elle se compose autrement selon l'état. Tant que l'acompte
 * n'est pas payé, il n'y a ni voiture attribuée ni chauffeur — le serveur
 * envoie `null`, et ces blocs n'existent tout simplement pas. Une fois la
 * course payée ils apparaissent, et ils disparaissent à la descente : le
 * chauffeur n'est plus le vôtre.
 *
 * Cette répartition est écrite une seule fois, dans `compositionDeLaCourse`.
 * La tester ici, bloc par bloc, aurait mis cinq fois la même règle dans un
 * seul fichier — le motif derrière deux bugs de production de ce produit.
 */
const Corps = ({uid}: {uid: string}) => {
    const params = useSearchParams();

    /*
     * Une demande de paiement vient de partir sur le combiné du client. Le
     * sondage ne s'allume que dans ce cas : c'est le webhook qui tranche, et
     * relire toutes les cinq secondes une course consultée au hasard n'avance
     * personne.
     */
    const retourPaiement = params.get("paiement");
    const paiementEngage = retourPaiement === "engage";

    /*
     * Ce que la passerelle a repondu au navigateur, en carte.
     *
     * Les trois adresses de retour etaient identiques : la page ne pouvait
     * pas distinguer un acompte accepte d'une carte refusee, et un client
     * dont la carte n'etait pas approvisionnee revenait sur une page muette,
     * exactement comme s'il avait paye.
     *
     * Ce marqueur ne fait pas foi — seul le webhook tranche, et le statut
     * affiche plus bas reste la verite. Il sert a dire tout de suite ce qui
     * vient de se passer, au lieu de laisser attendre une confirmation qui
     * ne viendra jamais.
     */
    const issueCarte =
        retourPaiement === "succes" || retourPaiement === "refus" || retourPaiement === "annule"
            ? retourPaiement
            : null;

    // En retour de carte acceptee, l'acompte n'est pas encore enregistre :
    // le webhook arrive de serveur a serveur, quelques secondes plus tard.
    const sondage = paiementEngage || issueCarte === "succes";

    const {data: booking, isLoading, refetch} = useRentalBooking(uid, sondage);
    const {annuler} = useRentalActions();

    const [confirmeAnnulation, setConfirmeAnnulation] = useState(false);
    const [annulation, setAnnulation] = useState(false);

    /*
     * Le délai vit au-dessus de l'affichage : la page s'en sert pour décider
     * si elle propose encore de payer, pas seulement pour montrer un chiffre.
     * Un minuteur dans le seul composant du compte à rebours aurait laissé le
     * bouton « Payer » actif quelques secondes après l'expiration.
     */
    const {minutes, ecoule, ton} = useExpiration(booking?.expires_at);

    const demanderAnnulation = async () => {
        setAnnulation(true);

        try {
            await annuler.mutateAsync({uid});
            await refetch();
            setConfirmeAnnulation(false);
            Notify("Réservation annulée", "success");
        } catch (e) {
            Notify((e as Error).message, "error");
        } finally {
            setAnnulation(false);
        }
    };

    if (!booking) {
        return (
            <div className="min-h-svh bg-surface-sunken pt-[calc(var(--header-h)+24px)]">
                <EmptyState
                    title={isLoading ? "Chargement…" : "Réservation introuvable"}
                    action={
                        isLoading ? undefined : (
                            <Link
                                href="/location/courses"
                                className="inline-flex min-h-11 items-center rounded-pill bg-brand-500 px-7 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600"
                            >
                                Mes courses
                            </Link>
                        )
                    }
                />
            </div>
        );
    }

    const devise = booking.currency?.code;
    const apparence = apparenceDuStatut(booking.status);
    const composition = compositionDeLaCourse(booking.status);
    const lignes = lignesDuPrix(booking, composition.accentPrix);

    const duree = dureeFacturee(
        booking.pricing_mode ?? "hourly",
        booking.billed_units,
        booking.duration_hours,
    );

    /*
     * Expirée, une réservation ne se paie plus : le serveur a relâché le
     * créneau, et le bouton aurait engagé un paiement pour une voiture qui
     * n'est plus retenue. L'échéance peut passer pendant que la page est
     * ouverte — le statut, lui, n'est rafraîchi qu'au prochain aller-retour.
     */
    const peutPayer = composition.actionPayer && !ecoule;

    return (
        <div className="min-h-svh bg-surface-sunken pt-[calc(var(--header-h)+24px)]">
            <div className="mx-auto max-w-[1100px] px-4 pb-16 sm:px-5">
                <div className="mb-4 flex items-center gap-3">
                    <Link
                        href="/location/courses"
                        aria-label="Revenir à mes courses"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-surface text-ink shadow-card transition-colors duration-150 hover:bg-surface-sunken"
                    >
                        <FaChevronLeft aria-hidden />
                    </Link>

                    <h1 className="flex-1 text-title font-bold text-secondaryColor">Ma course</h1>

                    <PastilleStatut status={booking.status} />
                </div>

                {paiementEngage && booking.status === "pending_payment" ? (
                    <p
                        role="status"
                        className="mb-4 rounded-card bg-brand-50 px-4 py-3 text-body text-brand-700"
                    >
                        Une demande de paiement vient de partir sur votre téléphone. Validez-la
                        pour retenir le véhicule : cette page se met à jour toute seule.
                    </p>
                ) : null}

                {/*
                  * Le retour de la carte, dit en clair.
                  *
                  * Un acompte deja enregistre l'emporte sur le marqueur : si
                  * le webhook est arrive pendant le retour du client, le
                  * statut dit « confirme » et il n'y a plus rien a annoncer.
                  */}
                {issueCarte === "succes" && booking.status === "pending_payment" ? (
                    <p
                        role="status"
                        className="mb-4 rounded-card bg-brand-50 px-4 py-3 text-body text-brand-700"
                    >
                        Paiement accepté par votre banque. Nous attendons la confirmation de
                        l’opérateur : cette page se met à jour toute seule.
                    </p>
                ) : null}

                {issueCarte === "refus" ? (
                    <p
                        role="alert"
                        className="mb-4 rounded-card bg-danger-surface px-4 py-3 text-body font-semibold text-danger"
                    >
                        Votre paiement a été refusé, rien n’a été débité. Vérifiez le solde ou les
                        plafonds de votre carte, puis réessayez : le véhicule reste réservé
                        jusqu’à l’échéance ci-dessous.
                    </p>
                ) : null}

                {issueCarte === "annule" ? (
                    <p
                        role="status"
                        className="mb-4 rounded-card bg-warning-surface px-4 py-3 text-body font-semibold text-warning"
                    >
                        Paiement abandonné, rien n’a été débité. Vous pouvez réessayer tant que le
                        créneau n’est pas repris.
                    </p>
                ) : null}

                {composition.actionPayer ? (
                    <VueAPayer booking={booking} minutes={minutes} ton={ton} ecoule={ecoule} />
                ) : (
                    <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
                        {/*
                         * La carte de tête : la voiture, sa référence, et les
                         * deux informations qui situent la course — quand, et
                         * combien de temps.
                         */}
                        <section className="flex flex-col gap-3 rounded-card bg-surface p-4 shadow-card">
                            <div className="flex items-center gap-3.5">
                                <span className="relative h-[76px] w-[104px] shrink-0 overflow-hidden rounded-control bg-surface-sunken">
                                    <PhotoVehicule src={booking.vehicle?.image} alt="" />
                                </span>

                                <div className="min-w-0">
                                    <p className="line-clamp-2 text-body font-bold text-ink">
                                        {booking.vehicle?.name ?? "Votre véhicule"}
                                    </p>
                                    <p className="text-caption text-ink-subtle">
                                        {booking.reference}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 border-t border-surface-border pt-3">
                                <div className="flex-1">
                                    <p className="text-caption text-ink-muted">Prise en charge</p>
                                    <p className="text-body font-semibold text-ink">
                                        {formatDateStringFr(booking.starts_at)}
                                    </p>
                                    <p className="text-caption text-ink-muted">
                                        {formatTime(booking.starts_at)}
                                    </p>
                                </div>

                                <div className="flex-1">
                                    <p className="text-caption text-ink-muted">Durée</p>
                                    <p className="text-body font-semibold text-ink">{duree}</p>
                                    <p className="text-caption text-ink-muted">
                                        {finLisible(booking.starts_at, booking.ends_at)}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Le chemin parcouru, en pastilles reliées. Rien sur
                            une course annulée ou expirée : elle s'est arrêtée
                            en route. */}
                        <section className="flex flex-col gap-2 rounded-card bg-surface p-4 shadow-card">
                            {composition.etapesFranchies !== null ? (
                                <>
                                    <ProgressionCourse status={booking.status} />
                                    <p className="text-center text-caption text-ink-muted">
                                        {apparence.aide}
                                    </p>
                                </>
                            ) : (
                                <p className="text-body text-ink-muted">{apparence.aide}</p>
                            )}
                        </section>

                        {/* Où en est la voiture. Dès que la course est payée :
                            avant le départ c'est le rendez-vous qui compte,
                            pendant la course c'est la voiture qui avance. */}
                        {composition.carteSuivi ? (
                            <CarteSuivi uid={uid} status={booking.status} />
                        ) : null}

                        {composition.vehiculeEtChauffeur ? (
                            <BlocChauffeur
                                plaque={booking.plate_number}
                                chauffeur={booking.chauffeur}
                            />
                        ) : null}

                        {/*
                         * Le code de départ. Il n'existe qu'une fois l'acompte
                         * payé : avant, il n'y a rien à prouver. Le chauffeur
                         * le demande et le saisit — il ne le reçoit jamais,
                         * sinon il pourrait déclarer une course qu'il n'a pas
                         * faite. Une fois à bord il ne sert plus, et il quitte
                         * la page.
                         */}
                        {composition.codePriseEnCharge && booking.pickup_code ? (
                            <CodePriseEnCharge
                                code={booking.pickup_code}
                                reference={booking.reference}
                            />
                        ) : null}

                        {/* Le bloc de détail du reçu : libellé à gauche, valeur
                            à droite, rien d'autre. Une ligne sans valeur ne se
                            dessine pas — pas de « Destination : — ». */}
                        <section className="rounded-card bg-surface p-4 shadow-card">
                            <dl className="flex flex-col gap-2.5">
                                <Ligne libelle="Départ" valeur={booking.pickup_location} />
                                <Ligne libelle="Destination" valeur={booking.dropoff_location} />
                                <Ligne
                                    libelle="Créneau"
                                    valeur={creneauLisible(booking.starts_at, booking.ends_at)}
                                />
                                <Ligne
                                    libelle="Terminée le"
                                    valeur={
                                        booking.completed_at
                                            ? formatDateTimeStringFr(booking.completed_at)
                                            : null
                                    }
                                />
                                <Ligne
                                    libelle="Annulée le"
                                    valeur={
                                        booking.cancelled_at
                                            ? formatDateTimeStringFr(booking.cancelled_at)
                                            : null
                                    }
                                />
                                <Ligne libelle="Motif" valeur={booking.cancellation_reason} />
                            </dl>
                        </section>

                        {/*
                         * La somme mise en avant change avec l'état : l'acompte
                         * tant qu'il reste à régler, le solde une fois la place
                         * acquise, le total quand tout est derrière. C'est
                         * `compositionDeLaCourse` qui le décide, pas la mise en
                         * forme.
                         */}
                        <section className="flex flex-col gap-3 rounded-card bg-surface p-4 shadow-card">
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

                            {booking.refund_amount ? (
                                <p className="rounded-control bg-warning-surface px-3 py-2 text-caption text-warning">
                                    Remboursement dû :{" "}
                                    <strong className="font-bold">
                                        {formatPrix(booking.refund_amount, devise)}
                                    </strong>
                                    {booking.refunded_at
                                        ? " · déjà versé"
                                        : " · traité par notre équipe"}
                                </p>
                            ) : null}
                        </section>
                    </div>
                )}

                {/* Les actions, sous le contenu : payer est ce pour quoi le
                    client ouvre cette page. */}
                {peutPayer || ecoule || composition.annulable ? (
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        {peutPayer ? (
                            <Link
                                href={`/location/reservation?uid=${encodeURIComponent(uid)}`}
                                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-pill bg-brand-500 px-6 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600"
                            >
                                Payer l’acompte
                            </Link>
                        ) : null}

                        {/* Expirée, la seule issue est de rechoisir : la page le
                            dit et y mène, au lieu de laisser le client devant
                            un bouton qui échouerait. */}
                        {ecoule && composition.actionPayer ? (
                            <Link
                                href="/location"
                                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-pill bg-brand-500 px-6 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600"
                            >
                                Voir les véhicules
                            </Link>
                        ) : null}

                        {composition.annulable ? (
                            confirmeAnnulation ? (
                                <div className="flex flex-1 items-center gap-2 rounded-control border border-danger px-3 py-2">
                                    <span className="flex-1 text-caption text-danger">
                                        {booking.status === "confirmed"
                                            ? "Annuler ? Votre acompte vous sera remboursé par notre équipe."
                                            : "Annuler cette réservation ? Aucun paiement n’a encore été enregistré."}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setConfirmeAnnulation(false)}
                                        className="min-h-11 px-2 text-caption font-semibold text-ink-muted"
                                    >
                                        Non
                                    </button>
                                    <button
                                        type="button"
                                        onClick={demanderAnnulation}
                                        disabled={annulation}
                                        className="min-h-11 rounded-pill bg-danger px-4 text-caption font-bold text-white disabled:opacity-60"
                                    >
                                        Oui
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setConfirmeAnnulation(true)}
                                    className="inline-flex min-h-12 items-center justify-center rounded-pill border border-danger px-6 text-body font-bold text-danger transition-colors duration-150 hover:bg-danger-surface"
                                >
                                    Annuler la réservation
                                </button>
                            )
                        ) : null}
                    </div>
                ) : null}
            </div>
        </div>
    );
};
