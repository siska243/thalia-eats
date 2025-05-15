"use client";
import React, { useState } from "react";

export default function OrderingTracking({ data }) {
  const orders = Array.isArray(data) ? data : [];
  const currency = orders[0]?.products[0]?.currency?.code || "€";
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleSelectOrder = (orderId) => {
    const order = orders.find((order) => order.uid === orderId);
    setSelectedOrder(order);
  };

  const renderStatusMessage = (selectedOrder) => {
    if (!selectedOrder) return null;

    return (
      <div className="space-y-4">
        <div
          className={`p-4 rounded-xl text-sm font-medium ${
            selectedOrder.accepted_at
              ? "bg-blue-100 text-blue-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {selectedOrder.accepted_at
            ? "✅ Commande en cours de préparation"
            : "🕒 En attente de confirmation"}
        </div>

        {selectedOrder.delivery_at && selectedOrder.delivrery_driver_id && (
          <div className="p-4 rounded-xl bg-green-100 text-green-700 text-sm font-medium">
            🚚 En cours de livraison
          </div>
        )}
      </div>
    );
  };

  const renderDriverInfo = (selectedOrder) => {
    if (!selectedOrder?.delivrery_driver_id) return null;

    const driver = selectedOrder.delivrery_driver_id.user;

    return (
      <div className="mt-6 bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-[#e24713] mb-4">
          Informations du livreur
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p>
              <strong>Nom :</strong> {driver.full_name}
            </p>
            <p>
              <strong>Téléphone :</strong> {driver.phone}
            </p>
          </div>
          <div>
            <p>
              <strong>Email :</strong> {driver.email}
            </p>
            <p>
              <strong>Adresse :</strong> {driver.principal_adresse}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="max-w-4xl mx-auto px-4 pt-8 pb-16">
      <h1 className="text-3xl font-extrabold text-center text-[#e24713] mb-5">
        Suivi de commande
      </h1>

      <div className="bg-white rounded-2xl shadow-md p-6 space-y-8">
        {/* Sélection */}
        <div className={'hidden'}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sélectionnez une commande
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#e24713] focus:border-[#e24713] outline-none"
            value={selectedOrder ? selectedOrder.uid : ""}
            onChange={(e) => handleSelectOrder(e.target.value)}
          >
            <option value="" disabled>
              Sélectionnez une commande...
            </option>
            {orders.map((order) => (
              <option key={order?.uid} value={order?.uid}>
                Commande #{order?.reference} - {order?.global_price || "0"}{" "}
                {currency}
              </option>
            ))}
          </select>
        </div>

        {/* Infos commande */}

        {
          orders?.map((items,key)=>(
              <div className="space-y-6" key={key}>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h2 className="text-2xl font-semibold text-[#e24713] mb-4">
                    Commande #{items.reference}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      <p>
                        <strong>Date :</strong>{" "}
                        {new Date(items.accepted_at).toLocaleDateString(
                            "fr-FR"
                        )}
                      </p>
                      <p>
                        <strong>Total :</strong>{" "}
                        {items.global_price}
                        {currency}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Adresse :</strong>{" "}
                        {items?.address_delivery}
                      </p>
                      <p>
                        <strong>Statut :</strong> {items.status.name}
                      </p>
                    </div>
                  </div>
                </div>

                {renderStatusMessage(items)}
                {renderDriverInfo(items)}

                {/* Liste des produits */}
                <div className="bg-white border rounded-xl">
                  <h3 className="px-6 py-4 bg-gray-100 text-lg font-semibold text-[#e24713] border-b">
                    Plats Commandés
                  </h3>
                  <ul className="divide-y divide-gray-200">
                    {items.products?.map((item, index) => (
                        <li key={index} className="p-6 hover:bg-gray-50">
                          <div className="flex flex-col md:flex-row gap-4">
                            <img
                                src={item?.product?.picture}
                                alt={item?.product?.title}
                                className="w-24 h-24 object-cover rounded-xl"
                            />
                            <div className="flex-1">
                              <h4 className="text-lg font-medium text-gray-800">
                                {item?.product?.title}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">
                                {item?.product?.description}
                              </p>
                            </div>
                            <div className="md:text-right text-sm text-gray-700">
                              <p>
                                {item.quantity} × {item.price} {currency}
                              </p>
                              <p className="font-semibold mt-1">
                                Total : {(item.quantity * item.price).toFixed(2)}{" "}
                                {currency}
                              </p>
                            </div>
                          </div>
                        </li>
                    ))}
                  </ul>
                </div>

                <hr className={"mb-4 mt-3"} />
              </div>
          ))
        }


      </div>
    </section>
  );
}
