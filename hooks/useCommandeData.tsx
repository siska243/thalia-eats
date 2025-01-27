"use client"

import useReferentialData from "./useQueryTanStack"
import { Route } from '@/helpers/Route'

export default function useDefaultData() {

     const {data,isLoading,isError,isFetched}=useReferentialData({url:Route.default,queryKey:'query-default-data-account'});
     
  return {
    data,
    isError,
    isLoading,
    isFetched
  }

}
