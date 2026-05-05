import React from "react";

const OrderCard = ({ order, onDeliver }) => {
  return (
    <div className="group p-6 rounded-2xl bg-white/70 backdrop-blur-md 
border border-white/40 shadow-md 
transition-all duration-300 
hover:shadow-[0_0_30px_rgba(244,114,182,0.25)] 
hover:border-pink-200">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-gray-800">{order.name}</h4>

        <span className={`text-xs px-3 py-1 rounded-full font-medium 
      ${order.status === "DELIVERED"
            ? "bg-green-100 text-green-600"
            : "bg-orange-100 text-orange-600"
          }`}>
          {order.status.replaceAll("_", " ")}
        </span>
      </div>

      <p className="text-xs text-gray-400 mb-2">#{order.id}</p>

      {/* ADDRESS */}
      <p className="text-sm text-gray-600">{order.address}</p>

      {/* PHONE */}
      <p className="text-sm text-blue-500 mt-2">{order.phone}</p>

      {/* PROGRESS BAR (fake but premium look) */}
      <div className="mt-4 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-pink-400 to-purple-400 w-[70%]"></div>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-3 mt-5">

        <button className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
          Navigate
        </button>

        <button
          onClick={() => onDeliver(order.id)}
          className="flex-1 py-2 rounded-lg text-white 
      bg-gradient-to-r from-emerald-400 to-green-500 
      hover:shadow-lg transition"
        >
          Mark Delivered
        </button>

      </div>

    </div>
  );
};

export default OrderCard;