"use client"

import useReferentialData from './useQueryTanStack'
import {Route} from '@/helpers/Route'
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {fetchAccountData, setIsAuth} from "@/store/reducers/account";
import {toast} from "react-toastify";


export default function useGetCurrentUser() {

    const {data, isLoading, isError, isFetched, refetch, error} = useReferentialData({
        url: Route.me,
        queryKey: 'query-check-account'
    })
    const {isAuth, data: userAccount} = useSelector(state => state.account)


    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchAccountData())
    }, [])

    useEffect(() => {
        if(isAuth){
            refetch()
        }
    }, [isAuth]);

    if (error) {
        dispatch(setIsAuth(false))
    }
    if (data) {
        dispatch(setIsAuth(false))
    }

    return {
        user: data ?? null,
        isError,
        isLoading,
        isFetched,
        refetch,
        isAuth,
        account: userAccount
    }
}