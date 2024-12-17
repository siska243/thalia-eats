"use client"

export const setLocalStorageOrdering = (data) => {
    const json = JSON.stringify(data)
    if(typeof localStorage !== "undefined") {
        localStorage.setItem('thalia_orders', json)
    }

}

export const getLocalstorageOrdering = () => {
    if(typeof localStorage !== "undefined") {
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

