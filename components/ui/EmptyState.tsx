import React from "react";

interface Props {
    title: string;
    message?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
}

/**
 * Ce qu'on affiche quand il n'y a rien.
 *
 * Une liste vide sans explication laisse croire a une panne : le titre dit ce
 * qui manque, le message pourquoi, et l'action ce qu'on peut faire.
 */
export default function EmptyState({title, message, icon, action}: Props) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            {icon ? (
                <div className="flex h-14 w-14 items-center justify-center rounded-pill bg-surface-sunken text-ink-subtle">
                    {icon}
                </div>
            ) : null}

            <h2 className="text-title font-bold text-ink">{title}</h2>

            {message ? <p className="max-w-md text-body text-ink-muted">{message}</p> : null}

            {action ? <div className="pt-2">{action}</div> : null}
        </div>
    );
}
