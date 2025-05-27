import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Route } from "@/helpers/Route";
import { FetchData } from "@/helpers/FetchData";
import Notify from "@/components/toastify/Notify";

type Props={
    orderNumber?:string
}
const fetchPaymentStatus = async (orderNumber:string|null) => {
    if (!orderNumber) return null;
    const response = await FetchData.getData(Route.swr_check_paiement(orderNumber));
    if (response?.name === "AxiosError") return null;
    return response;
};

export default function PaymentChecker() {
    const router = useRouter();

    let orderNumber = null;
    if (typeof window !== "undefined") {
        orderNumber = localStorage.getItem("flex_pay_number_order_thalia_eats");
    }

    const { data } = useQuery({
        queryKey: ["payment-status", orderNumber],
        queryFn: () => fetchPaymentStatus(orderNumber),
        refetchInterval: orderNumber ? 5000 : false,
        enabled: !!orderNumber,
        staleTime: 0,
    });

    useEffect(() => {
        if (data) {
            Notify("Status paiement", "success", data.name);

            localStorage.removeItem("flex_pay_number_order_thalia_eats");
            let link;
            switch (data.code) {
                case "0":
                    link = "/payement/success";
                    break;
                case "1":
                    link = "/payement/error";
                    break;
                case "2":
                    link = "/payement/attente";
                    break;
                default:
                    link = "/payement/cancel";
                    break;
            }

            router.replace(link);
        }
    }, [data, router]);

    return null;
}
