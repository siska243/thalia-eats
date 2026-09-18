"use client"

import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux";
import {toast} from 'react-toastify';
import {handleAddProduct, removeProduct, removeProductCurrentOrder} from "@/store/reducers/cartSlice";
import {getLocalstorageOrdering} from "@/helpers/localstorage-data";
import {ProductType, ShopType} from "@/types/main";

/**
 * Le corps d'un toast.
 *
 * react-toastify injecte `closeToast` et `toastProps` dans le composant qu'on
 * lui passe ; ni l'un ni l'autre ne servaient ici, et ils etaient declares
 * uniquement pour etre ignores.
 */
export const Msg = ({title}: {title: string}) => <div>{title}</div>;

export const notification = (title: string) => {
    toast.success(<Msg title={title}/>)
}

const calculateTotalPrice = (orders: ShopType[]) => {
    if (!orders?.length) return 0;

    return orders.reduce((total: number, order) => {
        const prix = order.product?.price ?? 0;
        const quantite = order.quantity || 1;

        return parseFloat((total + prix * quantite).toFixed(2));
    }, 0);
};

export default function useCreateOrdering() {
    // Le magasin Redux est en JavaScript : son dispatch n'est pas type, et les
    // thunks async y sont donc refuses.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dispatch = useDispatch<any>()
    const {orders} = useSelector((state: {cart: {orders: ShopType[]}}) => state.cart)

    useEffect(() => {
        getLocalstorageOrdering()
    }, [])

    const handleAddProducts = (product: ProductType) => {
        notification(`Vous avez ajouté le produit ${product.title} dans votre panier`)
        dispatch(handleAddProduct(product))
    }

    const removeProducts = (product: ProductType) => {
        notification(`Vous avez supprimé le produit ${product.title} dans votre panier`)

        dispatch(removeProduct(product))
        // `cartSlice` est en JavaScript : createAsyncThunk ne peut pas deduire
        // le type de son argument depuis un parametre destructure sans
        // annotation, et le declare donc sans argument. Le thunk en attend bien
        // un — c'est l'inference qui est aveugle, pas l'appel qui est faux.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dispatch((removeProductCurrentOrder as any)({product: product.uid}))
    }

    return {
        ordering: orders,
        handleAddProduct: handleAddProducts,
        removeProduct: removeProducts,
        calculateTotalPrice
    }
}
