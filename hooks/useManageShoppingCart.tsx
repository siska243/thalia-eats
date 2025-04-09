"use client"
import {useDispatch, useSelector} from "react-redux";

const useManageShoppingCart=()=>{


    const dispatch=useDispatch()

    const {currentOrder} = useSelector((state:any)=>state.cart)

    const handleAddProduct=()=>{

    }

    const handleRemoveProduct=()=>{

    }

    return {
        handleAddProduct,
        handleRemoveProduct,
        currentOrder
    }
}