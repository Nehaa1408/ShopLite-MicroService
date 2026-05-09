import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import axios from "axios";
const steps = [
  {
    key: "PLACED",
    label: "Order Placed",
    icon: "inventory_2",
  },

  {
    key: "PACKED",
    label: "Packed",
    icon: "package_2",
  },

  {
    key: "OUT_FOR_DELIVERY",
    label: "Out for Delivery",
    icon: "local_shipping",
  },

  {
    key: "DELIVERED",
    label: "Delivered",
    icon: "check_circle",
  },
];
const OrderTracking = () => {
  const { clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const initialOrder = location.state;

  const [order, setOrder] = useState(initialOrder);


  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.04;
  const total = subtotal + tax;

  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {

    // ORDER JUST PLACED
    if (order.status === "PLACED") {

      setStatusIndex(0);

      const timer = setTimeout(() => {
        setStatusIndex(1);
      }, 4000);

      return () => clearTimeout(timer);
    }

    // PACKED
    if (order.status === "PACKED") {
      setStatusIndex(2);
    }

    // OUT FOR DELIVERY
    if (order.status === "OUT_FOR_DELIVERY") {
      setStatusIndex(2);
    }

    // DELIVERED
    if (order.status === "DELIVERED") {
      setStatusIndex(3);
    }

  }, [order.status]);

  console.log("STATUS:", order.status);
  console.log("STATUS INDEX:", statusIndex);

  useEffect(() => {

    // STOP POLLING AFTER DELIVERY
    if (order.status === "DELIVERED") {
      return;
    }

    const interval = setInterval(async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:8080/api/orders/${order.orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrder(res.data);

      } catch (err) {
        console.error("Tracking refresh failed", err);
      }

    }, 1000);
    return () => clearInterval(interval);

  }, [order.orderId, order.status]);

  if (!order || order.items.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg font-bold">
          No order found. Please place an order first.
        </p>
      </div>
    );
  }
  return (
    <div className="bg-surface min-h-screen text-on-surface">
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow px-6 py-4 flex justify-between">
        <h1 className="text-xl font-bold text-primary">ShopLite</h1>

        <span className="material-symbols-outlined cursor-pointer">
          account_circle
        </span>
      </header>

      {/* MAIN */}
      <main className="pt-24 pb-20 px-6 max-w-4xl mx-auto">
        {/* TITLE */}
        <div className="flex justify-between mb-10">
          <div>
            <h1 className="text-3xl font-extrabold mb-2">Track Your Journey</h1>
            <p className="text-on-surface-variant">
              Order <span className="text-primary font-bold">#{order.orderId}</span>{" "}
              is making its way to you.
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs font-bold uppercase text-gray-500">
              Order Placed
            </p>
            <p className="font-bold">{order.orderDate}</p>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow mb-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">
                Total Amount
              </p>
              <p className="text-3xl font-extrabold text-primary">
                ${total.toFixed(2)}
              </p>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-[#f2efff] p-4 rounded-xl flex gap-4 items-center">
                <span className="material-symbols-outlined text-primary">
                  local_shipping
                </span>

                <div>
                  <p className="font-semibold">Estimated Delivery</p>
                  <p className="text-xs text-gray-500">Expected in 3–5 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TRACKING */}
        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow mb-8">
          <h2 className="text-xl font-bold mb-10">Shipping Progress</h2>

          <div className="relative flex justify-between">
            {/* LINE */}
            <div className="absolute top-6 left-0 w-full h-[2px] bg-gray-200">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{
                  width: `${statusIndex >= 0
                    ? ((statusIndex + 1) / steps.length) * 100
                    : 0
                    }%`,
                }}
              />
            </div>

            {/* STEPS */}
            {steps.map((step, index) => {
              const isCompleted = index <= statusIndex;
              const isActive = false;

              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center gap-3 relative z-10"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${isCompleted || isActive
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-400"
                      }`}
                  >
                    <span className="material-symbols-outlined">
                      {step.icon}
                    </span>
                  </div>

                  <p
                    className={`text-xs font-bold ${isActive ? "text-primary" : "text-gray-500"
                      }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ITEMS */}
        <div className="flex flex-col gap-4">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="glass-panel border p-5 rounded-2xl flex items-center gap-6 hover:shadow-md transition"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-container-low">
                <img src={
                  item.image?.startsWith("http")
                    ? item.image
                    : `/products/${item.image}`
                } className="w-full h-full object-cover" />
              </div>

              <div className="flex-grow">
                <h3 className="font-bold">{item.productName}</h3>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <div className="flex justify-center">
          <button
            onClick={async () => {
              await clearCart();
              navigate("/");
            }}
            className="px-8 py-4 border rounded-xl text-primary font-bold flex gap-2"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Continue Shopping
          </button>
        </div>
      </main>
    </div>
  );
};

export default OrderTracking;
