import React, { useEffect, useState, useCallback } from "react";
import DeliveryLayout from "../../components/delivery/DeliveryLayout";
import OrderCard from "../../components/delivery/OrderCard";
import { getDeliveryOrders, updateOrderStatus } from "../../services/deliveryApi";

const DeliveryDashboard = () => {

    const [orders, setOrders] = useState([]);

    // fetch orders
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

    // update status
    const handleDeliver = async (id) => {
        try {
            await updateOrderStatus(id); // ✅ FIXED (removed extra param)
            fetchOrders();
        } catch (err) {
            console.error("Error updating status", err);
        }
    };

    // stats
    const total = orders.length;
    const active = orders.filter(o => o.status === "OUT_FOR_DELIVERY").length;
    const delivered = orders.filter(o => o.status === "DELIVERED").length;

    return (
        <DeliveryLayout>

            {/* HERO */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">
                    Welcome back👋
                </h1>
                <p className="text-gray-500">
                    You have <span className="text-purple-600 font-semibold">{active} active deliveries</span>
                </p>
            </div>

            {/* STATS */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">

                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                    <p className="text-gray-500 text-sm">Total Assigned</p>
                    <h2 className="text-2xl font-bold">{total} Orders</h2>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                    <p className="text-gray-500 text-sm">In Progress</p>
                    <h2 className="text-2xl font-bold text-cyan-500">{active} Orders</h2>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                    <p className="text-gray-500 text-sm">Delivered</p>
                    <h2 className="text-2xl font-bold text-green-500">{delivered} Orders</h2>
                </div>

            </div>

            {/* ORDERS */}
            <div className="bg-white rounded-3xl p-6 shadow-md">

                <div className="flex justify-between mb-6 flex-wrap gap-4">
                    <h3 className="text-xl font-bold">Your Delivery Queue</h3>

                    <input
                        placeholder="Search Order ID..."
                        className="border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-purple-300"
                    />
                </div>

                {/* ORDER LIST */}
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">

                    {orders.length === 0 ? (
                        <p className="text-gray-500">No orders assigned</p>
                    ) : (
                        orders.map((order) => (
                            <OrderCard
                                key={order.orderId}
                                order={{
                                    id: order.orderId,
                                    name: order.items?.[0]?.productName || "Customer",
                                    address: "Address not available",
                                    phone: "N/A",
                                    status: order.status
                                }}
                                onDeliver={handleDeliver}
                            />
                        ))
                    )}

                </div>

            </div>

        </DeliveryLayout>
    );
};

export default DeliveryDashboard;