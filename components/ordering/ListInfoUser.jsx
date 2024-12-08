import React from 'react'

export default function ListInfoUser({ Icon, title, lastBorder, Isdevery_address, currentOrder }) {

    return (
        <>
            {
                Isdevery_address ? (
                    <div className={`${lastBorder ? "border-none" : "border-b "} py-4 `}>
                        <div className='flex items-center gap-3 mb-3'>
                            <Icon className="text-3xl text-gray-500" />
                            <p className='text-secondayColor text-sm'>Adresse de livraison</p>
                        </div>
                        <div className='flex flex-col gap-2'>
                            {/* commune */}
                            <div className='flex'>
                                <h6 className='text-gray-500 text-sm flex gap-10 items-center w-[100px] '>Commune : </h6>
                                <span>{currentOrder?.town_id?.title}</span>
                            </div>
                            {/* avenue */}
                            <div className='flex'>
                                <h6 className='text-gray-500 text-sm flex gap-10 items-center w-[100px] '>Avenue : </h6>
                                <span>{currentOrder?.address_delivery}</span>
                            </div>
                            {/* numéro */}
                            <div className='flex'>
                                <h6 className='text-gray-500 text-sm flex gap-10 items-center w-[100px] '>Numéro : </h6>
                                <span>{currentOrder?.number_street}</span>
                            </div>
                            <div className='flex'>
                                <h6 className='text-gray-500 text-sm flex gap-10 items-center w-[100px] '>Réference : </h6>
                                <span>{currentOrder?.reference_adresse}</span>
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className={`flex items-center gap-3 py-4 ${lastBorder ? "border-none" : "border-b "}`}>
                        <Icon className="text-3xl text-gray-500" />
                        <h5 className='text-gray-500 text-sm'>{title}</h5>
                    </div>
                )}

        </>
    )
}
