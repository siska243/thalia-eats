"use client"

export const setLocalStorageOrdering = (data) => {

    if (typeof window !== "undefined") {

        const json = JSON.stringify(data)
        localStorage.setItem('thalia_orders', json)
    }

}

export const getLocalstorageOrdering = () => {

    if (typeof window !== "undefined") {
        var localData = localStorage.getItem("thalia_orders");
        if (localData && typeof localData === "string") {
            const json = JSON.parse(localData);
            if (json && json.length > 0) {
                return json
            }

        }
    }

    return []
};

