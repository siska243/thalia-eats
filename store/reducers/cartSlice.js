const { createSlice, current } = require("@reduxjs/toolkit");
import { calcul_price, price_delivrery, total } from "@/helpers/calculePrice";
import { getLocalstorageOrdering, setLocalStorageOrdering } from "@/helpers/localstorage-data"

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


            const currentOrder = action.payload
            state.currentOrder = action.payload;
            
            return state

            const livraisonPrix = price_delivrery(calcul_price(state.orders), state.delivery_price, currentOrder.uid.slug)

            const frais_livraison = livraisonPrix ? livraisonPrix.frais_livraison : 0;
            const service_price = livraisonPrix ? livraisonPrix.service_price : 0

            const total_prix = total(calcul_price(state.orders), service_price, frais_livraison)

            state.pricings.livraison_price = frais_livraison
            state.pricings.service_price = service_price
            state.pricings.total = total_prix
            state.pricings.currency = livraisonPrix?.currency


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
});

export const { setCurrentOrder, setOrders, handleAddProduct, setDeliveryPrice, setDeliveryAdress, removeProduct } = cartSlice.actions;
export default cartSlice.reducer;
