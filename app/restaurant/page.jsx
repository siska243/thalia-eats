"use client";
import BannerResto from "@/components/commons/BannerResto";
import searchLogo from "@/public/assets/images/search.png";
import Image from "next/image";
import Restaurants from "@/components/restaurants/Restaurants";
import BeforeFooterContent from "@/components/commons/BeforeFooterContent";
import { Route } from "@/helpers/Route";
import useReferentialData from "@/hooks/useQueryTanStack";
import BannerRestaurantPage from "@/components/restaurants/BannerRestaurantPage";
import Loader from "@/components/Loader/Loader"


export default function restaurant() {
  const { data, isLoading, isError, isFetched } = useReferentialData({
    url: Route.list_restaurant,
    queryKey: "query-list-restaurant",
  });

  if (isLoading) {
    return <Loader />
  }


  return (

    <div className="pt-[220px] md:pt-[230px]">
      <BannerRestaurantPage />
      {/* <BannerResto restaurant={data.data == undefined ? [] : data.data} /> */}
      {/* <section className="mb-10">
        <div className="max-w-[1300px] mx-auto px-5 flex items-center justify-between">
          <p className="text-lg font-semibold">
            All Offers from McDonald’s East London
          </p>
          <div className="flex items-center gap-4 rounded-full border border-secondaryColor py-3 px-6">
            <Image src={searchLogo} width={20} alt="search image" />
            <input
              className="border-none outline-none"
              type="search"
              name=""
              id=""
              placeholder="Search from menu..."
            />
          </div>
        </div>
      </section> */}
      {/* ********************* */}
      <Restaurants data={data == undefined ? [] : data} isLoading={isLoading} />
      {/* ********************** */}

      {/* before footer content */}
      {/* <BeforeFooterContent /> */}
    </div>
  );
}
