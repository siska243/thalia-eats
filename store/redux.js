import {combineReducers, configureStore} from '@reduxjs/toolkit'
import cartSlice from "./reducers/cartSlice"
import accountSlice from "@/store/reducers/account";


const rootReducer = combineReducers({
    cart: cartSlice,
    account:accountSlice
})
export const store = configureStore({
    reducer:rootReducer
})
