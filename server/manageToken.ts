"use server"
import { cookies } from 'next/headers'
import {FetchData} from "@/helpers/FetchData";
import {decode_data, encode_data} from "@/server/referential";
import {Route} from "@/helpers/Route";


export const parseJwt =async (token:string)=> {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

export const currentUser=async ()=>{

    const response = await FetchData.getData(Route.me);
    const cookieStore = await cookies()
    if (response ) {

        cookieStore.set('current_user_rdv', JSON.stringify(response), { secure: true })
    }
    else{
        cookieStore.delete('current_user_rdv')
    }
}

export const getCurrenUser=async()=>{

    try{
        const cookieStore = await cookies()

        const hasToken = cookieStore.has('current_user_rdv')

        if(hasToken){
            if(cookieStore.get('current_user_rdv')?.value){
                return JSON.parse(cookieStore.get('current_user_rdv').value)
            }

        }

        return null
    }catch (e) {
        return null
    }

}
export const getToken=async ()=>{

    try{
        const cookieStore = await cookies()

        const hasToken = cookieStore.has('token_thalia_eats')

        if(hasToken){
          return  await decode_data(cookieStore?.get('token_thalia_eats')?.value)

        }

        return null
    }
    catch (e){

        return null
    }


}

export const setToken=async(token:string)=>{

    const encode=await encode_data(token)
    const cookieStore = await cookies()

    cookieStore.set('token_thalia_eats', encode, { secure: true })

    setTimeout(async ()=>{
        await currentUser()
    },100)

}

export const removeToken=async ()=>{
    const cookieStore = await cookies()
    const hasToken = cookieStore.has('token_thalia_eats')

    if(hasToken && cookieStore.get('token_thalia_eats')?.value){
        try {
            cookieStore.delete('token_thalia_eats')
        }
        catch (error){
            console.log(error)
        }

    }
    const hasCurrentUser = cookieStore.has('current_user_rdv')
    if(hasCurrentUser){
        try {
            if(hasCurrentUser) cookieStore.delete('current_user_rdv')

            return "ok"
        }
        catch (error){
            console.log(error)
        }

    }

}

export const userIsAuth=async ()=>{

    const token =await getToken()
    if(!token) return null
    return await FetchData.getData(Route.user,token)

}

export const deleteAll=async ()=>{
    return await removeToken()
}