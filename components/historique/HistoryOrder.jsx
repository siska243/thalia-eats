"use client";
import React, {useState} from "react";
import {ActionIcon, Badge, Button, Modal, Table, Title} from "rizzui";
import {XMarkIcon} from "@heroicons/react/20/solid";
import {setCurrentOrder} from "@/store/reducers/cartSlice";

export default function HistoryOrder({data}) {

    const [modalState, setModalState] = useState(false);
    const orders = Array.isArray(data) ? data : [data];
    const currency = orders[0]?.products[0]?.currency?.code || "€";
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleSelectOrder = (orderId) => {
        const order = orders.find((order) => order.uid === orderId);
        setSelectedOrder(order);
    };


    return (
        <section className="max-w-4xl mx-auto px-4 pt-8 pb-16">
            <h1 className="text-3xl font-extrabold text-center text-[#e24713] mb-10">
                Historique des Commandes
            </h1>

            <div className="bg-white rounded-2xl shadow-md p-6 space-y-8">
                {/* Sélection */}
                <div className={'hidden'}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sélectionnez une commande
                    </label>
                    <select
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#e24713] focus:border-[#e24713] text-base outline-none"
                        value={selectedOrder ? selectedOrder?.uid : ""}
                        onChange={(e) => handleSelectOrder(e.target.value)}
                    >
                        <option value="" disabled>
                            Sélectionnez une commande...
                        </option>
                        {orders.map((order) => (
                            <option key={order.uid} value={order.uid}>
                                Commande #{order.reference} - {order.global_price} {currency}
                            </option>
                        ))}
                    </select>
                </div>

                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.Head>N° commande</Table.Head>
                            <Table.Head>Date</Table.Head>
                            <Table.Head>Adresse de livraison</Table.Head>
                            <Table.Head>Total commande</Table.Head>
                            <Table.Head>Status</Table.Head>
                            <Table.Head></Table.Head>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            orders?.map((item, key) => (
                                <Table.Row key={key}>
                                    <Table.Cell>#{item.reference}</Table.Cell>
                                    <Table.Cell> {new Date(item.date_time_restautant).toLocaleDateString("fr-FR")}</Table.Cell>
                                    <Table.Cell>{item.user_delivery_complet_adress}</Table.Cell>
                                    <Table.Cell><p>{item.global_price} {currency}</p></Table.Cell>
                                    <Table.Cell>
                                        <Badge>
                                            <div className={'flex gap-2 items-center'}>
                                                <p dangerouslySetInnerHTML={{__html: item.status?.render}}></p>
                                                <p>{item.status.name}</p>
                                            </div>

                                        </Badge>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <Button onClick={() => {
                                            setSelectedOrder(item)
                                            setModalState(true)
                                        }}>Detail</Button>
                                    </Table.Cell>

                                </Table.Row>
                            ))
                        }


                    </Table.Body>
                </Table>
            </div>


            <Modal isOpen={modalState} size={"xxl"} onClose={() => {
              setCurrentOrder(null)
              setModalState(false)
            }}>
                <div className="pt-6 pb-8 bg-white w-full p-4 z-[999999] max-h-96 overflow-auto rounded-md">
                    <div className="mb-7 flex items-center justify-between">
                        <Title as="h3"># {selectedOrder?.reference}</Title>
                        <ActionIcon
                            size="sm"
                            variant="text"
                            onClick={() => {
                                setCurrentOrder(null)
                                setModalState(false)
                            }}
                        >
                            <XMarkIcon className="h-auto w-6" strokeWidth={1.8}/>
                        </ActionIcon>
                    </div>
                    <div className="w-full gap-y-6 gap-x-5 [&_label>span]:font-medium">
                      {selectedOrder &&
                        <div className="space-y-6">
                            {/* Infos commande */}
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h2 className="text-2xl font-semibold text-[#e24713] mb-4">
                                    Commande #{selectedOrder.reference}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                                    <div>
                                        <p>
                                            <strong>Date :</strong>{" "}
                                            {new Date(selectedOrder.date_time_restautant).toLocaleDateString("fr-FR")}
                                        </p>
                                        <p>
                                            <strong>Total :</strong> {selectedOrder?.global_price} {currency}
                                        </p>
                                    </div>
                                    <div>
                                        <p>
                                            <strong>Adresse :</strong> {selectedOrder?.address_delivery}
                                        </p>
                                        <p>
                                            <strong>Ville :</strong> {selectedOrder.town_id?.title}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Section Statut */}
                            <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
                                <div className="flex flex-col  gap-4 text-sm">
                                    <p className="text-gray-700">
                                        <strong>Statut :</strong> {selectedOrder?.status?.name}
                                    </p>
                                    <div className={`p-3 rounded-lg font-medium ${
                                        selectedOrder.cancel_at
                                            ? "bg-red-100 text-red-700"
                                            : selectedOrder.accepted_at
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                    }`}>
                                        {selectedOrder.cancel_at
                                            ? "❌ Annulée le " + new Date(selectedOrder.cancel_at).toLocaleDateString("fr-FR")
                                            : selectedOrder.accepted_at
                                                ? "✅ Acceptée le " + new Date(selectedOrder.accepted_at).toLocaleDateString("fr-FR")
                                                : "🕒 En attente de confirmation"}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                    <strong>Référence de paiement :</strong> {selectedOrder.reference_paiement}
                                </p>
                            </div>

                            {/* Livreur */}
                            {selectedOrder?.delivrery_driver_id && (
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <h3 className="text-xl font-semibold text-[#e24713] mb-4">
                                        Informations du livreur
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                                        <div>
                                            <p><strong>Nom :</strong> {selectedOrder.delivrery_driver_id.user.full_name}
                                            </p>
                                            <p><strong>Téléphone
                                                :</strong> {selectedOrder.delivrery_driver_id.user.phone}</p>
                                            <p><strong>Email :</strong> {selectedOrder.delivrery_driver_id.user.email}
                                            </p>
                                        </div>
                                        <div>
                                            <p><strong>Adresse
                                                :</strong> {selectedOrder?.delivrery_driver_id?.user?.principal_adresse}
                                            </p>
                                            <p><strong>Carte ID :</strong> {selectedOrder?.delivrery_driver_id?.id_card}
                                            </p>
                                            <p><strong>Naissance
                                                :</strong> {new Date(selectedOrder?.delivrery_driver_id?.birth_date).toLocaleDateString("fr-FR")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Produits */}
                            <div className="bg-white border rounded-xl">
                                <h3 className="px-6 py-4 bg-gray-100 text-lg font-semibold text-[#e24713] border-b">
                                    Plats Commandés
                                </h3>
                                <ul className="divide-y divide-gray-200">
                                    {selectedOrder?.products?.map((item, index) => (
                                        <li key={index} className="p-6 hover:bg-gray-50">
                                            <div className="flex flex-col md:flex-row gap-4">
                                                <img
                                                    src={item.product.picture}
                                                    alt={item.product.title}
                                                    className="w-24 h-24 object-cover rounded-xl"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-medium text-gray-800">
                                                        {item.product.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {item.product.description}
                                                    </p>
                                                </div>
                                                <div className="md:text-right text-sm text-gray-700">
                                                    <p>
                                                        {item.quantity} × {item.price} {currency}
                                                    </p>
                                                    <p className="font-semibold mt-1">
                                                        Total : {(item.quantity * item.price).toFixed(2)} {currency}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Adresse complète */}
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h3 className="text-lg font-semibold text-[#e24713] mb-2">
                                    Adresse complète
                                </h3>
                                <p className="text-sm text-gray-700">
                                    {selectedOrder.user_delivery_complet_adress}
                                </p>
                            </div>
                        </div>
                      }
                    </div>
                </div>
            </Modal>

        </section>
    );
}