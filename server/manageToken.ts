"use server"
import { cookies } from 'next/headers'
import {FetchData} from "@/helpers/FetchData";
import {decode_data, encode_data} from "@/server/referential";
import {Route} from "@/helpers/Route";


/**
 * Les attributs communs aux cookies de session.
 *
 * `httpOnly` manquait : le jeton Sanctum et la fiche du compte etaient lisibles
 * par n'importe quel script de la page, donc exfiltrables par la premiere
 * injection venue. Rien ne les lit cote navigateur, seules les fonctions
 * serveur de ce fichier y touchent, donc les fermer ne retire aucune
 * fonctionnalite.
 *
 * `sameSite: "lax"` empeche un site tiers de declencher une requete
 * authentifiee en notre nom, tout en laissant passer les retours de navigation
 * depuis la passerelle de paiement, qui arrivent en GET de premier niveau.
 *
 * `path` est ecrit explicitement : sans lui le cookie prend le chemin de la
 * page qui l'a pose, et un jeton pose depuis /checkout ne serait pas renvoye
 * sur /historique.
 *
 * `flex_pay_number_order_thalia_eats` les reprend aussi : sa duree valait
 * `60*3600`, lu par Next comme un instant en millisecondes depuis 1970, donc
 * une date deja passee. Le cookie naissait expire.
 */
const ATTRIBUTS_SESSION = {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
} as const

export const parseJwt =async (token:string)=> {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

export const currentUser=async ()=>{

    const response = await FetchData.getData(Route.me);
    const cookieStore = await cookies()
    if (response ) {

        cookieStore.set('current_user_rdv', JSON.stringify(response), ATTRIBUTS_SESSION)
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
            const user=cookieStore.get('current_user_rdv')?.value
            if(user){
                return JSON.parse(user)
            }

        }

        return null
    }catch {
        return null
    }

}
export const getToken=async ()=>{

    try{
        const cookieStore = await cookies()

        const hasToken = cookieStore.has('token_thalia_eats')

        if(hasToken){
          const valeur = cookieStore.get('token_thalia_eats')?.value
          return valeur ? await decode_data(valeur) : null

        }

        return null
    }
    catch {

        return null
    }


}

export const setToken=async(token:string)=>{

    const encode=await encode_data(token)
    const cookieStore = await cookies()

    cookieStore.set('token_thalia_eats', encode, ATTRIBUTS_SESSION)

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
        catch (error) {
            console.error("Suppression du cookie impossible", error)
        }

    }
    const hasCurrentUser = cookieStore.has('current_user_rdv')
    if(hasCurrentUser){
        try {
            if(hasCurrentUser) cookieStore.delete('current_user_rdv')

            return "ok"
        }
        catch (error) {
            console.error("Suppression du cookie impossible", error)
        }

    }

}



export const userIsAuth=async ()=>{

    const token =await getToken()
    if(!token) return null
    // `getData` ne prend qu'une URL : le jeton est deja injecte par
    // l'intercepteur axios. Le second argument etait ignore.
    return await FetchData.getData(Route.user)

}

export const deleteAll=async ()=>{
    return await removeToken()
}

//flex pay order
export const setFlexPayOrder=async (orderNumber:string):Promise<void>=>{
    const cookieStore=await cookies()
    cookieStore.set('flex_pay_number_order_thalia_eats',orderNumber,ATTRIBUTS_SESSION)
}

export const getFlexPayOrder=async ():Promise<string|undefined>=>{
    const cookieStore=await cookies()
    return cookieStore.get('flex_pay_number_order_thalia_eats')?.value
}

export const deleteFlexPayOrder=async ():Promise<void>=>{
    const cookieStore=await cookies()
    cookieStore.delete('flex_pay_number_order_thalia_eats')
}