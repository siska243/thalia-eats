"use server"

import {btoa} from "node:buffer";


export const encode_data = async (string: string) => {
    try {
        return btoa(string)
    }
    catch (e){

    }

}
export const decode_data = async (string: string) => {

    try {
        return atob(string)
    }
    catch (e){
       return '[]'
    }


}

export const dataUrlBase64 = async (file:any) => {

    const fs = require('fs');
    try {
        const fileData = fs.readFileSync(file); // Lire le fichier
        return fileData.toString('base64'); // Convertir en Base64

    } catch (error) {
        console.error('Erreur lors de la lecture du fichier:', error);
        throw error;
    }
}