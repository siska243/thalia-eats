"use client";
import BannerResto from "@/components/commons/BannerResto";
import searchLogo from "@/public/assets/images/search.png";
import Image from "next/image";
import SectionOffers from "@/components/restaurantDetails/SectionOffers";
import SectionAll from "@/components/restaurantDetails/SectionAll";
import BeforeFooterContent from "@/components/commons/BeforeFooterContent";
import useReferentialData from "@/hooks/useQueryTanStack";
import { Route } from "@/helpers/Route";
import { useState, useEffect } from "react";
import Loader from "@/components/Loader/Loader";


export default function SlugData({ slug, restaurant }) {
  const { data: category_restaurant, isLoading } =
    useReferentialData({
      url: Route.categorie_restaurant(slug),
      queryKey: "query-categorie-restaurant",
    });

  const [products, setProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    if (category_restaurant?.data) {
      const slug = category_restaurant?.data[0]?.slug
      setActiveCategory(slug)
      findSubCategoryAndProductsByCategory(slug)
    }
  }, [category_restaurant])

  // *****
  const findSubCategoryAndProductsByCategory = (slug) => {
    setActiveCategory(slug)
    // Rechercher la catégorie correspondant au slug cliqué
    const category = category_restaurant.data.find(
      (cat) => cat.slug === slug
    );
    const sub_cat = category?.sub_category_product

    setSubCategories(sub_cat)
    const products = [];

    sub_cat?.forEach(item => {
      products.push(item.product)
    })
    setProducts(products);
  };
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="pt-[220px] md:pt-[230px]">
      <BannerResto
        restaurant={restaurant == undefined ? [] : restaurant}
      />
      <section className="mb-6 md:mb-10">
        <div className="max-w-[1300px] mx-auto px-5 flex flex-col gap-3 items-center justify-between sm:flex-row">
          <p className="text-base lg:text-lg font-semibold">
            Toutes les offres de {restaurant?.data?.name}
          </p>
          {/* <form className="flex  items-center gap-4 rounded-full border border-secondaryColor py-2 px-4 md:py-3 md:px-6">
            <Image src={searchLogo} width={20} alt="search logo" />
            <input
              className="border-none outline-none"
              type="search"
              name=""
              id=""
              placeholder="Search from menu..."
            />
          </form> */}
        </div>
      </section>
      {/* ********************** */}
      {/* afficher les categories si elles existent bien */}
      {
        category_restaurant?.data?.length > 0 ? (<section className="bg-primaryColor">
          <div className="max-w-[1300px] mx-auto px-3 md:px-5 flex items-center py-3 md:py-5 gap-2 md:gap-3 overflow-auto lg:overflow-hidden">
            {/*  categorie restaurant       */}

            {category_restaurant?.data?.map((cat) => {
              return (
                <button
                  key={cat.uid}
                  className={`transition-all duration-300  py-2 md:px-6 px-4 rounded-full text-sm border border-transparent flex-shrink-0 ${activeCategory == cat.slug ? "text-white bg-black" : " bg-white text-black"}`}
                  onClick={() => findSubCategoryAndProductsByCategory(cat.slug)}
                >
                  {cat.title}
                </button>
              );
            })}
          </div>
        </section>) : (<div>
          <p>Les plats pour ce restaurant ne sont pas encore disponible</p>
        </div>)
      }

      {/* ********************* */}
      <SectionOffers products={products == undefined ? [] : products} />
      {/* ********************** */}
      <section className="max-w-[1300px] mx-auto px-3 md:px-5 pb-6 md:pb-12">
        <div className="flex flex-col gap-12">
          {
            subCategories?.map((cat) => {
              return <SectionAll key={cat.uid} cat={cat} />
            })
          }
        </div>
      </section>
      {/* before footer content */}
      <BeforeFooterContent restaurant={restaurant == undefined ? [] : restaurant} />
    </div>
  );
}
