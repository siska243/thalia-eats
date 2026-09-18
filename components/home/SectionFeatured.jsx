import Image from "next/image";
import Link from "next/link";
import Section from "@/components/ui/Section";
import {formatPrix} from "@/helpers/openingHours";

/**
 * Les plats a la une.
 *
 * L'ancienne version n'affichait qu'une photo et un nom sur bandeau orange :
 * ni prix, ni restaurant. Or c'est le prix qui decide, et le restaurant qui
 * rassure.
 */
export default function SectionFeatured({previews = []}) {
    const plats = previews.slice(3, 11);

    if (!plats.length) return null;

    return (
        <Section
            title="À la une"
            subtitle="Les plats que les restaurants mettent en avant"
            action={
                <Link
                    href="/restaurant"
                    className="hidden text-body font-semibold text-brand-600 hover:text-brand-700 sm:inline"
                >
                    Tous les restaurants
                </Link>
            }
        >
            <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {plats.map((plat) => (
                    <li key={plat.uid ?? plat.slug}>
                        <Link
                            href={`/restaurant/${plat.restaurant?.slug ?? ""}`}
                            className="group block h-full overflow-hidden rounded-card bg-surface shadow-card transition-shadow duration-200 hover:shadow-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                        >
                            <div className="relative h-40 w-full overflow-hidden">
                                <Image
                                    src={plat.picture}
                                    alt={plat.title}
                                    fill
                                    sizes="(max-width: 1024px) 50vw, 25vw"
                                    className="object-cover transition-transform duration-200 motion-safe:group-hover:scale-105"
                                />
                            </div>

                            <div className="flex h-[calc(100%-10rem)] flex-col gap-1 p-4">
                                <p className="line-clamp-1 text-body font-semibold text-secondaryColor">
                                    {plat.title}
                                </p>
                                <p className="line-clamp-1 text-caption text-ink-muted">
                                    {plat.restaurant?.name}
                                </p>

                                <p className="mt-auto pt-2 text-body font-bold text-brand-600">
                                    {formatPrix(plat.price, plat.currency?.code)}
                                </p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </Section>
    );
}
