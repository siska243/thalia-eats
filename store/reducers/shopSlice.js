import {createSlice} from "@reduxjs/toolkit";

import {getLocalstorageOrdering} from "@/helpers/localstorage-data"

const convertStringToTable=(data)=>{


    if(typeof data ==="string"){
        return JSON.parse(data)
    }

    return data
}

const shopSlice = createSlice({
    name: "shop-slice",
    initialState: {
        cart: convertStringToTable(getLocalstorageOrdering()) ?? [],
        order:{
            is_passed:false,
            data:null
        }
    },
    reducers: {
        setShopCart: (state, action) => {
            state.cart = action.payload;
            return state;
        },
        setOrderCart:(state,action)=>{
            state.order=action.payload

            return state
        }

    }
});

export const {
    setShopCart,
    setOrderCart
} = shopSlice.actions;
export default shopSlice.reducer;
