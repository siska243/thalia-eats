import {createAsyncThunk} from "@reduxjs/toolkit";

const {createSlice} = require("@reduxjs/toolkit");
import {getLocalstorageOrdering, setLocalStorageOrdering} from "@/helpers/localstorage-data"
import {FetchData} from "@/helpers/FetchData";
import {Route} from "@/helpers/Route";

const customApiSendData=(orders=[])=>{
    let tabs=[]

    orders?.forEach(item=>{
        tabs.push({
            product_id:item.product.uid,
            quantity:item.quantity,
            pricing:item.product?.currency.id
        })
    })

    return tabs
}

export const fetchCurrentOrder = createAsyncThunk(
    "order/CurrentOrder",
    async (data,thunkAPI) => {

        try {

            const response = await FetchData.getData(
                Route.current_commande,
            );
            if (response.name === "AxiosError") {
                return thunkAPI.rejectWithValue(response.response.data);
            }

            return response


        } catch (error) {
            console.error("Error fetching data:", error);
        }

    }
)

export const sendCurrentOrder = createAsyncThunk(
    "order/CurrentOrder-send",
    async ({products}, thunkAPI) => {

        const data={
            products:customApiSendData(products)
        }

        try {

            const response = await FetchData.sendData(
                Route.add_produit_commande,
                data
            );
            if (response.name === "AxiosError") {
                return thunkAPI.rejectWithValue(response.response.data);
            }

            return response


        } catch (error) {
            console.error("Error fetching data:", error);
        }


    }
)

export const updateAddresseCurrentOrder = createAsyncThunk(
    "order/CurrentOrder-update-addresse",
    async (data, thunkAPI) => {



        try {

            const response = await FetchData.sendData(
                Route.update_address_delivery,
                data
            );
            if (response.name === "AxiosError") {
                return thunkAPI.rejectWithValue(response.response.data);
            }

            return response


        } catch (error) {
            console.error("Error fetching data:", error);
        }


    }
)

export const removeProductCurrentOrder = createAsyncThunk(
    "order/CurrentOrder-remove",
    async ({product}, thunkAPI) => {

        try {

            const response = await FetchData.sendData(
                Route.delete_produit_commande,
                {
                    product_id:product
                }
            );
            if (response.name === "AxiosError") {
                return thunkAPI.rejectWithValue(response.response.data);
            }

            return response


        } catch (error) {
            console.error("Error fetching data:", error);
        }


    }
)
const cartSlice = createSlice({
    name: "cart-slice",
    initialState: {
        orders: getLocalstorageOrdering(),
        currentOrder: null,
        pricings: {
            service_price: 0,
            livraison_price: 0,
            currency: null,
            total: 0
        },
        delivery_adress: null,
        delivery_price: null
    },
    reducers: {
        setOrders: (state, action) => {
            state.orders = action.payload;
            return state;
        },
        setDeliveryAdress: (state, action) => {
            state.delivery_adress = action.payload
        },
        setDeliveryPrice: (state, action) => {
            state.delivery_price = action.payload
        },
        setCurrentOrder: (state, action) => {

            state.currentOrder = action.payload;

            return state

        },
        handleAddProduct: (state, action) => {
            const value = {
                product: action.payload,
                quantity: 1,
            };
            const copy_order = state.orders;
            const findIndex = copy_order.findIndex(
                (item) => item.product.slug === action.payload.slug
            );

            if (findIndex !== -1) {
                var current_quantity = copy_order[findIndex].quantity;
                copy_order[findIndex].quantity = current_quantity + 1;

            } else {
                copy_order.push(value);
            }


            state.orders = copy_order

            setLocalStorageOrdering(copy_order);

            return state
        },
        removeProduct: (state, action) => {

            let copy_order = state.orders;
            const findIndex = copy_order.findIndex(
                (item) => item.product.slug === action.payload.slug
            );

            if (findIndex !== -1) {
                var current_quantity = copy_order[findIndex].quantity;
                if (current_quantity == 1) {
                    copy_order = copy_order.filter(item => item.product.slug != action.payload.slug)
                } else {
                    copy_order[findIndex].quantity = current_quantity - 1;
                }

            }
            state.orders = copy_order
            setLocalStorageOrdering(copy_order);

            return state
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrentOrder.pending, (state) => {

            })
            .addCase(fetchCurrentOrder.fulfilled,(state,action)=>{
                state.currentOrder=action.payload
            })
            .addCase(fetchCurrentOrder.rejected,(state,action)=>{

            })
            .addCase(sendCurrentOrder.pending, (state) => {

            })
            .addCase(sendCurrentOrder.fulfilled,(state,action)=>{
                state.currentOrder=action.payload

            })
            .addCase(sendCurrentOrder.rejected,(state,action)=>{

            })

            .addCase(removeProductCurrentOrder.pending, (state) => {

            })
            .addCase(removeProductCurrentOrder.fulfilled,(state,action)=>{
                state.currentOrder=action.payload

            })
            .addCase(removeProductCurrentOrder.rejected,(state,action)=>{

            })

            .addCase(updateAddresseCurrentOrder.pending, (state) => {

            })
            .addCase(updateAddresseCurrentOrder.fulfilled,(state,action)=>{
                state.currentOrder=action.payload

            })
            .addCase(updateAddresseCurrentOrder.rejected,(state,action)=>{

            })
    }
});

export const {
    setCurrentOrder,
    setOrders,
    handleAddProduct,
    setDeliveryPrice,
    setDeliveryAdress,
    removeProduct
} = cartSlice.actions;
export default cartSlice.reducer;
