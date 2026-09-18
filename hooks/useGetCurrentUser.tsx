"use client"

import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import useReferentialData from './useQueryTanStack'
import {Route} from '@/helpers/Route'
import {fetchAccountData} from "@/store/reducers/account";

type EtatCompte = {
    isAuth: boolean;
    data: unknown;
};

/**
 * Le compte du visiteur.
 *
 * Un effet ecrivait ici l'etat d'authentification :
 *
 *     if (error) dispatch(setIsAuth(false))
 *     if (data)  dispatch(setIsAuth(false))
 *
 * Les deux branches posaient `false`, y compris celle du succes : une requete
 * de compte qui aboutissait declarait donc le visiteur deconnecte. Le defaut
 * est reste invisible parce qu'aucun composant ne lit encore `isAuth` — il
 * attendait le premier.
 *
 * Le thunk `fetchAccountData` tient deja cet etat, correctement, dans ses cas
 * `fulfilled` et `rejected`. C'etait une seconde definition de la meme chose,
 * et c'est celle qui se trompait.
 */
export default function useGetCurrentUser() {
    const {data, isLoading, isError, isFetched, refetch} = useReferentialData({
        url: Route.me,
        queryKey: 'query-check-account'
    })

    const {isAuth, data: userAccount} = useSelector(
        (state: {account: EtatCompte}) => state.account
    )

    // Le magasin Redux est en JavaScript : son dispatch n'est pas type, et les
    // thunks async y sont donc refuses.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dispatch = useDispatch<any>()

    useEffect(() => {
        dispatch(fetchAccountData())
    }, [dispatch])

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
