"use client"

import {useRouter, useSearchParams} from 'next/navigation'
import {ActionIcon, AdvancedRadio, Button, Checkbox, Grid, Modal, Text, Title} from "rizzui";
import useIsLargeScreen from "@/hooks/useLargeScreen";
import cart from "@/public/assets/images/cart.svg"
import mpesa from "@/public/assets/images/mobile.jpeg"
import Image from "next/image";
import {XMarkIcon} from "@heroicons/react/20/solid";
import {Suspense, useState} from "react";
import PhoneNumber from "@/components/forms/phone-number";
import Spinner from "@/components/Loader/Spinner";
import {FaCircleArrowRight} from "react-icons/fa6";
import {FetchData} from "@/helpers/FetchData";
import {Route} from "@/helpers/Route";
import Notify from "@/components/toastify/Notify";
import {setFlexPayOrder} from "@/server/manageToken";
import {useSelector} from "react-redux";
import {OrderType} from "@/types/main";
import {clearLocalStorageOrdering} from "@/helpers/localstorage-data";

const Page = () => {

    return <Suspense>
       <CheckoutPage />
    </Suspense>
}

const CheckoutPage=()=>{
    const {isLargeScreen} = useIsLargeScreen()


    const [isLoading, setIsLoading] = useState(false)

    const [modalState, setModalState] = useState(false)
    const [phone, setPhone] = useState<string | null>(null)

    const searchParams = useSearchParams()

    const search = searchParams.get('params')


    const handleCartPayement=async()=>{

        if (search) {

            try{

                setIsLoading(true)
                let decode = atob(search)
                const json=JSON.parse(decode)
                json.method="cart"

                if(!json?.order){

                    return Notify("Oups veuillez recommencer svp","error");
                }
                json.pricing=json?.order?.pricing
                json.products=json?.order?.products
                json.address=json?.order?.adresse
                json.total_price=json?.order.total_price

                delete json.order


                const response=await FetchData.sendData(Route.cart_checkout_commande,json)

                if(response.name=="AxiosError"){
                    const {response: {data: {message}}} = response;
                    Notify(message, "error");
                }
                else{


                    clearLocalStorageOrdering()

                    Notify(response.message, "success");

                    setTimeout(()=>{
                        localStorage.setItem("flex_pay_number_order_thalia_eats",response.data.orderNumber)
                        window.location.href = response.data.url
                    },300)

                }
            }
            catch (e){
                console.log(e)
            }
            finally {
                setIsLoading(false)
            }

        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (search) {
            const decode = atob(search)

            if (decode) {
                let json = JSON.parse(decode)
                json.phone = phone

                if(!json?.order){

                    return Notify("Oups veuillez recommencer svp","error");
                }
                json.pricing=json?.order?.pricing
                json.products=json?.order?.products
                json.address=json?.order?.adresse
                json.total_price=json?.order.total_price

                delete json.order

                setIsLoading(true)

                try {
                    const response = await FetchData.sendData(Route.valide_commande, json)

                    if (response.name === "AxiosError") {
                        const {response: {data: {message}}} = response;
                        Notify(message, "error");
                    } else {

                        clearLocalStorageOrdering()

                        Notify(response.message, "success");
                        setModalState(false)

                        setTimeout(()=>{
                            localStorage.setItem("flex_pay_number_order_thalia_eats",response.data.orderNumber)
                            window.location.href = "/payement/attente"
                        },300)


                        //window.location.href = response.data.url
                    }
                } catch (e) {

                } finally {
                    setIsLoading(false)
                }
            }
        }


    }
    return  <div className={'min-h-screen w-full flex justify-center items-center bg-gray-100 px-4 pt-[210px] md:pt-[200px] pb-5'}>
        <Grid columns={isLargeScreen ? "3" : "1"} className={"items-center justify-center"}>
            <Grid.Col colSpan={isLargeScreen ? "3" : "full"}>
                <Grid.Col colSpan={"full"}>
                    <h3 className={'font-bold text-primaryColor text-xl md:text-2xl text-center mb-4'}>Choisissez votre mode de paiement</h3>
                    <p className={'text-sm md:text-base text-center mb-10'}>Sélectionnez votre méthode préférée pour régler votre facture
                        facilement et rapidement </p>
                </Grid.Col>
                <Grid columns={isLargeScreen ? "2" : "1"}>
                    <Grid.Col>
                        <div
                            className="lg:max-w-sm p-6 bg-white shadow-lg rounded-lg">
                            <a href="#">
                                <h5 className="mb-4 text-lg md:text-xl font-bold tracking-tight text-gray-900 dark:text-white">Paiement
                                    par Mobile money</h5>
                            </a>
                            <div className={"w-full flex justify-center items-center"}>
                                <Image className='h-[180px] object-contain' src={mpesa} alt={"mobile"} width={250} height={180}/>
                            </div>

                            <p className="mb-3 text-sm md:text-base font-normal text-gray-700 dark:text-gray-400">
                                Réglez votre facture via votre compte M-Pesa, Orange Money, Airtel Money.
                            </p>
                            <button
                                onClick={() => setModalState(true)}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Payer
                                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                          stroke-width="2"
                                          d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                </svg>
                            </button>
                        </div>
                    </Grid.Col>
                    <Grid.Col>
                        <div
                            className="lg:max-w-sm p-6 bg-white shadow-lg rounded-lg">
                            <a href="#">
                                <h5 className="mb-4 text-lg md:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    Paiement par carte bancaire
                                </h5>
                            </a>

                            <div className={"w-full flex justify-center items-center"}>
                                <Image className='h-[180px] object-contain' src={cart} alt={"cart"} width={180} height={120}/>
                            </div>
                            <p className="mb-3 text-sm md:text-base font-normal text-gray-700 dark:text-gray-400">
                                Réglez votre facture facilement et en toute sécurité avec votre carte bancaire.
                            </p>
                            <button
                               onClick={handleCartPayement}
                               className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">

                                {
                                    isLoading ? <Spinner/> : <> Payer <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                                                                           aria-hidden="true"
                                                                           xmlns="http://www.w3.org/2000/svg"
                                                                           fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                              stroke-width="2"
                                              d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                    </svg></>
                                }

                            </button>
                        </div>
                    </Grid.Col>
                </Grid>

            </Grid.Col>
        </Grid>

        <Modal isOpen={modalState} onClose={() => setModalState(false)} containerClassName={'bg-white'}>
            <form className="m-auto px-7 pt-6 pb-8" onSubmit={handleSubmit}>
                <div className="mb-7 flex items-center justify-between">
                    <Title as="h3">Mode de paiement</Title>
                    <ActionIcon
                        size="sm"
                        variant="text"
                        onClick={() => setModalState(false)}
                    >
                        <XMarkIcon className="h-auto w-6" strokeWidth={1.8}/>
                    </ActionIcon>
                </div>
                <div className="[&_label>span]:font-medium">

                    <PhoneNumber className={'w-full mb-4'}
                                 country="cd"
                                 value={phone}
                                 onChange={(e: string) => setPhone(e)}
                                 inputProps={{
                                     name: 'phone',
                                     required: true,
                                     autoFocus: true
                                 }}
                                 preferredCountries={["cd"]}
                                 label={"Votre numéro de téléphone"}/>

                    <Checkbox
                        size="lg"
                        inputClassName="border-2"
                        className="col-span-2"
                        required
                        label={
                            <Text className="text-sm">
                                I agree to Thalia eats&lsquo;s{" "}
                                <a className="underline">Terms of Service</a> and{" "}
                                <a className="underline">Privacy Policy</a>
                            </Text>
                        }
                    />

                    <Button
                        className="p-4 flex items-center justify-center gap-2 w-full rounded-md mt-4 text-white bg-green-700 cursor-pointer "
                        type="submit"
                        size="md"
                        disabled={isLoading}

                        //onClick={() => setModalState(false)}
                    >
                        {
                            isLoading ? <Spinner/> : <>
                               <span>
                  <FaCircleArrowRight/>
                </span>
                                <span className="text-sm font-medium">Je confirme le paiement </span>
                            </>
                        }

                    </Button>
                </div>
            </form>
        </Modal>
    </div>
}

export default Page