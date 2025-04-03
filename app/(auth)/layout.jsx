"use server"
import { FetchData } from "@/helpers/FetchData";
import { Route } from "@/helpers/Route";
import { redirect } from "next/navigation";

const checkCurrentUser = async () => {
    return await FetchData.getData(Route.me);
}

export default async function RootLayout({ children }) {
    let redirectPath = null;

    try {
        const response = await checkCurrentUser();

        if (response?.user) {
            redirectPath = "/";
        }
    } catch (e) {
        console.log(e);
    } finally {
        if (redirectPath) {
            return redirect(redirectPath);
        }
    }

    return (
        <>
            {children}
        </>
    );
}