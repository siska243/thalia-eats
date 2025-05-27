import {combineReducers, configureStore} from '@reduxjs/toolkit'
import cartSlice from "./reducers/cartSlice"
import accountSlice from "@/store/reducers/account";
import shopSlice from "@/store/reducers/shopSlice";


const rootReducer = combineReducers({
    cart: cartSlice,
    shop:shopSlice,
    account:accountSlice
})
export const store = configureStore({
    reducer:rootReducer
})
