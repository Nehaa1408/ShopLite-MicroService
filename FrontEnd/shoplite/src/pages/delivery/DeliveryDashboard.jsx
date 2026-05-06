import React, { useEffect, useState, useCallback } from "react";
import DeliveryLayout from "../../components/delivery/DeliveryLayout";
import OrderCard from "../../components/delivery/OrderCard";
import { getDeliveryOrders, updateOrderStatus } from "../../services/deliveryApi";

const DeliveryDashboard = () => {

    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");

    const fetchOrders = useCallback(async () => {
        try {
            const res = await getDeliveryOrders();
            setOrders(Array.isArray(res) ? res : []);
        } catch (err) {
            console.error("Error fetching orders", err);
            setOrders([]);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleDeliver = async (id) => {
        try {
            await updateOrderStatus(id);
            fetchOrders();
        } catch (err) {
            console.error("Error updating status", err);
        }
    };

    const filteredOrders = orders.filter((o) =>
        o.orderId.toString().includes(search)
    );

    const active = orders.filter(o => o.status === "OUT_FOR_DELIVERY").length;

    return (
        <DeliveryLayout>

            {/* HERO */}
            <div className="mb-10">
                <h1 className="text-4xl font-bold mb-2">
                    Welcome back 👋
                </h1>
                <p className="text-gray-500">
                    You have <span className="text-purple-600 font-semibold">{active} active deliveries</span>
                </p>
            </div>

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">

                <h3 className="text-xl font-bold text-gray-800">
                    Active Deliveries
                </h3>

                <div className="relative w-full md:w-80">

                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        search
                    </span>

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search order ID..."
                        className="w-full pl-12 pr-4 py-3 rounded-2xl 
                        bg-white/70 backdrop-blur-lg border border-white/40
                        text-sm text-gray-700 outline-none
                        focus:ring-2 focus:ring-purple-300
                        hover:border-purple-200"
                    />
                </div>

            </div>

            {/* CARDS */}
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10">

                {filteredOrders.length === 0 ? (
                    <p className="text-gray-500">No matching orders</p>
                ) : (
                    filteredOrders.map((order) => (
                        <OrderCard
                            key={order.orderId}
                            order={order}
                            onDeliver={handleDeliver}
                        />
                    ))
                )}

            </div>

        </DeliveryLayout>
    );
};

export default DeliveryDashboard;