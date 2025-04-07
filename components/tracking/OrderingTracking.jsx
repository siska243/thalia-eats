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

  const renderStatusMessage = () => {
    if (!selectedOrder) return null;

    return (
      <div className="mb-6">
        <div
          className={`p-4 rounded-lg ${
            selectedOrder.accepted_at
              ? "bg-blue-100 border-l-4 border-blue-500"
              : "bg-yellow-100 border-l-4 border-yellow-500"
          }`}
        >
          <p
            className={`font-medium ${
              selectedOrder.accepted_at ? "text-blue-700" : "text-yellow-700"
            }`}
          >
            {selectedOrder.accepted_at
              ? "✅ Commande en cours de préparation"
              : "🕒 En attente de confirmation"}
          </p>
        </div>

        {selectedOrder.delivery_at && selectedOrder.delivrery_driver_id && (
          <div className="mt-4 p-4 bg-green-100 border-l-4 border-green-500 rounded-lg">
            <p className="text-green-700 font-medium">
              🚚 En cours de livraison
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderDriverInfo = () => {
    if (!selectedOrder?.delivrery_driver_id) return null;

    const driver = selectedOrder.delivrery_driver_id.user;

    return (
      <div className="mt-6 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-primaryColor">
          Informations du livreur
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    <section className="max-w-[900px] mx-auto px-4 pb-10 pt-5">
      <h1 className="text-3xl font-extrabold text-center mb-8 text-primaryColor">
        Suivi de commande
      </h1>

      <div className="rounded-xl shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] p-6 bg-primaryColor">
        {/* Sélection de commande */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-secondaryColor mb-2">
            Sélectionnez une commande
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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

        {selectedOrder && (
          <div className="space-y-6">
            {/* En-tête de commande */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-primaryColor mb-4">
                Commande #{selectedOrder.reference}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700">
                    <strong>Date :</strong>{" "}
                    {new Date(selectedOrder.accepted_at).toLocaleDateString(
                      "fr-FR"
                    )}
                  </p>
                  <p className="text-gray-600">
                    <strong>Total :</strong> {selectedOrder.global_price}
                    {currency}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <strong>Adresse :</strong> {selectedOrder?.address_delivery}
                  </p>
                  <p className="text-gray-600">
                    <strong>Statut :</strong> {selectedOrder.status.name}
                  </p>
                </div>
              </div>
            </div>

            {renderStatusMessage()}
            {renderDriverInfo()}

            {/* Liste des produits */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <h3 className="px-6 py-4 bg-gray-50 text-lg font-semibold border-b text-primaryColor">
                Plats Commandés
              </h3>

              <ul className="divide-y divide-gray-200">
                {selectedOrder.products?.map((item, index) => (
                  <li key={index} className="p-6 hover:bg-gray-50">
                    <div className="flex flex-col md:flex-row gap-4">
                      <img
                        src={item?.product?.picture}
                        alt={item?.product?.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-green-700">
                          {item?.product?.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {item?.product?.description}
                        </p>
                      </div>
                      <div className="md:text-right">
                        <p className="text-gray-600">
                          {item.quantity} x {item.price} {currency}
                        </p>
                        <p className="font-medium text-gray-800 mt-1">
                          Total : {(item.quantity * item.price).toFixed(2)}{" "}
                          {currency}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
