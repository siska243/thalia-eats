"use client"
import { handleAddProduct, removeProduct, setOrders } from "@/store/reducers/cartSlice";
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { getLocalstorageOrdering } from "@/helpers/localstorage-data";
import { toast } from 'react-toastify';
export default function useCreateOrdering(){

const dispatch=useDispatch()
const {orders}=useSelector((state:any)=>state.cart)
const Msg = ({ closeToast, toastProps,title }:any) => {
    return <div>
   {title}
    {/* <button>Retry</button> */}
    <button onClick={closeToast}>Close</button>
  </div>
}

const notification = (title:any)=>{
    toast.success(<Msg title={title}/>)
}

    useEffect(()=>{
        getLocalstorageOrdering()
    },[])

    const handleAddProducts=(product:any,quantity:number|null)=>{
        const title=`Vous avez ajouter le produit ${product.title} dans votre panier`
        notification(title)
        dispatch(handleAddProduct(product))
    }

    const removeProducts=(product:any,quantity:number|null)=>{
          const title=`Vous avez supprimer le produit ${product.title} dans votre panier`
        notification(title)
        dispatch(removeProduct(product))
    }

    // fonction pour calculer le prix total
        const calculateTotalPrice = () => {
        if (!orders || orders.length === 0) return 0;

        return orders.reduce((total: number, order: any) => {
            const productPrice = order.product.price || 0; // Vérification de la présence du prix
            const productQuantity = order.quantity || 1;   // Vérification de la quantité
            const TotalPrix =total + productPrice * productQuantity
            return parseFloat(TotalPrix.toFixed(2))
        }, 0);
    };
    return {
        ordering:orders,
        handleAddProduct:handleAddProducts,
        removeProduct:removeProducts,  
        calculateTotalPrice      
    }
}