import React from "react";

/**
 * La mise en page commune aux textes légaux.
 *
 * Quatre pages la partageaient : la politique de confidentialité avait ses
 * classes écrites à la main, et chaque nouvelle page les aurait recopiées
 * avec de légères variations. Un texte de loi se lit en colonne étroite, et
 * c'est la seule chose qu'elles ont à décider.
 */
export default function PageLegale({
    titre,
    miseAJour,
    children,
}: {
    titre: string;
    /** La date de dernière révision, que le lecteur a le droit de connaître. */
    miseAJour: string;
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-svh bg-surface-sunken pt-[var(--header-h)]">
            <div className="mx-auto max-w-3xl px-4 py-10 sm:px-5">
                <h1 className="text-display font-extrabold text-secondaryColor">{titre}</h1>

                <p className="mb-8 mt-2 text-caption text-ink-muted">
                    Dernière mise à jour : {miseAJour}
                </p>

                <div className="flex flex-col gap-6 text-body leading-7 text-ink">{children}</div>
            </div>
        </div>
    );
}

/** Une section numérotée, au même gabarit partout. */
export function SectionLegale({
    titre,
    children,
}: {
    titre: string;
    children: React.ReactNode;
}) {
    return (
        <section className="flex flex-col gap-3">
            <h2 className="text-title font-bold text-secondaryColor">{titre}</h2>
            {children}
        </section>
    );
}

/** Une liste à puces, au gabarit des pages légales. */
export function ListeLegale({items}: {items: React.ReactNode[]}) {
    return (
        <ul className="flex list-disc flex-col gap-1.5 pl-5 text-ink-muted">
            {items.map((item, rang) => (
                <li key={rang}>{item}</li>
            ))}
        </ul>
    );
}
