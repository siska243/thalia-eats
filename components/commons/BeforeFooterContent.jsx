import Map from "./Map";

/**
 * Le bloc carte, sous la fiche restaurant.
 *
 * Il importait aussi ContactInfo, Reviews et SectionPopularResto, tous trois
 * commentes dans le rendu : trois modules charges pour rien a chaque page.
 */
export default function BeforeFooterContent({restaurant, infoResto}) {
    return (
        <section className="py-4 md:py-12">
            <div className="mx-auto max-w-[1300px] px-4 sm:px-5">
                <Map data={restaurant ?? []} infoResto={infoResto} />
            </div>
        </section>
    );
}
