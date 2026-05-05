import React, { useEffect, useState } from "react";
import DeliveryLayout from "../../components/delivery/DeliveryLayout";
import OrderCard from "../../components/delivery/OrderCard";
import { getCompletedOrders } from "../../services/deliveryApi";

const Completed = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await getCompletedOrders();

      console.log("COMPLETED:", res);

      setOrders(Array.isArray(res) ? res : []);

    } catch (err) {
      console.error("Error fetching completed orders", err);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const todayCount = orders.filter((o) => {
    if (!o.orderDate) return false;

    const today = new Date();
    const orderDate = new Date(o.orderDate);

    return (
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    );
  }).length;

  return (
    <DeliveryLayout>

      <div className="p-6">

        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
            Completed Deliveries
          </h2>

          <p className="text-gray-500 mt-2">
            Track and manage all your successful deliveries with clarity
          </p>
        </div>
        <div className="flex justify-end mb-6">
          <div className="backdrop-blur-lg bg-white/60 border border-white/30 shadow-lg px-5 py-3 rounded-2xl text-sm font-medium text-blue-600">
            ✨ {orders.length} deliveries completed today
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {orders.map((order) => (
            <div
              key={order.orderId}
              className="relative backdrop-blur-xl bg-white/70 border border-white/30 rounded-2xl p-5 shadow-md transition-all duration-300 
      hover:-translate-y-1 
      hover:shadow-[0_10px_40px_rgba(59,130,246,0.25)]"
            >

              {/* ✅ Glow strip INSIDE card */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-t-2xl shadow-[0_0_10px_rgba(168,85,247,0.6)]"></div>

              {/* Top Row */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-500 font-semibold text-sm">
                  #{order.orderId}
                </span>

                <span className="px-3 py-1 text-xs rounded-full font-semibold bg-green-500/10 text-green-600 border border-green-200">
                  ● Delivered
                </span>
              </div>

              {/* Name */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {order.items?.[0]?.productName || "Customer"}
              </h3>

              {/* Address */}
              <div className="flex items-start gap-2 text-gray-500 text-sm mb-2">
                <span className="material-symbols-outlined text-base text-blue-500">
                  location_on
                </span>
                <p>{order.shippingAddress || "Address not available"}</p>
              </div>

              {/* Time */}
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                <span className="material-symbols-outlined text-base text-purple-500">
                  schedule
                </span>

                <p>
                  Delivered on{" "}
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                    : "N/A"}{" "}
                  at{" "}
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    : "--:--"}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-4">

                <button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl py-2 text-sm font-medium shadow-md hover:shadow-lg hover:scale-[1.03] transition">
                  View Receipt
                </button>

                <button className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl py-2 text-sm font-medium shadow-md cursor-default">
                  ✓ Completed
                </button>

              </div>
            </div>
          ))}

        </div>
        {orders.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            No completed deliveries yet
          </div>
        )}
      </div>

    </DeliveryLayout>
  );
};

export default Completed;