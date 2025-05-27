import React, { useEffect } from 'react'
import useReferentialData from './useQueryTanStack'
import { Route } from '@/helpers/Route'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentOrder } from '@/store/reducers/cartSlice'

export default function useCurrentCommande() {

        return  useReferentialData({ url: Route.current_commande, queryKey: 'current-commande' })

}
