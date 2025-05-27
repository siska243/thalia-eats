"use client"

import {OrderType, ProductType, ShopType} from "@/types/main";
import {useDispatch, useSelector} from "react-redux";
import {setOrderCart, setShopCart} from "@/store/reducers/shopSlice";
import {clearLocalStorageOrdering, setLocalStorageOrdering} from "@/helpers/localstorage-data";
import {notification} from "@/hooks/useCreateOrdering";
import {calcul_price, customProduct, price_delivrery, total} from "@/helpers/calculePrice";
import useDefaultData from "@/hooks/useCommandeData";
import {useEffect} from "react";
import useCurrentCommande from "@/hooks/useCurrentCommande";
import Notify from "@/components/toastify/Notify";

const useCart = () => {

    const {data,refetch}=useCurrentCommande()

    const {cart} = useSelector((state: {
        shop: {
            cart: any, order: {
                data: OrderType,
                is_passed: boolean
            }
        }
    }) => state.shop)



    const {data: townData} = useDefaultData()

    const updatePriccing=(custom_cart=null)=>{
        if (townData) {
            const delivery_address = localStorage.getItem("thalia_eat_order_delivery_address")

            if (typeof delivery_address === "string") {
                const my_town = JSON.parse(delivery_address)?.town

                handleCustomOrder(my_town,custom_cart)
            }
        }
    }

    useEffect(() => {
        if (typeof window !== "undefined" && localStorage.getItem("thalia_eat_order_delivery_address")) {
           updatePriccing()
        }
    }, [townData]);

    const dispatch = useDispatch()


    const handleAddProductCart = (product: ProductType) => {

        if(data){

            Notify(`Vous avez une commande en attente de paiement, veuillez finaliser`,'error')
            return
        }
        const copy_cart: ShopType[] = [...cart]
        const value: ShopType = {
            product,
            price: product.price,
            restaurant: product.restaurant,
            quantity: 1,
            currency: product.currency
        }

        const findRestaurant = copy_cart.find(item => item.restaurant.slug !== product.restaurant.slug)

        if (findRestaurant) {
            throw new Error("Oups")
        }

        const findIndex = copy_cart.findIndex(
            (item) => item.product.slug === product.slug
        );

        let newCart: ShopType[];

        if (findIndex !== -1) {

            const updatedItem = {
                ...copy_cart[findIndex],
                quantity: copy_cart[findIndex].quantity + 1,
            };
            newCart = [
                ...copy_cart.slice(0, findIndex),
                updatedItem,
                ...copy_cart.slice(findIndex + 1),
            ];
        } else {
            newCart = [...copy_cart, value];
        }

        const title = `Vous avez ajouter le produit ${product.title} dans votre panier`
        notification(title)

        dispatch(setShopCart(newCart))

        const json = JSON.stringify(newCart)
        setLocalStorageOrdering(json)

        updatePriccing(newCart)

        refetch()

    }
    const handleRemoveProduct = (product: ProductType) => {
        const copy_cart: ShopType[] = [...cart]
        const findIndex = copy_cart.findIndex(
            (item) => item.product.slug === product.slug
        );

        let newCart: ShopType[] = [];

        if (findIndex !== -1) {

            if (copy_cart[findIndex].quantity > 1) {
                const updatedItem = {
                    ...copy_cart[findIndex],
                    quantity: copy_cart[findIndex].quantity - 1,
                };
                newCart = [
                    ...copy_cart.slice(0, findIndex),
                    updatedItem,
                    ...copy_cart.slice(findIndex + 1),
                ];
            } else {
                newCart = copy_cart.filter(item => item.product.slug != product.slug)
            }

        }

        const title = `Vous avez supprimer le produit ${product.title} dans votre panier`
        notification(title)
        dispatch(setShopCart(newCart))
        const json = JSON.stringify(newCart)
        setLocalStorageOrdering(json)

        updatePriccing(newCart)

        refetch()
    }

    const handleDeleteAll = () => {

        dispatch(setShopCart([]))
        clearLocalStorageOrdering()

        updatePriccing()
    }

    const handleCustomOrder = (town: string,custom_cart=null) => {

        const livraisonPrix = price_delivrery(calcul_price(custom_cart ?? cart), townData?.delivrery_price, town)

        const frais_livraison = livraisonPrix ? livraisonPrix.frais_livraison : 0;

        const service_price = livraisonPrix ? livraisonPrix.service_price : 0

        const total_prix = total(calcul_price(custom_cart ?? cart), service_price, frais_livraison)

        const delivery_address = localStorage.getItem("thalia_eat_order_delivery_address")

        const order: OrderType = {
            products: customProduct(custom_cart ?? cart) as { uid: string, quantity: number }[],
            pricing: {
                frais_livraison,
                service_price,
                currency: livraisonPrix ? livraisonPrix.currency : (custom_cart?.[0]?.currency ?? cart[0]?.currency)
            },
            adresse: typeof delivery_address == "string" ? JSON.parse(delivery_address) : delivery_address,
            total_price: total_prix
        }

        dispatch(setOrderCart({
            data: order,
            is_passed: false
        }))
    }


    return {
        handleAddProductCart,
        handleRemoveProduct,
        handleDeleteAll,
        handleCustomOrder,
    }
}

export default useCart