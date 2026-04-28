import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
const steps = [
  { key: "placed", label: "Order Placed", icon: "inventory_2" },
  { key: "packed", label: "Packed", icon: "package_2" },
  { key: "shipped", label: "Out for Delivery", icon: "local_shipping" },
  { key: "delivered", label: "Delivered", icon: "check_circle" },
];

const OrderTracking = () => {
  const { clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state;
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.04;
  const total = subtotal + tax;

  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
                  width: `${(statusIndex / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* STEPS */}
            {steps.map((step, index) => {
              const isCompleted = index < statusIndex;
              const isActive = index === statusIndex;

              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center gap-3 relative z-10"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${isCompleted
                      ? "bg-primary text-white"
                      : isActive
                        ? "border-2 border-primary text-primary bg-white"
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
