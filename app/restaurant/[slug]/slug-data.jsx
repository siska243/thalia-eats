"use client";
import BannerResto from "@/components/commons/BannerResto";
import SectionOffers from "@/components/restaurantDetails/SectionOffers";
import SectionAll from "@/components/restaurantDetails/SectionAll";
import BeforeFooterContent from "@/components/commons/BeforeFooterContent";
import useReferentialData from "@/hooks/useQueryTanStack";
import {Route} from "@/helpers/Route";
import {useState, useEffect, Suspense} from "react";
import Loader from "@/components/Loader/Loader";


export default function SlugData({slug, restaurant}) {
    const {data: category_restaurant, isLoading} =
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
    
    const handleProductByCategory=()=>{
        const tabs=[]
        subCategories?.forEach((items)=>{
            const product=items.product.filter(i=>i.restaurant.slug==slug)
            tabs.push({
                ...items,
                product
            })
        })
        
        return tabs;
    }
    

    if (isLoading) {
        return <Loader/>;
    }

    return (
        <div className="pt-[220px] md:pt-[230px]">
            <Suspense>
                <BannerResto
                    restaurant={restaurant?.data ?? [] }
                />
            </Suspense>
            <Suspense>
                <section className="mb-6 md:mb-10">
                    <div className="max-w-[1300px] mx-auto px-5 flex flex-col gap-3 sm:flex-row">
                        <p data-aos="fade-up"
                           className="text-center md:text-left text-xl md:text-2xl font-semibold text-secondaryColor">
                            Toutes les offres de <span className="text-primaryColor">
              {restaurant?.data?.name}
            </span>
                        </p>
                    </div>
                </section>
            </Suspense>

            {/* ********************** */}
            {/* afficher les categories si elles existent bien */}
            {
                category_restaurant?.data?.length > 0 ? (<section data-aos="fade-up" className="bg-primaryColor">
                    <div
                        className="max-w-[1300px] mx-auto px-3 md:px-5 flex items-center py-3 md:py-5 gap-2 md:gap-3 overflow-auto lg:overflow-hidden">
                        {/*  categorie restaurant       */}

                        {category_restaurant?.data?.map((cat, index) => {
                            return (
                                <>
                                    <button
                                        key={index}
                                        className={`transition-all duration-300  py-2 md:px-6 px-4 rounded-full text-sm md:text-base border border-transparent flex-shrink-0 ${activeCategory == cat.slug ? "text-white bg-black" : " bg-white text-black"}`}
                                        onClick={() => findSubCategoryAndProductsByCategory(cat.slug)}
                                    >
                                        {cat.title}
                                    </button>
                                </>
                            );
                        })}
                    </div>
                </section>) : (<div
                    className="max-w-[1300px] mx-auto px-3 md:px-5 flex items-center overflow-auto lg:overflow-hidden">
                    <p className="bg-primaryColor p-4 rounded-lg shadow-lg text-white ">Les plats pour ce restaurant ne
                        sont pas encore disponible</p>
                </div>)
            }

            {/* ********************* */}
            <Suspense>
                <SectionOffers products={products == undefined ? [] : products}/>
            </Suspense>
            {/* ********************** */}

            <Suspense>
                <section className="max-w-[1300px] mx-auto px-3 md:px-5 pb-6 md:pb-12">
                    <div data-aos="fade-up" className="flex flex-col gap-12">
                        {
                            handleProductByCategory()?.map((cat,idx) => {
                                
                                console.log(cat)
                                return <SectionAll key={idx} cat={cat}/>
                            })
                        }
                    </div>
                </section>
            </Suspense>

            {/* before footer content */}
            <Suspense>
                <BeforeFooterContent restaurant={restaurant == undefined ? [] : restaurant}/>
            </Suspense>

        </div>
    );
}
