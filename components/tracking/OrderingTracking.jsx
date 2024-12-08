"use client"
import React, { useState } from "react";


export default function OrderingTracking() {

    const orders = [
        { id: "CMD12345", amount: "45€", date: "07/12/2024 12:30", status: 2 },
        { id: "CMD67890", amount: "25€", date: "06/12/2024 10:15", status: 3 },
        { id: "CMD11223", amount: "75€", date: "05/12/2024 08:45", status: 1 },
    ];

    const trackingStages = [
        { step: 1, label: "Commande reçue" },
        { step: 2, label: "En préparation" },
        { step: 3, label: "Commande expédiée" },
        { step: 4, label: "En livraison" },
    ];

    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleSelectOrder = (orderId) => {
        const order = orders.find((order) => order.id === orderId);
        setSelectedOrder(order);
    };

    return (
        <section className="max-w-[900px] mx-auto px-4 py-10">
            <h1
                className="text-3xl font-extrabold text-center mb-12 text-secondaryColor"

            >
                Suivi de commande
            </h1>
            <div
                className="rounded-xl shadow-lg p-10 bg-secondaryColor "
            >
                {/* Dropdown */}
                <div className="flex justify-center mb-8">
                    <div className="w-full md:w-2/3 lg:w-1/2">
                        <label
                            htmlFor="orderDropdown"
                            className="text-lg font-medium mb-2 block text-white"

                        >
                            Sélectionnez une commande
                        </label>
                        <select
                            id="orderDropdown"
                            className="w-full py-3 px-4 rounded-lg bg-white border border-gray-300 shadow-sm transition focus:ring-4 focus:ring-[#fc8a06] focus:outline-none"
                            onChange={(e) => handleSelectOrder(e.target.value)}
                            defaultValue=""
                        >
                            <option value="" disabled>
                                -- Choisissez une commande --
                            </option>
                            {orders.map((order) => (
                                <option key={order.id} value={order.id}>
                                    {order.id} ({order.amount})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Order details */}
                {selectedOrder && (
                    <div className="mt-10">
                        <div
                            className="rounded-lg p-6 mb-10 shadow bg-primaryColor text-secondaryColor"

                        >
                            <h2 className="text-2xl font-semibold mb-3">
                                Commande : {selectedOrder.id}
                            </h2>
                            <p>
                                <strong>Montant : </strong>{selectedOrder.amount}
                            </p>
                            <p>
                                <strong>Date : </strong>{selectedOrder.date}
                            </p>
                        </div>

                        {/* Tracking stages */}
                        <div className="flex justify-between items-center">
                            {trackingStages.map((stage, index) => (
                                <div key={index} className="text-center flex flex-col items-center">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg transition duration-300 shadow-lg ${index + 1 <= selectedOrder.status
                                            ? "bg-green-600"
                                            : "bg-gray-300"
                                            }`}
                                    >
                                        {index + 1}
                                    </div>
                                    <p
                                        className={`mt-3 text-sm font-medium ${index + 1 <= selectedOrder.status
                                            ? "text-green-700"
                                            : "text-gray-500"
                                            }`}
                                    >
                                        {stage.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
