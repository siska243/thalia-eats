import Image from "next/image";
import Link from "next/link";
import Section from "@/components/ui/Section";
import {etatOuverture, libelleFermeture} from "@/helpers/openingHours";

/**
 * Les restaurants.
 *
 * Avec leur etat d'ouverture, lu dans les horaires que l'API renvoie deja.
 * Sans lui, tous se ressemblaient et l'on decouvrait la fermeture au moment de
 * commander.
 */
export default function SectionRestaurants({restaurants = []}) {
    const liste = restaurants.slice(0, 8);

    if (!liste.length) return null;

    return (
        <Section
            title="Les restaurants"
            subtitle="Ceux qui livrent à Kinshasa"
            action={
                <Link
                    href="/restaurant"
                    className="hidden text-body font-semibold text-brand-600 hover:text-brand-700 sm:inline"
                >
                    Voir la liste
                </Link>
            }
        >
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {liste.map((restaurant) => {
                    const horaire = etatOuverture(restaurant.opens);

                    return (
                        <li key={restaurant.slug}>
                            <Link
                                href={`/restaurant/${restaurant.slug}`}
                                className="group block h-full overflow-hidden rounded-card bg-surface shadow-card transition-shadow duration-200 hover:shadow-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                            >
                                <div className="relative h-36 w-full overflow-hidden bg-surface-sunken">
                                    {restaurant.image ? (
                                        <Image
                                            src={restaurant.image}
                                            alt={restaurant.name}
                                            fill
                                            sizes="(max-width: 1024px) 50vw, 25vw"
                                            className="object-cover transition-transform duration-200 motion-safe:group-hover:scale-105"
                                        />
                                    ) : null}

                                    <span
                                        className={`absolute left-3 top-3 rounded-pill px-2.5 py-1 text-caption font-bold ${
                                            horaire.ouvert
                                                ? "bg-success-surface text-success"
                                                : "bg-surface text-ink-muted"
                                        }`}
                                    >
                                        {horaire.ouvert ? "Ouvert" : "Fermé"}
                                    </span>
                                </div>

                                <div className="p-4">
                                    <p className="line-clamp-1 text-body font-semibold text-secondaryColor">
                                        {restaurant.name}
                                    </p>
                                    <p className="mt-0.5 line-clamp-1 text-caption text-ink-muted">
                                        {restaurant.adresse}
                                    </p>

                                    <p
                                        className={`mt-2 text-caption ${
                                            horaire.ouvert
                                                ? "text-ink-subtle"
                                                : "font-semibold text-brand-700"
                                        }`}
                                    >
                                        {horaire.ouvert ? horaire.creneau : libelleFermeture(horaire)}
                                    </p>
                                </div>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </Section>
    );
}
