"use client";

import Restaurants from "@/components/restaurants/Restaurants";
import { Route } from "@/helpers/Route";
import useReferentialData from "@/hooks/useQueryTanStack";
import BannerRestaurantPage from "@/components/restaurants/BannerRestaurantPage";
import Loader from "@/components/Loader/Loader"
import SectionAbout from "@/components/home/SectionAbout";
import {Suspense} from "react";


export default function restaurant() {
  const { data, isLoading, isError, isFetched } = useReferentialData({
    url: Route.list_restaurant,
    queryKey: "query-list-restaurant",
  });

  if (isLoading) {
    return <Loader />
  }


  return (
    <>
      <div className="pt-[220px] md:pt-[230px]">
          <Suspense>
              <BannerRestaurantPage />
          </Suspense>


        {/* ********************* */}
          <Suspense>
              <Restaurants data={data === undefined ? [] : data} isLoading={isLoading} />
          </Suspense>

        {/* ********************** */}

      </div>
      <SectionAbout />
    </>
  );
}
