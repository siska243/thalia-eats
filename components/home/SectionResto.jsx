
import CardAll from "../restaurantDetails/CardAll";
export default function SectionResto({ data, isLoading, isError }) {

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
      <div className="border-b pb-10">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-secondaryColor text-center lg:text-left mb-10">
          Les categories populaires 🤩
        </h2>
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
