"use client";

import {useId, useState} from "react";
import {FaEye, FaEyeSlash} from "react-icons/fa";

/**
 * Un champ de formulaire.
 *
 * Le bouton oeil des mots de passe etait positionne en `absolute top-12` :
 * une valeur qui vise le milieu du champ tant que le libelle tient sur une
 * ligne. Des que l'ecran retrecit — « Confirmer le mot de passe » passe sur
 * deux lignes — le bouton glissait au-dessus du champ. Il est desormais cale
 * sur le champ lui-meme, pas sur le bloc entier.
 */
export default function ChampTexte({
    label,
    type = "text",
    motDePasse = false,
    aide = "",
    className = "",
    ...props
}) {
    const id = useId();
    const [visible, setVisible] = useState(false);

    return (
        <div className={`flex flex-col ${className}`}>
            <label htmlFor={id} className="mb-2 text-caption font-semibold text-ink">
                {label}
            </label>

            <div className="relative">
                <input
                    id={id}
                    type={motDePasse ? (visible ? "text" : "password") : type}
                    className={`w-full rounded-control border border-surface-border bg-surface px-4 py-3 text-body text-ink outline-none transition-colors duration-150 placeholder:text-ink-subtle focus:border-brand-500 ${
                        motDePasse ? "pr-12" : ""
                    }`}
                    {...props}
                />

                {motDePasse ? (
                    <button
                        type="button"
                        onClick={() => setVisible(!visible)}
                        aria-label={
                            visible ? "Cacher le mot de passe" : "Afficher le mot de passe"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-lg text-ink-subtle transition-colors duration-150 hover:text-ink"
                    >
                        {visible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                ) : null}
            </div>

            {aide ? <p className="mt-1.5 text-caption text-ink-muted">{aide}</p> : null}
        </div>
    );
}
