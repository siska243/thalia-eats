import React, { useEffect } from 'react'
import useReferentialData from './useQueryTanStack'
import { Route } from '@/helpers/Route'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentOrder } from '@/store/reducers/cartSlice'

export default function useCurrentCommande() {
        const { data, isLoading, isError, isFetched } = useReferentialData({ url: Route.current_commande, queryKey: 'current-commande' })
        
        const {currentOrder} = useSelector((state:any)=>state.cart)
          const dispatch=useDispatch()
        useEffect(() =>{
          if(data){
              dispatch(setCurrentOrder(data))
          }
        },[data])

  return {
    currentCommande:currentOrder,
    isLoading,
    isError,isFetched
  }
    
  
}
