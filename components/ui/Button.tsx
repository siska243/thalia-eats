"use client";

import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface Props extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
    label: string;
    variant?: Variant;
    loading?: boolean;
    icon?: React.ReactNode;
    full?: boolean;
    className?: string;
}

const surfaces: Record<Variant, string> = {
    primary: "bg-brand-500 hover:bg-brand-600 text-ink-inverse",
    secondary: "bg-surface border border-surface-border text-ink hover:bg-surface-sunken",
    ghost: "bg-transparent text-brand-600 hover:bg-brand-50",
    danger: "bg-danger-surface text-danger hover:bg-danger hover:text-ink-inverse",
};

/**
 * Bouton unique de l'application web, aligne sur celui du mobile.
 *
 * L'etat de chargement neutralise l'appui : un double envoi de commande, sur
 * un reseau lent, creait deux paiements.
 */
export default function Button({
    label,
    variant = "primary",
    loading,
    icon,
    full,
    className = "",
    disabled,
    ...rest
}: Props) {
    return (
        <button
            {...rest}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            className={`inline-flex items-center justify-center gap-2 rounded-control px-5 py-3 text-body font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
                surfaces[variant]
            } ${full ? "w-full" : ""} ${className}`}
        >
            {loading ? (
                <span
                    className="h-4 w-4 animate-spin rounded-pill border-2 border-current border-t-transparent"
                    aria-hidden
                />
            ) : (
                icon
            )}
            {label}
        </button>
    );
}
