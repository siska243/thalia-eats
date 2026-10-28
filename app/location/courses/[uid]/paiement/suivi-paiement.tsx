"use client";

import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import {Suspense, useEffect} from "react";

import Spinner from "@/components/Loader/Spinner";
import {useRentalBooking} from "@/hooks/useRental";

/**
 * Le suivi du paiement de l'acompte.
 *
 * Une page a elle seule, et non une banniere sur la fiche de la course : le
 * client qui revient d'une passerelle a une seule question, « est-ce que
 * c'est passe ? », et la fiche lui repondait en lui remontrant l'ecran de
 * reglement qu'il venait de quitter.
 *
 * Elle lit l'issue annoncee par la passerelle, mais ne s'y fie pas : seul le
 * webhook tranche, et c'est le STATUT de la reservation qui fait foi. Le
 * marqueur d'URL sert a parler tout de suite, pas a conclure — sans quoi une
 * adresse recopiee a la main annoncerait un paiement qui n'a pas eu lieu.
 *
 * Des que l'acompte est enregistre, le client part sur sa course : c'est le
 * sondage qui decide du moment, pas un delai pose au hasard.
 */
const Corps = ({uid}: {uid: string}) => {
    const router = useRouter();
    const params = useSearchParams();
    const issue = params.get("issue");

    const {data: booking, isLoading} = useRentalBooking(uid, true);

    const enAttente = !booking || booking.status === "pending_payment";
    const echoue = issue === "refus" || issue === "annule";

    /*
     * L'acompte est arrive : on emmene le client sur sa course.
     *
     * `replace` et non `push` : le bouton Retour du navigateur ne doit pas
     * ramener sur un ecran d'attente qui n'a plus lieu d'etre.
     */
    useEffect(() => {
        if (booking && booking.status !== "pending_payment") {
            router.replace(`/location/courses/${encodeURIComponent(uid)}`);
        }
    }, [booking, router, uid]);

    const reprendre = `/location/reservation?uid=${encodeURIComponent(uid)}`;

    return (
        <div className="min-h-svh bg-surface-sunken pt-[calc(var(--header-h)+24px)]">
            <div className="mx-auto max-w-xl px-4 pb-16 sm:px-5">
                <section className="flex flex-col gap-4 rounded-card bg-surface p-6 shadow-card">
                    {echoue ? (
                        <>
                            <h1 className="text-title font-bold text-secondaryColor">
                                {issue === "annule" ? "Paiement abandonné" : "Paiement refusé"}
                            </h1>

                            <p role="alert" className="text-body text-ink-muted">
                                {issue === "annule"
                                    ? "Vous avez quitté la page de paiement. Rien n’a été débité."
                                    : "Votre banque a refusé l’opération. Rien n’a été débité : vérifiez le solde ou les plafonds de votre carte."}
                            </p>

                            <p className="text-caption text-ink-subtle">
                                Le véhicule reste retenu jusqu’à l’échéance de la réservation. Vous
                                pouvez réessayer dès maintenant.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href={reprendre}
                                    className="inline-flex min-h-11 items-center rounded-pill bg-brand-500 px-7 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600"
                                >
                                    Recommencer le paiement
                                </Link>

                                <Link
                                    href={`/location/courses/${encodeURIComponent(uid)}`}
                                    className="inline-flex min-h-11 items-center text-body font-semibold text-ink-muted underline-offset-4 hover:underline"
                                >
                                    Voir ma course
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 className="text-title font-bold text-secondaryColor">
                                Paiement en attente
                            </h1>

                            <div className="flex items-center gap-3 text-body text-ink-muted">
                                <Spinner />
                                <p role="status">
                                    {issue === "succes"
                                        ? "Paiement accepté par votre banque. Nous attendons la confirmation de l’opérateur."
                                        : "Une demande de paiement est partie sur votre téléphone. Validez-la pour retenir le véhicule."}
                                </p>
                            </div>

                            <p className="text-caption text-ink-subtle">
                                Cette page se met à jour toute seule : dès que l’acompte est
                                enregistré, vous arrivez sur votre course. Ne fermez pas la page.
                            </p>

                            {!isLoading && enAttente ? (
                                <Link
                                    href={reprendre}
                                    className="inline-flex min-h-11 items-center text-body font-semibold text-ink-muted underline-offset-4 hover:underline"
                                >
                                    Le paiement n’aboutit pas ? Recommencer
                                </Link>
                            ) : null}
                        </>
                    )}
                </section>
            </div>
        </div>
    );
};

/*
 * `useSearchParams` impose une frontiere de Suspense : sans elle, la page
 * entiere bascule en rendu dynamique au build.
 */
export default function SuiviPaiement({uid}: {uid: string}) {
    return (
        <Suspense fallback={null}>
            <Corps uid={uid} />
        </Suspense>
    );
}
