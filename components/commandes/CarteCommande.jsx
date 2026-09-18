"use client";

import {useState} from "react";
import Link from "next/link";
import {FaLocationDot, FaReceipt} from "react-icons/fa6";
import ImagePlat from "@/components/ui/ImagePlat";
import {dateTimeFormat} from "@/helpers/calculePrice";
import {formatPrix} from "@/helpers/openingHours";
import {FetchData} from "@/helpers/FetchData";
import {Route} from "@/helpers/Route";
import {notification} from "@/hooks/useCreateOrdering";

/** Statut « En attente paiement » : la commande existe mais n'est pas reglee. */
export const STATUT_ATTENTE_PAIEMENT = 5;

/**
 * Une commande, en cours ou terminee.
 *
 * Reprise a l'identique de `components/orders/order-card.tsx` du mobile, parce
 * que les deux clients parlent de la meme commande au meme client : ils ne
 * peuvent pas en dire des choses differentes.
 *
 * Trois comportements venaient du mobile et manquaient au web :
 *
 * - le code de confirmation est **cache tant que la commande n'est pas payee**.
 *   Il est genere des que FlexPay accepte la demande, donc avant que le
 *   paiement aboutisse : l'afficher a ce moment laissait croire au client que
 *   sa commande etait confirmee alors qu'elle attendait son reglement.
 * - la couleur du badge vient de `status.color`, defini dans le back-office.
 *   Le web peignait ses propres couleurs, si bien qu'ajouter un statut en
 *   administration ne se voyait que sur le telephone.
 * - les actions dependent du statut : « Payer » tant que la commande n'est pas
 *   reglee, « Suivre ma commande » ensuite, et l'annulation seulement pendant
 *   l'attente de paiement. Le web proposait « Annuler » plus largement.
 */
