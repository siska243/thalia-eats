"use server"

import {btoa} from "node:buffer";


/*
 * `encode_data` avalait son erreur sans rien renvoyer : en cas d'echec elle
 * retournait `undefined`, et l'appelant posait alors un cookie de session
 * valant « undefined ». L'utilisateur se retrouvait connecte avec un jeton
 * vide, sans message. Un encodage qui echoue doit echouer franchement.
 */
export const encode_data = async (string: string): Promise<string> => {
    return btoa(string)
}
export const decode_data = async (string: string) => {

    try {
        return atob(string)
    }
    catch {
       return '[]'
    }


}
