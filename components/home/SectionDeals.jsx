import CardResto from "./CardResto";
import { useState, useEffect } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function SectionDeals({ data, isLoading }) {

  const [subCategories, setSubCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  const findSubCategoryByCategory = (category) => {
    let search = category || data?.data[0]?.slug;
    const categories = data?.data?.find((item) => item.slug === search);

    setSubCategories(categories?.sub_category_product || []);
    setActiveCategory(search);
  };

  useEffect(() => {
    if (data?.data?.length > 0) {
      findSubCategoryByCategory(data.data[0].slug);
    }
  }, [data]);

  return (
    <section className="max-w-[1300px] mx-auto px-4 md:px-6 lg:px-8 py-6">
      <div className="bg-white border-b pb-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center  mb-8 md:mb-12 gap-3">
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-secondaryColor text-center lg:text-left flex-shrink-0 border-b pb-5 sm:border-b-0 sm:pb-0">
            🎊 Découvrez nos catégories de plats
          </h2>
          <div className="flex gap-4">
            <button className="bg-primaryColor p-3 rounded-full text-white button-prev">
              <FaArrowLeft className="text-sm" />
            </button>
            <button className="bg-primaryColor p-3 rounded-full text-white button-next">
              <FaArrowRight className="text-sm" />
            </button>
          </div>


        </div>
        <Swiper
          className="w-full"
          modules={[Navigation, Pagination]} // Modules de navigation et pagination
          spaceBetween={10} // Espace entre les slides
          slidesPerView={3} // Nombre de slides visibles
          navigation={{
            prevEl: ".button-prev",
            nextEl: ".button-next",
          }}
          breakpoints={{
            480: {
              slidesPerView: 6,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 7,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 8,
              spaceBetween: 20,
            },
          }}
        >
          {data?.data?.map((categorie, index) => (
            <SwiperSlide className="w-full" key={index}>
              <button
                key={index}
                className={`text-sm md:text-base py-2 px-4 lg:px-6 border-2 rounded-full transition-all duration-300 w-full block text-center ${activeCategory === categorie.slug
                  ? "border-primaryColor text-primaryColor"
                  : "border-gray-200 text-gray-600 hover:border-primaryColor hover:text-primaryColor"
                  }`}
                onClick={() => findSubCategoryByCategory(categorie.slug)}
              >
                {categorie.title}
              </button>
            </SwiperSlide>

          ))}
        </Swiper>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-10">
          {isLoading ? (
            <div className="col-span-full text-center">
              <p className="text-secondaryColor">Chargement des catégories...</p>
            </div>
          ) : subCategories.length > 0 ? (
            subCategories.map(({ picture, title, product }, index) => (
              <CardResto
                key={index}
                picture={picture}
                title={title}
                product={product}
              />
            ))
          ) : (
            <div className="col-span-full bg-primaryColor text-white p-5 rounded-xl text-center text-sm md:text-md">
              Cette catégorie ne contient pas encore de produits ❌
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
