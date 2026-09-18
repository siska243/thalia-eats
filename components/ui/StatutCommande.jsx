/**
 * L'etat d'une commande, en un mot.
 *
 * Le libelle vient du serveur, puisque la table `Status` est editable depuis le
 * back-office. Mais il y est redige a l'infinitif — « Annuler », « Livrer » —
 * ce qui se lit comme une action a faire, pas comme un etat constate : une
 * commande terminee affichait « Annuler », juste a cote d'un bouton.
 *
 * L'etat se lit sur deux sources qui ont diverge en base : les dates
 * (`cancel_at`, `delivery_at`) et `status_id`. Certaines commandes portent le
 * statut 4 sans `cancel_at`, d'autres l'inverse. On accepte donc l'un ou
 * l'autre : une commande annulee d'un cote seulement reste une commande
 * annulee.
 *
 * Les identifiants sont ceux de la table `status` : 1 en attente, 2 en cours,
 * 3 livree, 4 annulee, 5 en attente de paiement.
 */
const STATUT_LIVREE = 3;
const STATUT_ANNULEE = 4;

export const estAnnulee = (commande) =>
    Boolean(commande?.cancel_at) || Number(commande?.status?.id) === STATUT_ANNULEE;

export const estLivree = (commande) =>
    !estAnnulee(commande) &&
    (Boolean(commande?.delivery_at) || Number(commande?.status?.id) === STATUT_LIVREE);

export default function StatutCommande({commande, className = ""}) {
    if (estAnnulee(commande)) {
        return (
            <span
                className={`inline-flex shrink-0 rounded-pill bg-danger-surface px-3 py-1 text-caption font-bold text-danger ${className}`}
            >
                Annulée
            </span>
        );
    }

    if (estLivree(commande)) {
        return (
            <span
                className={`inline-flex shrink-0 rounded-pill bg-success-surface px-3 py-1 text-caption font-bold text-success ${className}`}
            >
                Livrée
            </span>
        );
    }

    const ton = commande?.accepted_at
        ? "bg-brand-50 text-brand-700"
        : "bg-warning-surface text-warning";

    return (
        <span
            className={`inline-flex shrink-0 rounded-pill px-3 py-1 text-caption font-bold ${ton} ${className}`}
        >
            {commande?.status?.name ?? "En attente"}
        </span>
    );
}