export default function CarteCommande({commande, actionnable, onChange, onSuivre}) {
    const [annulation, setAnnulation] = useState(false);
    const [confirme, setConfirme] = useState(false);

    const attentePaiement = commande?.status?.id === STATUT_ATTENTE_PAIEMENT;
    // La devise vient de la commande. Elle etait deduite du premier produit,
    // ce qui laissait les commandes sans produit — il en existe en base —
    // afficher leur total sans unite : « 2,3 ». Le repli sur le produit reste
    // pour les applications mobiles deja installees, qui parlent a une API
    // qui n'exposait pas encore le champ.
    const devise =
        commande?.currency?.code ?? commande?.products?.[0]?.currency?.code;
    const couleur = commande?.status?.color;

    const lignes = commande?.products ?? [];
    const visibles = lignes.slice(0, 4);
    const reste = lignes.length - visibles.length;

    const annuler = async () => {
        setAnnulation(true);

        try {
            const reponse = await FetchData.sendData(Route.cancel_commande, {
                uid: commande.uid,
            });

            // FetchData retourne les erreurs axios au lieu de les lever.
            if (reponse?.name === "AxiosError") {
                notification(
                    reponse.response?.data?.message ??
                        "L'annulation a échoué. Réessayez dans un instant."
                );
                return;
            }

            setConfirme(false);
            onChange?.();
            notification(reponse?.message ?? "Votre commande a été annulée.");
        } finally {
            setAnnulation(false);
        }
    };

    return (
        <article className="flex flex-col gap-3 rounded-card bg-surface p-4 shadow-card sm:p-5">
            <header className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-caption text-ink-muted">
                        {dateTimeFormat(commande?.created_at)}
                    </p>
                    <p className="text-title font-bold text-secondaryColor">
                        {commande?.reference ?? "Commande"}
                    </p>
                </div>

                {commande?.status?.name ? (
                    <span
                        className="shrink-0 rounded-pill px-2.5 py-1 text-caption font-bold"
                        style={{
                            // `22` en fin de valeur est l'opacite en hexadecimal :
                            // la pastille reprend la couleur du statut, en fond
                            // tres clair, avec le texte dans la couleur pleine.
                            backgroundColor: couleur ? `${couleur}22` : undefined,
                            color: couleur ?? undefined,
                        }}
                    >
                        {commande.status.name}
                    </span>
                ) : null}
            </header>

            {visibles.length ? (
                <ul className="flex flex-wrap gap-2">
                    {visibles.map((ligne, index) => (
                        <li
                            key={ligne.product?.uid ?? index}
                            className="flex items-center gap-2 rounded-control bg-surface-sunken p-1.5 pr-2.5"
                        >
                            <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-control">
                                <ImagePlat
                                    src={ligne.product?.picture}
                                    alt=""
                                    fill
                                    sizes="32px"
                                    className="object-cover"
                                />
                            </span>

                            <span className="line-clamp-1 text-caption text-ink">
                                {ligne.quantity} × {ligne.product?.title}
                            </span>
                        </li>
                    ))}

                    {reste > 0 ? (
                        <li className="flex items-center rounded-control bg-surface-sunken px-2.5 py-2 text-caption text-ink-muted">
                            +{reste}
                        </li>
                    ) : null}
                </ul>
            ) : null}

            <div className="flex flex-col gap-1.5">
                {commande?.user_delivery_complet_adress ? (
                    <p className="flex items-start gap-1.5 text-caption text-ink-muted">
                        <FaLocationDot className="mt-0.5 shrink-0" />
                        <span className="line-clamp-2">
                            {commande.user_delivery_complet_adress}
                        </span>
                    </p>
                ) : null}

                <p className="flex items-center gap-1.5 text-caption text-ink-muted">
                    <FaReceipt className="shrink-0" />

                    {attentePaiement ? (
                        <span className="text-ink-subtle">
                            Code de confirmation disponible après paiement
                        </span>
                    ) : (
                        <span>
                            Code de confirmation{" "}
                            <span className="font-bold tracking-wider text-ink">
                                {commande?.code_confirmation}
                            </span>
                        </span>
                    )}
                </p>
            </div>

            <div className="flex items-center justify-between border-t border-surface-border pt-3">
                <span className="text-caption text-ink-muted">Total</span>
                <span className="text-title font-bold text-secondaryColor">
                    {formatPrix(commande?.global_price, devise)}
                </span>
            </div>

            {actionnable ? (
                <div className="flex flex-col gap-2 sm:flex-row">
                    {attentePaiement ? (
                        <Link
                            href="/ordering"
                            className="flex flex-1 items-center justify-center rounded-control bg-brand-500 px-4 py-3 text-body font-bold text-ink-inverse transition-colors duration-150 hover:bg-brand-600"
                        >
                            Payer
                        </Link>
                    ) : (
                        <button
                            type="button"
                            onClick={() => onSuivre?.(commande)}
                            className="flex flex-1 items-center justify-center rounded-control bg-brand-500 px-4 py-3 text-body font-bold text-ink-inverse transition-colors duration-150 hover:bg-brand-600"
                        >
                            Suivre ma commande
                        </button>
                    )}

                    {attentePaiement ? (
                        confirme ? (
                            <div className="flex flex-1 items-center gap-2 rounded-control border border-danger px-3 py-2">
                                <span className="flex-1 text-caption text-danger">
                                    Annuler définitivement&nbsp;?
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setConfirme(false)}
                                    className="px-2 text-caption font-semibold text-ink-muted"
                                >
                                    Non
                                </button>
                                <button
                                    type="button"
                                    onClick={annuler}
                                    disabled={annulation}
                                    className="rounded-pill bg-danger px-3 py-1.5 text-caption font-bold text-white disabled:opacity-60"
                                >
                                    Oui
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setConfirme(true)}
                                className="rounded-control border border-danger px-4 py-3 text-body font-bold text-danger transition-colors duration-150 hover:bg-danger-surface"
                            >
                                Annuler
                            </button>
                        )
                    ) : null}
                </div>
            ) : null}
        </article>
    );
}
