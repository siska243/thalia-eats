import type {Metadata} from "next";

import FormulairePartenaire, {ChampPartenaire} from "@/components/partenaires/FormulairePartenaire";

export const metadata: Metadata = {
    title: "Devenir livreur | Thalia Eats",
    description:
        "Roulez avec Thalia Eats à Kinshasa, à votre rythme. Laissez vos coordonnées, notre équipe vous rappelle.",
};

/**
 * Ce qui décide d'un rappel : le véhicule, la commune et la disponibilité.
 *
 * Le permis est demandé, pas exigé : un livreur à moto le présentera de toute
 * façon au recrutement, et un champ bloquant ici ferait perdre des candidats
 * qui l'ont mais ne l'ont pas sous la main.
 */
const CHAMPS: ChampPartenaire[] = [
    {nom: "responsable", label: "Votre nom", placeholder: "Nom et prénom", requis: true},
    {
        nom: "telephone",
        label: "Téléphone",
        placeholder: "+243 ...",
        type: "tel",
        aide: "C'est par là que nous vous rappellerons",
        requis: true,
    },
    {nom: "email", label: "E-mail", placeholder: "facultatif", type: "email"},
    {
        nom: "commune",
        label: "Commune où vous roulez",
        placeholder: "Gombe, Limete, Ngaliema…",
        requis: true,
    },
    {
        nom: "vehicule",
        label: "Votre véhicule",
        options: ["Moto", "Scooter", "Voiture", "Vélo", "Je n'en ai pas encore"],
        requis: true,
    },
    {nom: "permis", label: "Permis de conduire", options: ["Oui", "Non", "En cours"]},
    {
        nom: "disponibilite",
        label: "Disponibilité",
        options: ["Temps plein", "Temps partiel", "Week-ends", "Soirées"],
    },
    {
        nom: "message",
        label: "Un mot sur vous",
        placeholder: "Expérience, quartiers que vous connaissez bien…",
        long: true,
    },
];

export default function Page() {
    return (
        <div className="min-h-svh bg-surface-sunken px-4 pb-16 pt-[calc(var(--header-h)+24px)]">
            <div className="mx-auto w-full max-w-2xl">
                <FormulairePartenaire
                    type="livreur"
                    titre="Roulez avec nous"
                    accroche="Livrez à votre rythme, sur les quartiers que vous connaissez. Dites-nous comment vous joindre, nous vous rappelons."
                    promesse="Notre équipe vous rappelle sous 48 heures pour vous expliquer la suite et organiser un rendez-vous."
                    champs={CHAMPS}
                />
            </div>
        </div>
    );
}
