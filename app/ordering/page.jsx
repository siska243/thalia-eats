"use client"
import BannerResto from "@/components/commons/BannerResto";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import searchLogo from "@/public/assets/images/search.png";
import BeforeFooterContent from "@/components/commons/BeforeFooterContent";
import SideMenu from "@/components/ordering/SideMenu";
import MainContent from "@/components/ordering/MainContent";
import Order from "@/components/ordering/Order";
import cookImg from "@/public/assets/images/cook.png";
import useCreateOrdering from "@/hooks/useCreateOrdering";
import Loader from "@/components/Loader/Loader";
import Link from "next/link";
import {useSelector} from "react-redux";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import BannerRestaurantPage from "@/components/restaurants/BannerRestaurantPage";
import useCart from "@/hooks/useCart";


export default function page() {

    const [infoResto, setInfoResto] = useState({});
    const [loading, setLoading] = useState(true);

    const {handleRemoveProduct} = useCart()

    const {cart: ordering} = useSelector((state) => state.shop)
    const {user} = useGetCurrentUser();

    const loadData = () => {
        try {
            setLoading(true)
            if (ordering.length > 0) {
                setInfoResto(ordering[0]?.restaurant);
            }
        } catch (e) {
            //console.log(e)
        } finally {
            setLoading(false)

        }
    }


    useEffect(() => {
        loadData()
    }, [ordering]);


    if (loading) {
        return <Loader/>;
    }

    // 1. Vérification de la connexion en premier
    if (!user) {
        return (
            <div
                className="max-w-[1300px] mx-auto px-3 md:px-5 flex items-center justify-center min-h-screen flex-col gap-5">
                <p data-aos="fade-up" className="text-center text-primaryColor text-base md:text-lg font-semibold">
                    Veuillez vous connecter pour accéder à vos commandes.
                </p>
                <Link
                    data-aos="fade-up"
                    href="/login" // Adapte le chemin selon ta route de connexion
                    className="py-3 px-6 bg-primaryColor text-white rounded-full shadow-lg hover:bg-secondaryColor transition-colors"
                >
                    Se connecter
                </Link>
            </div>
        )
    }

    return (
        <div className="pt-[220px] md:pt-[230px]">
            {/* Affiche BannerResto si infoResto contient des données */}
            {ordering?.length > 0 ? (
                <BannerResto restaurant={infoResto} restaurantIsLoading={loading}/>
            ) : (
                // Affiche BannerRestaurantPage si infoResto est vide
                <BannerRestaurantPage/>
            )}
            {/* <section className="mb-10">
        <div className="max-w-[1300px] mx-auto px-5 flex flex-col gap-3 items-center justify-between sm:flex-row">
          <p className="text-base lg:text-lg font-semibold">
            All Offers from McDonald’s East London
          </p>
          <form className="flex  items-center gap-4 rounded-full border border-secondaryColor py-2 px-4 md:py-3 md:px-6">
            <Image src={searchLogo} width={20} alt="search logo" />
            <input
              className="border-none outline-none"
              type="search"
              name=""
              id=""
              placeholder="Search from menu..."
            />
          </form>
        </div>
      </section> */}
            <section className="max-w-[1300px] mx-auto px-3 md:px-5">
                {/* choix du menu uniquement visible sur le mobile */}
                {/* <div className="lg:hidden py-5 border rounded-lg border-[#BCBCBC] bg-[#FBFBFB] overflow-hidden mb-4 flex justify-between">
          <div className="flex gap-3 pl-5 items-center">
            <Image src={cookImg} width={30} height={20} alt="food" />
            <h3 className="text-2xl font-semibold text-black">Menu</h3>
          </div>
          <form className="mr-4">
            <select className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out ">
              <option value="">Choose an option</option>
              {menu.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </form>
        </div> */}
                {/* ************* */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* SideMenu occupe 1/4 de la largeur totale */}
                    {/* <div className="col-span-1 hidden lg:block">
            <SideMenu />
          </div> */}

                    {/* MainContent occupe 1/2 de la largeur totale */}
                    <div className=" bg-white lg:col-span-2">
                        <MainContent/>
                    </div>

                    {/* Order occupe 1/4 de la largeur totale */}
                    <div className="">
                        <Order ordering={ordering || []} removeProduct={handleRemoveProduct}/>
                    </div>
                </div>
            </section>

            {/* beforefootercontent section */}
            <BeforeFooterContent infoResto={infoResto || []}/>
        </div>
    );
}
