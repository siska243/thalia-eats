"use client"

import {CommuneType, DefaultDataType, OrderType, ProductType, ShopType} from "@/types/main";
import {useDispatch, useSelector} from "react-redux";
import {setOrderCart, setShopCart} from "@/store/reducers/shopSlice";
import {clearLocalStorageOrdering, setLocalStorageOrdering} from "@/helpers/localstorage-data";
import {notification} from "@/hooks/useCreateOrdering";
import {calcul_price, customProduct, price_delivrery, total} from "@/helpers/calculePrice";
import {useEffect} from "react";
import useCurrentCommande from "@/hooks/useCurrentCommande";
import useReferentialData from "@/hooks/useQueryTanStack";
import {Route} from "@/helpers/Route";


const useCart = () => {

    const {data}=useCurrentCommande()

    const {cart} = useSelector((state: {
        shop: {
            cart: ShopType[], order: {
                data: OrderType,
                is_passed: boolean
            }
        }
    }) => state.shop)


    const {data: townData, refetch} = useReferentialData<DefaultDataType>({url: Route.default, queryKey: 'query-default-data-account-user'});


    const dispatch = useDispatch()


    const handleAddProductCart = async (product: ProductType) => {

        await refetch()
        if(data){

            //Notify(`Vous avez une commande en attente de paiement, veuillez finaliser`,'error')
            //return
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



    }
    const handleRemoveProduct = async (product: ProductType) => {
        await refetch()
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

    }

    const handleDeleteAll = () => {

        dispatch(setShopCart([]))
        clearLocalStorageOrdering()

        updatePriccing()
    }

    const handleCustomOrder = (town?: CommuneType, custom_cart: ShopType[] | null = null) => {

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

    /**
     * Rechiffre la commande a partir de l'adresse deja choisie.
     *
     * Cette fonction etait declaree *avant* `handleCustomOrder`, qu'elle
     * appelle. Comme les deux sont des `const`, l'appeler avant que la seconde
     * soit initialisee leve un ReferenceError : elle ne tenait que parce que
     * son seul appelant est un `useEffect`, execute apres le rendu. Toute
     * autre invocation — un gestionnaire d'evenement, un appel direct — aurait
     * casse. Elle est desormais declaree apres sa dependance.
     */
    const updatePriccing = (custom_cart: ShopType[] | null = null) => {
        if (!townData) return

        const delivery_address = localStorage.getItem("thalia_eat_order_delivery_address")

        if (typeof delivery_address !== "string") return

        handleCustomOrder(JSON.parse(delivery_address)?.town, custom_cart)
    }

    /*
     * Rechiffre la commande des que la grille tarifaire arrive, si une adresse
     * a deja ete choisie.
     *
     * Volontairement declare ici, sous les fonctions qu'il appelle : place plus
     * haut, il les referencait avant leur initialisation. Seul le fait qu'un
     * effet s'execute apres le rendu empechait le ReferenceError.
     */
    useEffect(() => {
        if (typeof window === "undefined") return
        if (!localStorage.getItem("thalia_eat_order_delivery_address")) return

        refetch()
        updatePriccing()
        // `updatePriccing` et `refetch` sont recrees a chaque rendu : les
        // suivre relancerait le chiffrage en boucle. Seule l'arrivee de la
        // grille tarifaire doit le declencher.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [townData]);


    return {
        handleAddProductCart,
        handleRemoveProduct,
        handleDeleteAll,
        handleCustomOrder,
    }
}

export default useCart