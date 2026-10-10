import type {Metadata} from "next";

import FormulairePartenaire, {ChampPartenaire} from "@/components/partenaires/FormulairePartenaire";

export const metadata: Metadata = {
    title: "Devenir restaurant partenaire | Thalia Eats",
    description:
        "Faites livrer vos plats à Kinshasa avec Thalia Eats. Laissez vos coordonnées, notre équipe vous rappelle.",
};

/**
 * Ce qu'un commercial doit savoir avant de décrocher son téléphone.
 *
 * Pas davantage : chaque champ en plus est un restaurant qui abandonne le
 * formulaire. Les horaires, la carte et la commission se discutent au
 * téléphone, pas ici.
 */
const CHAMPS: ChampPartenaire[] = [
    {
        nom: "etablissement",
        label: "Nom de l'établissement",
        placeholder: "Chez Maman Colonel",
        requis: true,
    },
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
        label: "Commune",
        placeholder: "Gombe, Limete, Ngaliema…",
        requis: true,
    },
    {nom: "adresse", label: "Adresse du restaurant", placeholder: "Avenue, numéro, repère"},
    {
        nom: "cuisine",
        label: "Type de cuisine",
        options: ["Congolaise", "Africaine", "Européenne", "Asiatique", "Fast-food", "Pâtisserie", "Autre"],
    },
    {
        nom: "message",
        label: "Un mot sur votre établissement",
        placeholder: "Nombre de places, plats phares, horaires…",
        long: true,
    },
];

export default function Page() {
    return (
        <div className="min-h-svh bg-surface-sunken px-4 pb-16 pt-[calc(var(--header-h)+24px)]">
            <div className="mx-auto w-full max-w-2xl">
                <FormulairePartenaire
                    type="restaurant"
                    titre="Devenir restaurant partenaire"
                    accroche="Vos plats livrés dans tout Kinshasa, sans que vous ayez à gérer la livraison. Dites-nous qui vous êtes, nous nous occupons du reste."
                    promesse="Notre équipe vous rappelle sous 48 heures pour discuter de votre carte et des conditions."
                    champs={CHAMPS}
                />
            </div>
        </div>
    );
}
