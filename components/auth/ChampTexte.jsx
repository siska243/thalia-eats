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
    /*
     * Dire ce qui est exige, et surtout ce qui ne l'est pas.
     *
     * Les formulaires ne marquaient rien : le visiteur decouvrait au refus
     * quels champs manquaient. Un asterisque sur l'obligatoire ne suffit pas
     * seul — on le lit comme une decoration quand tout en porte un — d'ou la
     * mention « facultatif » sur les autres, qui est l'information vraiment
     * utile : celle qui permet de passer son chemin.
     */
    requis = false,
    ...props
}) {
    const id = useId();
    const [visible, setVisible] = useState(false);

    /*
     * `required` VAUT `requis`.
     *
     * Le proprietaire, le 20 octobre : « pourquoi dans connexion tu mets
     * identifiant (facultatif) et mot de passe facultatif et pourtant c'est
     * obligatoire », puis « lors de l'inscription tu mets tout facultatif ».
     *
     * Les ecrans ecrivaient `required`, le nom HTML, la ou le composant
     * attendait `requis`. L'attribut partait bien sur le champ — il traverse
     * `...props`, qui est etale APRES `required={requis}` et l'ecrase — mais
     * le libelle, lui, lisait `requis`, reste faux, et annoncait
     * « (facultatif) » sur un champ que le navigateur refusait de laisser
     * vide. La connexion, l'inscription, le mot de passe, les adresses : une
     * vingtaine de champs disaient le contraire de ce qu'ils exigeaient.
     *
     * Corrige ICI plutot qu'aux vingt endroits : le vingt-et-unieme appelant
     * ecrira `required` lui aussi, parce que c'est le nom qu'on connait. Un
     * composant qui accepte les deux ne peut pas etre pris en defaut.
     */
    const obligatoire = requis || Boolean(props.required);

    return (
        <div className={`flex flex-col ${className}`}>
            <label htmlFor={id} className="mb-2 text-caption font-semibold text-ink">
                {label}
                {obligatoire ? (
                    <span className="text-danger" aria-hidden>
                        {" *"}
                    </span>
                ) : (
                    <span className="font-normal text-ink-subtle">{" (facultatif)"}</span>
                )}
            </label>

            <div className="relative">
                <input
                    id={id}
                    type={motDePasse ? (visible ? "text" : "password") : type}
                    required={obligatoire}
                    aria-required={obligatoire}
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
