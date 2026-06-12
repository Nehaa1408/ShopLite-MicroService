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
          `${import.meta.env.VITE_API_URL}/api/orders/${order.orderId}`,
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
    <div className="min-h-screen bg-[#f6f3ee] text-gray-900">
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-extrabold text-primary cursor-pointer tracking-tight"
        >
          ShopLite
        </h1>

        <div
          onClick={() => navigate("/profile")}
          className="cursor-pointer"
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgcj9i-xOULjXbKX_gAzqP3OP_0GxiEBwAFPjURfiNHeiove_rW5LSqbTrLaXOika9GUOCug1BZDM4pjJcvgJpgo8VE0bUDHJ9Dt_Y4R3S1TSi0TYN7TlG1NcXEuq9uf3Tl5IBPZgZqD5ggbaqv6PNT9ZYyVBk4TdE4BnjEu7WExWjF3uUBPvu2Iux7I2JMHX1JdziVvAtvFh4QYmhYEdxx1Vw7E1AK6f5T5ielO_yR6BfQN0ZMpAV14dYZGKBl_iDL-juLNgde-c"
            className="w-11 h-11 rounded-full object-cover border-2 border-white shadow"
          />
        </div>
      </header>

      {/* MAIN */}
      <main className="pt-28 pb-20 px-4 max-w-5xl mx-auto">

        {/* TITLE */}
        <div className="bg-white rounded-[32px] px-8 py-7 shadow-sm border border-[#eee7df] mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          {/* LEFT */}
          <div>
            <p className="text-sm uppercase tracking-widest text-blue-600 font-bold mb-2">
              Live Order Tracking
            </p>

            <h1 className="text-4xl font-black text-gray-900 mb-2">
              Track Your Order
            </h1>

            <p className="text-gray-500 text-lg">
              Order{" "}
              <span className="font-bold text-blue-600">
                #{order.orderId}
              </span>{" "}
              is on the way to your doorstep.
            </p>
          </div>

          {/* RIGHT */}
          <div className="bg-[#f8f9ff] border border-blue-100 rounded-2xl px-6 py-4 min-w-[260px]">
            <p className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-1">
              ORDER PLACED
            </p>

            <p className="text-lg font-bold text-gray-900">
              {new Date(order.orderDate).toLocaleDateString()}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              {new Date(order.orderDate).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* ORDER CONTAINER */}
        <div className="bg-white border border-[#ece6de] rounded-[34px] shadow-sm overflow-hidden">

          {/* TOP */}
          <div className="p-8 border-b border-[#f1ece6]">

            <div className="grid lg:grid-cols-[1.5fr_0.9fr] gap-8">

              {/* PRODUCTS */}
              <div>

                <p className="text-sm uppercase tracking-widest text-blue-600 font-bold mb-5">
                  ORDER ITEMS
                </p>

                <div
                  className="space-y-4 max-h-[340px] overflow-y-auto pr-2"
                  style={{ scrollbarWidth: "thin" }}
                >

                  {order.items.map((item, index) => (

                    <div
                      key={index}
                      className="bg-[#faf9f7] border border-[#ece6de] rounded-3xl p-4 flex items-center gap-4 hover:shadow-md transition-all duration-300"
                    >

                      {/* IMAGE */}
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white flex-shrink-0">

                        <img
                          src={
                            item.image?.startsWith("http")
                              ? item.image
                              : `/products/${item.image}`
                          }
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* DETAILS */}
                      <div className="flex-grow">

                        <h2 className="text-lg font-black text-gray-900">
                          {item.productName}
                        </h2>

                        <p className="text-gray-500 text-sm mt-1">
                          Quantity: {item.quantity}
                        </p>

                        <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-2 rounded-xl">

                          <span className="material-symbols-outlined text-blue-600 text-[18px]">
                            local_shipping
                          </span>

                          <span className="text-sm font-semibold text-gray-700">
                            Delivery in 3–5 days
                          </span>
                        </div>
                      </div>

                      {/* PRICE */}
                      <div className="text-right">

                        <p className="text-xs uppercase text-gray-400 font-bold mb-1">
                          Total
                        </p>

                        <p className="text-xl font-black text-blue-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* PRICE CARD */}
              <div className="bg-[#faf9f7] rounded-3xl p-6 flex flex-col justify-center">

                <div className="flex justify-between items-center pb-4 border-b border-[#ebe6df]">
                  <span className="text-gray-500 font-medium">
                    Subtotal
                  </span>

                  <span className="font-bold text-lg">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-4 border-b border-[#ebe6df]">
                  <span className="text-gray-500 font-medium">
                    Tax
                  </span>

                  <span className="font-bold">
                    ${tax.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-5">

                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">
                      Total Amount
                    </p>

                    <p className="text-4xl font-black text-blue-600 mt-1">
                      ${total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TRACKING */}
          <div className="p-8">

            <div className="flex items-center justify-between mb-12">

              <div>
                <p className="text-sm uppercase tracking-widest text-blue-600 font-bold mb-2">
                  Shipping Progress
                </p>

                <h2 className="text-3xl font-black text-gray-900">
                  Order Tracking
                </h2>
              </div>

              <div className="hidden md:block text-right">
                <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">
                  CURRENT STATUS
                </p>

                <p className="text-lg font-bold text-blue-600 mt-1">
                  {order.status.replaceAll("_", " ")}
                </p>
              </div>
            </div>

            {/* TRACK LINE */}
            <div className="relative flex justify-between">

              {/* LINE */}
              <div className="absolute top-7 left-0 w-full h-[4px] bg-[#ebe7e1] rounded-full">

                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-700"
                  style={{
                    width: `${((statusIndex + 1) / steps.length) * 100}%`,
                  }}
                />
              </div>

              {/* STEPS */}
              {steps.map((step, index) => {

                const isCompleted = index <= statusIndex;

                return (
                  <div
                    key={step.key}
                    className="flex flex-col items-center relative z-10"
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-all duration-500 ${isCompleted
                        ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white"
                        : "bg-[#efefef] text-gray-400"
                        }`}
                    >
                      <span className="material-symbols-outlined">
                        {step.icon}
                      </span>
                    </div>

                    <p
                      className={`mt-4 text-sm font-bold ${isCompleted
                        ? "text-gray-900"
                        : "text-gray-400"
                        }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* BUTTON */}
            <div className="flex justify-center mt-16">

              <button
                onClick={async () => {
                  await clearCart();
                  navigate("/");
                }}
                className="group px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-bold flex items-center gap-3 shadow-lg hover:scale-105 transition-all duration-300"
              >
                <span className="material-symbols-outlined group-hover:-translate-x-1 transition">
                  arrow_back
                </span>

                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderTracking;
