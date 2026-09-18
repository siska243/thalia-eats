import Link from "next/link";

/**
 * La page de support.
 *
 * Elle n'avait pas le decalage d'en-tete : centree, elle s'en tirait sur un
 * grand ecran, mais sur un telephone le titre passait sous le menu fixe.
 */
const Page = () => (
    <div className="flex min-h-svh items-center justify-center bg-surface-sunken px-4 pb-12 pt-[calc(var(--header-h)+24px)]">
        <div className="w-full max-w-md rounded-card bg-surface p-6 text-center shadow-card sm:p-8">
            <h1 className="text-display font-extrabold text-secondaryColor">Support</h1>

            <p className="mt-3 text-body leading-7 text-ink-muted">
                Un souci avec une commande ou un paiement&nbsp;? Écrivez-nous, nous
                répondons.
            </p>

            <div className="mt-7 flex flex-col gap-3">
                <a
                    href="tel:+33627758753"
                    className="inline-flex justify-center rounded-pill bg-brand-500 px-6 py-3.5 text-body font-semibold text-ink-inverse transition-colors duration-150 hover:bg-brand-600"
                >
                    +33 6 27 75 87 53
                </a>

                <a
                    href="mailto:thaliaeat.original@gmail.com"
                    className="inline-flex justify-center rounded-pill border border-surface-border px-6 py-3.5 text-body font-semibold text-ink transition-colors duration-150 hover:bg-surface-sunken"
                >
                    thaliaeat.original@gmail.com
                </a>

                <Link
                    href="/historique"
                    className="mt-1 text-caption font-semibold text-brand-600 underline-offset-4 hover:underline"
                >
                    Retrouver mes commandes
                </Link>
            </div>
        </div>
    </div>
);

export default Page;
