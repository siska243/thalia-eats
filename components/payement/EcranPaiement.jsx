import Link from "next/link";

/**
 * L'ecran de retour d'un paiement.
 *
 * Les quatre pages — succes, attente, echec, abandon — repetaient la meme mise
 * en page, avec chacune sa nuance : `p-8` ici et `p-6 sm:p-8 lg:p-10` la, une
 * carte `max-w-md` d'un cote et `max-w-xl` de l'autre, des boutons oranges,
 * rouges, jaunes ou gris selon la page. Le client traversait quatre ecrans qui
 * ne se ressemblaient pas.
 *
 * Elles partageaient aussi `h-screen pt-[150px]` : une hauteur figee a la
 * fenetre, plus un decalage par-dessus. Le contenu depassait donc le bas de
 * l'ecran sans pouvoir defiler des que le telephone etait petit ou le clavier
 * ouvert.
 */
export default function EcranPaiement({ton = "neutre", icone, titre, message, actions = []}) {
    const tons = {
        succes: "bg-success-surface text-success",
        attente: "bg-warning-surface text-warning",
        echec: "bg-danger-surface text-danger",
        neutre: "bg-surface-sunken text-ink-muted",
    };

    return (
        <div className="flex min-h-svh items-center justify-center bg-surface-sunken px-4 pb-12 pt-[calc(var(--header-h)+24px)]">
            <div className="w-full max-w-md rounded-card bg-surface p-6 text-center shadow-card sm:p-8">
                <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-pill ${tons[ton] ?? tons.neutre}`}
                >
                    {icone}
                </div>

                <h1 className="mt-5 text-display font-extrabold text-secondaryColor">
                    {titre}
                </h1>

                <p className="mt-3 text-body leading-7 text-ink-muted">{message}</p>

                <div className="mt-7 flex flex-col gap-3">
                    {actions.map((action, index) => (
                        <Link
                            key={action.href}
                            href={action.href}
                            className={
                                index === 0
                                    ? "inline-flex justify-center rounded-pill bg-brand-500 px-6 py-3.5 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                                    : "inline-flex justify-center rounded-pill border border-surface-border px-6 py-3.5 text-body font-semibold text-ink transition-colors duration-150 hover:bg-surface-sunken"
                            }
                        >
                            {action.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
