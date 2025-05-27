"use client"

export const setLocalStorageOrdering = (data) => {

    if (typeof window !== "undefined") {

        const json = JSON.stringify(data)
        localStorage.setItem('thalia_orders_cart', json)
    }

}
export const clearLocalStorageOrdering=()=>{
    if (typeof window !== "undefined") {

        localStorage.removeItem('thalia_orders_cart')
        localStorage.removeItem("flex_pay_number_order_thalia_eats")
        localStorage.removeItem("thalia_eat_order_delivery_address")
    }
}
export const getLocalstorageOrdering = () => {

    if (typeof window !== "undefined") {
        const localData = localStorage.getItem("thalia_orders_cart");
        if (localData && typeof localData === "string") {
            const json = JSON.parse(localData);
            if (json && json.length > 0) {
                return json
            }

        }
    }

    return []
};

