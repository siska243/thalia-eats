"use client"
import useReferentialData from "@/hooks/useQueryTanStack";
import {Route} from "@/helpers/Route";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {BiEdit} from "react-icons/bi";
import {ActionIcon, Modal, Title} from "rizzui";
import {XMarkIcon} from "@heroicons/react/20/solid";
import {updateAddresseCurrentOrder} from "@/store/reducers/cartSlice";
import Spinner from "@/components/Loader/Spinner";
import {notification} from "@/hooks/useCreateOrdering";

const ConfirmAdress = () => {

    const {data, isLoading, isError, isFetched} = useReferentialData({
        url: Route.default,
        queryKey: "dafault",
    });
    const [town, setTown] = useState("");
    const [street, setStreet] = useState("");
    const [numberStreet, setNumberStreet] = useState("");
    const [reference, setReference] = useState("");
    const [error, setError] = useState("");

    const {currentOrder} = useSelector((state: any) => state.cart)
    const [modalState,setModalState]=useState<boolean>(false)

    const [loading,setLoading]=useState<boolean>(false)

    const dispatch=useDispatch()

    useEffect(() => {
        if(currentOrder){

            setTown(currentOrder.town_id?.slug)
            setStreet(currentOrder.street)
            setReference(currentOrder?.reference_adresse)
            setNumberStreet(currentOrder?.number_street)
        }
    }, [currentOrder]);

    const handlerSendData = (e) => {
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
                const formData = {
                    town,
                    street,
                    number_street:numberStreet,
                    reference,
                };


                close=true
                dispatch(updateAddresseCurrentOrder(formData))


                // Réinitialiser tous les champs du formulaire
            }
        }
        catch (e) {

        }finally {
            if(close){
                setModalState(false)
                notification("Votre adresse de livraison a été mis à jour")
            }

            setLoading(false)
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
            <p className={'text-muted'}>{currentOrder?.user_delivery_complet_adress}</p>
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
                                        Selectionner la commune
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