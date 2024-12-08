
import CardAll from "../restaurantDetails/CardAll";
export default function SectionResto({ data, isLoading, isError }) {
  // const RestoCat = [
  //   {
  //     title: "Titre 1",
  //     resto: "21 restaurants",
  //   },
  //   {

  //     title: "Titre 2",
  //     resto: "21 restaurants",
  //   },
  //   {

  //     title: "Titre 3",
  //     resto: "90 restaurants",
  //   },
  //   {

  //     title: "Titre 4",
  //     resto: "10 restaurants",
  //   },
  //   {

  //     title: "Titre 5",
  //     resto: "6 restaurants",
  //   },
  //   {

  //     title: "Titre 6",
  //     resto: "30 restaurants",
  //   },
  // ];
  if (isLoading) return <div>Chargement...</div>;
  if (isError || !data?.data) return <div>Une erreur est survenue</div>;
  // Étape 1 : Extraire tous les produits
  const categories = data.data; // Liste des catégories
  const allProducts = categories.flatMap((category) =>
    category.sub_category_product.flatMap((subCategory) =>
      subCategory.product
    )
  );
  // Étape 2 : Mélanger les produits
  const shuffledProducts = allProducts.sort(() => 0.5 - Math.random());
  return (
    <section className="mt-6 lg:mt-12 max-w-[1300px] mx-auto px-3 md:px-5">
      <div>
        <p className="text-base  lg:text-lg xl:text-2xl font-semibold text-secondaryColor mb-6 md:mb-12">
          Les categories populaires 🤩
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* {RestoCat.map((cat, index) => {
            return <CardCategory key={index} cat={cat} />;
          })} */}
          {shuffledProducts.map((product) => {
            return <CardAll key={product.uid} product={product} />;
          })}

        </div>
      </div>
    </section>
  );
}
