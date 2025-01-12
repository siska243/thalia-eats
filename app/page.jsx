"use client";

import SectionDeals from "@/components/home/SectionDeals";
import SectionResto from "@/components/home/SectionResto";
import SectionPopularResto from "@/components/home/SectionPopularResto";
import SectionPub from "@/components/home/SectionPub";
import SectionPartner from "@/components/home/SectionPartner";
import SectionAbout from "@/components/home/SectionAbout";
import SectionCount from "@/components/home/SectionCount";

// **************
import { Route } from "@/helpers/Route";
import useReferentialData from "@/hooks/useQueryTanStack";
import Loader from "@/components/Loader/Loader";
import Hero from "@/components/home/Hero";

export default function Home() {
  const { data, isLoading, isError, isFetched } = useReferentialData({
    url: Route.categorie,
    queryKey: "query-categorie",
  });
  const { data: list_restaurant } = useReferentialData({
    url: Route.list_restaurant,
    queryKey: "query-list-restaurant",
  });
  const { data: previews } = useReferentialData({
    url: Route.produits_a_la_une,
    queryKey: "query-preview",
  });

  if (isLoading) {
    return <Loader />
  }



  return (
    <div className="h-full pt-[220px] md:pt-[230px]">
      {/* hero section */}
      <Hero />
      {/* categorie des produits */}
      <SectionDeals
        data={data == undefined ? [] : data}
        isLoading={isLoading}
      />
      {/* section resto */}
      <SectionResto data={data == undefined ? [] : data}
        isLoading={isLoading} isError={isError} />
      {/* section popular resto */}
      <SectionPopularResto data={previews == undefined ? [] : previews} />
      {/* section pub */}
      <SectionPub />
      {/* section partner */}
      <SectionPartner />
      {/* section about */}
      <SectionAbout />
      {/* section counter */}
      <SectionCount />
    </div>
  );
}
