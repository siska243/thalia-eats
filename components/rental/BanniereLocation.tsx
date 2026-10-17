import Image from "next/image";

import photoVoiture from "@/public/assets/thalia-trans-large.jpg";

interface Props {
    /** Le nom commercial, qui vient des réglages et jamais d'ici. */
    nom: string;
    /** Nombre de véhicules annoncés par le serveur. */
    nombre?: number;
}

/**
 * L'en-tête du catalogue de location.
 *
 * La page n'en avait aucun : un titre et deux lignes sur fond gris, là où
 * `/restaurant` ouvre sur une bande illustrée. Le propriétaire : « je ne vois
 * pas la photo que je t'ai envoyée, ni dans le hero, ni dans /location ni
 * dans /restaurant ».
 *
 * LA VOITURE N'EST PAS EN FOND, contrairement à la bande des restaurants.
 * C'est un détourage sur gris clair : étirée derrière un titre blanc, son
 * fond mangerait le texte. Elle est donc posée à côté, sur la couleur de
 * marque, dans son cadrage large de 960 sur 420 — le même que le hero, taillé
 * dans la hauteur du détourage pour ne pas laisser deux bandes de gris vide.
 */
export default function BanniereLocation({nom, nombre}: Props) {
    return (
        <div className="relative mb-5 overflow-hidden rounded-card bg-secondaryColor">
            <span
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-secondaryColor via-secondaryColor to-brand-600/40"
                aria-hidden
            />

            <div className="relative flex flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-10">
                <div className="flex flex-col gap-2">
                    <span className="text-caption uppercase tracking-wide text-brand-300">
                        Avec chauffeur · {nom}
                    </span>

                    <h1 className="text-[30px] font-extrabold leading-tight tracking-tight text-white sm:text-[40px]">
                        Louer une voiture
                    </h1>

                    <p className="max-w-md text-body leading-7 text-white/80">
                        {nombre
                            ? `${nombre} véhicules avec chauffeur, à l’heure ou à la journée.`
                            : "À l’heure ou à la journée. Un acompte retient le véhicule, le reste se règle au chauffeur à la fin de la course."}
                    </p>
                </div>

                <Image
                    src={photoVoiture}
                    alt=""
                    aria-hidden
                    width={960}
                    height={420}
                    priority
                    className="h-32 w-full shrink-0 rounded-card object-cover sm:h-40 sm:w-80"
                />
            </div>
        </div>
    );
}
