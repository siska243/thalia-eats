import {getCurrenUser, getToken} from "@/server/manageToken";
import {FetchData} from "@/helpers/FetchData";
import {Route} from "@/helpers/Route";
import {redirect} from "next/navigation";


const checkCurrentUser=async()=>{
    return await FetchData.getData(Route.me)
}
export default async function RootLayout({ children }) {

    try{
        const response=await checkCurrentUser()

        if(response?.name!=="AxiosError"){
            redirect("/")
            return null
        }
    }
    catch (e){

    }finally {

    }


  return (
    <>
        {children}
    </>
  );
}
