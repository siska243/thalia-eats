
import React from 'react'
import logo from "@/public/assets/logo-thalia.png"
import { IoClose } from "react-icons/io5";
import Image from "next/image";

export default function Modal({ title, children, toggleModal }) {
    return (
        <div className="absolute top-0 left-0 right-0 z-[100] w-full bg-black/90 h-screen flex justify-center items-center overflow-hidden px-5">
            <div className="max-w-[600px] bg-white relative rounded-xl w-full">
                {/* bouton clos popup */}
                <button
                    className="absolute -top-5 -right-5 bg-red-600 w-[40px] h-[40px] rounded-full flex justify-center items-center text-2xl text-white"
                    onClick={toggleModal}
                >
                    <IoClose />
                </button>
                <div className="w-full h-[80px] md:h-[150px] overflow-hidden rounded-t-xl">
                    <Image src={logo} className="w-full h-full object-cover" alt="logo thalia-eats" width={600} height={600} />
                </div>

                {children}
            </div>
        </div>
    )
}

