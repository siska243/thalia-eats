"use client";

import React, {useEffect} from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {useDispatch} from "react-redux";
import {fetchCurrentOrder} from "@/store/reducers/cartSlice";


export function ReactQueryProvider({ children }: React.PropsWithChildren) {
    const [client] = React.useState(new QueryClient());

    const dispatch=useDispatch()

    useEffect(() => {
        dispatch(fetchCurrentOrder(null))
    }, []);

    return (
        <QueryClientProvider client={client}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}