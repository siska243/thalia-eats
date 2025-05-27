"use client"
import useReferentialData from "@/hooks/useQueryTanStack";
import {Route} from "@/helpers/Route";
import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {BiEdit} from "react-icons/bi";
import {ActionIcon, Modal, Title} from "rizzui";
import {XMarkIcon} from "@heroicons/react/20/solid";
import {updateAddresseCurrentOrder} from "@/store/reducers/cartSlice";
import Spinner from "@/components/Loader/Spinner";
import {notification} from "@/hooks/useCreateOrdering";
import useCart from "@/hooks/useCart";
import {OrderType, ShopType} from "@/types/main";

const ConfirmAdress = () => {

    const {data, isLoading, isError, isFetched} = useReferentialData({
        url: Route.default,
        queryKey: "default",
    });

    const {order} = useSelector((state:{shop:{order:{data:OrderType}}}) => state.shop)

    const [town, setTown] = useState("");
    const [street, setStreet] = useState("");
    const [numberStreet, setNumberStreet] = useState("");
    const [reference, setReference] = useState("");
    const [error, setError] = useState("");

    const [complet_address,setCustomAddress]=useState("")

    const [modalState,setModalState]=useState<boolean>(false)

    const [loading,setLoading]=useState<boolean>(false)

    const {handleCustomOrder}=useCart()

    const updateAddress=useCallback((address)=>{

        setTown(address.town?.slug)
        setStreet(address.street)
        setReference(address?.reference)
        setNumberStreet(address?.number_street)
        setCustomAddress(`${address.adresse ?? ""}`)

    },[order])


    useEffect(() => {
        if(typeof window !=="undefined"){
            const delivery_address = localStorage.getItem("thalia_eat_order_delivery_address")
            let address=delivery_address
            if(typeof delivery_address=="string"){
                address=JSON.parse(delivery_address)
            }

            if(address){
                updateAddress(address)
                handleCustomOrder(address.town)
            }

        }

    }, []);


    useEffect(() => {
        if(order?.data){

            const {adresse:address}=order.data
            if(address){
               updateAddress(address)
            }
        }
    }, [order?.data]);

    const handlerSendData = (e:any) => {
        e.preventDefault();
        let close=null;

        try{

            setLoading(true)

            if (
                town === "" ||
                street === "" ||
                numberStreet === "" ||
                reference === ""
            ) {
                setError("Veuillez remplir tous les champs");
                return;
            } else {


                const current_address= {
                    adresse: `${street} ${numberStreet} ${town}`,
                    town: data?.town?.find(item=>item.slug==town),
                    reference: reference,
                    street: street,
                    number_street: numberStreet
                }

                setCustomAddress(`${current_address.street} ${current_address?.number_street} ${current_address?.reference ?? ""} ${current_address?.town?.title ?? ""}`)
                localStorage.setItem("thalia_eat_order_delivery_address",JSON.stringify(current_address))

                handleCustomOrder(current_address?.town)

                close=true


            }
        }
        catch (e) {

        }finally {
            if(close){
                setTimeout(()=>{
                    setLoading(false)
                    notification("Votre adresse est enregistré avec success")
                    setModalState(false)
                },1000)
            }

        }

    };

    return <div className="p-5">
        <div className={"flex justify-between items-center mb-4"}>
            <p className="text-primaryColor uppercase text-base font-semibold ">
                Adresse de livraison
            </p>
            <BiEdit size={"24"} className={"cursor-pointer"} onClick={()=>setModalState(true)}/>
        </div>

        <div className={"mb-2"}>
            <p className={'text-muted'}>{complet_address}</p>
        </div>


        <Modal isOpen={modalState} onClose={() => setModalState(false)} className={"z-[9999]"}>
            <div className="m-auto px-7 pt-6 pb-8 bg-white">
                <div className="mb-3 flex items-center justify-between">
                    <Title as="h3">Adresse de livraison</Title>
                    <ActionIcon
                        size="sm"
                        variant="text"
                        onClick={() => setModalState(false)}
                    >
                        <XMarkIcon className="h-auto w-6" strokeWidth={1.8} />
                    </ActionIcon>
                </div>
                <hr className={"mb-4"} />
                <div className="  bg-white ">
                    <form className="w-full h-full space-y-6 " onSubmit={handlerSendData}>
                        {/* commune and quartier */}
                        <div className="grid lg:grid-cols-2 gap-4">
                            {/* commune select */}
                            <div className="flex flex-col">
                                <label htmlFor="email" className="text-secondaryColor mb-2">
                                    Commune
                                </label>
                                <select
                                    name=""
                                    id="commune"
                                    className="py-2 px-4 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondaryColor focus:outline-none text-gray-400 text-sm"
                                    required
                                    onChange={(e) => setTown(e.target.value)}
                                    value={town}
                                >
                                    <option value="" className="text-sm">
                                        Sélectionner la commune
                                    </option>
                                    {data?.town?.map((town:any) => {
                                        return <option value={town.slug} key={town.uid}>
                                                {town.title}
                                            </option>

                                    })}
                                </select>
                            </div>
                            {/* avenue input */}
                            <div className="flex flex-col">
                                <label htmlFor="password" className="text-secondaryColor mb-2">
                                    Avenue
                                </label>
                                <input
                                    type="text"
                                    id="Avenue"
                                    required
                                    className="py-2 px-4 sm:py-3  rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondaryColor focus:outline-none placeholder:text-sm"
                                    placeholder="Quelle est votre Avenue"
                                    value={street}
                                    onChange={(e) => setStreet(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* numero avaenue and la reférence de l'avenue  */}
                        <div className="grid lg:grid-cols-2 gap-4">
                            {/* numero avenue */}

                            <div className="flex flex-col">
                                <label htmlFor="password" className="text-secondaryColor mb-2">
                                    Numéro de l'avenue
                                </label>
                                <input
                                    type="text"
                                    id="ref"
                                    required
                                    className="py-2 px-4 sm:py-3  rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondaryColor focus:outline-none placeholder:text-sm"
                                    placeholder="Le numéro de votre avenue"
                                    value={numberStreet}
                                    onChange={(e) => setNumberStreet(e.target.value)}
                                />
                            </div>
                            {/* la reférence de l'avenue */}
                            <div className="flex flex-col">
                                <label htmlFor="password" className="text-secondaryColor mb-2">
                                    Reférence
                                </label>
                                <input
                                    type="text"
                                    id="Avenue"
                                    required
                                    className="py-2 px-4 sm:py-3  rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondaryColor focus:outline-none placeholder:text-sm"
                                    placeholder="la Reférence proche de votre domicile"
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full py-3 text-sm sm:text-base sm:py-4 bg-secondaryColor text-white rounded-lg font-semibold hover:bg-secondaryColor/90 focus:ring-2 focus:ring-secondaryColor focus:ring-opacity-50"
                        >
                            {loading ? <Spinner />: "Confirmer votre adresse"}
                        </button>
                    </form>
                </div>
            </div>
        </Modal>


    </div>
}

export default ConfirmAdress