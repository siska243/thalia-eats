"use client"

import useReferentialData from './useQueryTanStack'
import { Route } from '@/helpers/Route'


export default function useGetCurrentUser() {

    const {data,isLoading,isError,isFetched,refetch}=useReferentialData({url:Route.me,queryKey:'query-check-account'})

  return {
    user:data && data !=undefined ? data:null,
    isError,
    isLoading,
    isFetched,
    refetch
  }
}