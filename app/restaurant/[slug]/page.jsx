import React from "react";
import SlugData from "./slug-data";
import { FetchData } from "@/helpers/FetchData";
import { Route } from "@/helpers/Route";

const fetchData = async (slug) => {
  const response = await FetchData.getData(Route.slug_restaurant(slug))
  if (response.name == "AxiosError") {
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
  const { data } = await fetchData(slug)

  return (
    <>
      <SlugData slug={slug} restaurant={data} />
    </>
  );
}
