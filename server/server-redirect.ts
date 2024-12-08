"use server"

import { redirect } from "next/navigation"
import { setToken } from "./manageToken";

type RedirectType={
    token:string,
    url:string
}
export const loginRedirect=async ({token,url}:RedirectType)=>{
    await setToken(token)
    return redirect(`${url}`)

}