import Restaurants from "@/components/restaurants/Restaurants";
import food from "@/public/assets/images/food.png";
import CardResto from "./CardResto";
import { useState, useEffect } from "react";

export default function SectionDeals({ data, isLoading }) {
  const [sub_categories, setSubCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const findSubCategoryByCategory = (category) => {
    let search = null;
    if (category) {
      search = category;
    } else {
      if (data && data?.data[0].slug) {
        search = data.data[0].slug;
      }
    }

    const categories = data.data.find((item) => item.slug === search);

    setSubCategories(
      categories?.sub_category_product ? categories?.sub_category_product : []
    );
    setActiveCategory(search); // Mettre à jour la catégorie active
  };
  // Charger la première catégorie au montage
  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      findSubCategoryByCategory(data.data[0].slug); // Charger la première catégorie
    }
  }, [data]);

  return (
    <section className=" max-w-[1300px] mx-auto px-3 md:px-5 ">
      <div className="w-full bg-white border-b pb-10">
        {/* top exclusive deals */}
        <div className="flex items-center justify-between mb-8 md:mb-12 gap-4 md:gap-0 md:flex-row flex-col">
          <div>
            <p className="text-base  lg:text-lg xl:text-2xl font-semibold text-secondaryColor">
              🎊 Découvrez nos catégories de plats
            </p>
          </div>
          <div className="flex gap-2 lg:gap-6 flex-wrap sm:flex-nowrap">
            {data?.data?.map((categorie, index) => {
              return (
                <button
                  key={index}
                  className={`transition-all duration-300 py-2 px-4 lg:px-6 border-2 rounded-full ${activeCategory === categorie.slug
                    ? "border-primaryColor text-primaryColor"
                    : "border-transparent text-secondaryColor hover:border-primaryColor hover:text-primaryColor"
                    }`}
                  onClick={() => findSubCategoryByCategory(categorie.slug)}
                >
                  {categorie.title}
                </button>
              );
            })}
          </div>
        </div>
        {/* afficher tous les restaurants */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {sub_categories.length > 0 ? (
            sub_categories.map(({ picture, title, product }, index) => {
              return (
                <CardResto
                  key={index}
                  picture={picture}
                  title={title}
                  product={product}
                />
              );
            })
          ) : (
            <div className="bg-primaryColor p-5 text-white box-shadow-custom rounded-xl text-sm">Cette catégorie ne contient pas encore des produits ❌</div>
          )}
        </div>
        {/* <Restaurants /> */}
      </div>
    </section>
  );
}
