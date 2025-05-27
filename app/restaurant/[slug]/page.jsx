
import React, {Suspense} from "react";

import { Route } from "@/helpers/Route";
import SlugData from "@/app/restaurant/[slug]/slug-data";
import {FetchData} from "@/helpers/FetchData";

const fetch = async (slug) => {
  const response = await FetchData.getData(Route.slug_restaurant(slug))
  if (response.name === "AxiosError") {
    return {
      data: null
    }
  }
  return {
    data: response
  }
}




export default async function restaurants({ params }) {
  const { slug } = await params;
  const { data } = await fetch(slug)

  return (
    <Suspense>
      <SlugData slug={slug} restaurant={data} />
    </Suspense>
  );
}
