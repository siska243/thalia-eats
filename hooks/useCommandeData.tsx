"use client"

import useReferentialData from "./useQueryTanStack"
import {Route} from '@/helpers/Route'

export default function useDefaultData() {

    return useReferentialData({url: Route.default, queryKey: 'query-default-data-account'});
}
