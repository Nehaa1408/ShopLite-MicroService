import React, { useEffect, useState } from "react";
import DeliveryLayout from "../../components/delivery/DeliveryLayout";
import OrderCard from "../../components/delivery/OrderCard";
import { getDeliveryOrders, updateOrderStatus } from "../../services/deliveryApi";

const Active = () => {

    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const res = await getDeliveryOrders();
            console.log("ACTIVE RESPONSE:", res);
            // filter only OUT_FOR_DELIVERY
            const activeOrders = res.data.filter(
                (o) => o.status === "OUT_FOR_DELIVERY"
            );

            setOrders(activeOrders);
        } catch (err) {
            console.error("Error fetching active orders", err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleDeliver = async (id) => {
        try {
            await updateOrderStatus(id, "DELIVERED");
            fetchOrders();
        } catch (err) {
            console.error("Error updating status", err);
        }
    };

    return (
        <DeliveryLayout>

            <div className="p-6">

                <h1 className="text-2xl font-bold mb-6">Active Deliveries</h1>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                    {orders.map((order) => (
                        <div
                            key={order.orderId}
                            className="group bg-white/60 backdrop-blur-xl border border-transparent 
    rounded-2xl p-5 transition-all duration-300
    hover:border-indigo-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                        >

                            {/* Top Row */}
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-indigo-500 font-semibold text-sm">
                                    #{order.orderId}
                                </span>

                                <span className="text-orange-500 text-xs font-medium bg-orange-100 px-3 py-1 rounded-full">
                                    ● Out for Delivery
                                </span>
                            </div>

                            {/* Name */}
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {order.items?.[0]?.productName || "Customer"}
                            </h3>

                            {/* Address */}
                            <p className="text-sm text-gray-500 mb-4">
                                {order.shippingAddress || "Address not available"}
                            </p>

                            {/* Action Button */}
                            <button
                                onClick={() => handleDeliver(order.orderId)}
                                className="w-full mt-2 py-2 rounded-xl text-sm font-medium
      bg-gradient-to-r from-indigo-200 to-purple-200 text-indigo-700
      hover:shadow-[0_0_12px_rgba(99,102,241,0.25)] transition"
                            >
                                Mark as Delivered
                            </button>

                        </div>
                    ))}

                </div>

            </div>

        </DeliveryLayout>
    );
};

export default Active;