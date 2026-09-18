import React from "react";

interface Props {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

/**
 * En-tete de section : un sur-titre discret, un titre, et une action a droite.
 *
 * Les sections de l'accueil portaient chacune sa propre mise en forme de
 * titre — tailles, graisses et marges differentes d'une section a l'autre.
 */
export default function Section({title, subtitle, action, children, className = ""}: Props) {
    return (
        <section className={`mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 ${className}`}>
            <header className="mb-6 flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-display font-extrabold tracking-tight text-secondaryColor">
                        {title}
                    </h2>
                    {subtitle ? (
                        <p className="mt-1 text-body text-ink-muted">{subtitle}</p>
                    ) : null}
                </div>

                {action}
            </header>

            {children}
        </section>
    );
}
