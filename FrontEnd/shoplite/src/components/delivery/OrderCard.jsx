import React from "react";
import { calculateOrderTotal } from "../../utils/orderPricing";

const OrderCard = ({
  order,
  onSendOtp,
  onUnableToDeliver
}) => {

  const items = order.items || [];
const { total } = calculateOrderTotal(items);

  // IMAGE PATH FIX
  const getImage = (img) => {

    if (!img) {
      return "/products/placeholder.webp";
    }

    // if already full url
    if (img.startsWith("http")) {
      return img;
    }

    // remove extra slash if exists
    const cleanImage = img.replace(/^\/+/, "");

    return `/products/${cleanImage}`;
  };

  return (

    <div
      className="group

      bg-white/55 backdrop-blur-xl

      border border-white/50

      rounded-[26px]

      p-5

      transition-all duration-300

      hover:-translate-y-1
      hover:shadow-[0_10px_30px_rgba(99,102,241,0.08)]"
    >

      {/* IMAGES */}
      <div className="flex gap-3 mb-5">

        {items.slice(0, 3).map((item, i) => (

          <div
            key={i}
            className="relative"
          >

            <img
              src={getImage(item.image)}
              alt={item.productName}
              onError={(e) => {
                e.target.src = "/products/placeholder.webp";
              }}
              className="w-[68px] h-[68px]

              rounded-2xl

              object-cover

              bg-gray-100

              border border-gray-100

              shadow-sm"
            />

          </div>

        ))}

      </div>

      {/* PRODUCT NAME */}
      <h2
        className="text-[22px]
        font-bold
        text-gray-800

        leading-tight

        mb-2"
      >

        {items.length > 1
          ? `${items[0]?.productName} +${items.length - 1} more`
          : items[0]?.productName || "Order"}

      </h2>

      {/* PRICE */}
      <div className="flex items-center gap-3 mb-5">

        <p className="text-xl font-bold text-indigo-600">
          ${total.toFixed(2)}
        </p>

        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>

        <p className="text-sm text-gray-500 font-medium">
          {items.length} item{items.length > 1 ? "s" : ""}
        </p>

      </div>

      {/* STATUS */}
      <div className="flex items-center justify-between mb-5">

        <span
          className={`px-4 py-1.5 rounded-full

          text-[11px]
          font-semibold
          tracking-wide

          ${order.status === "DELIVERED"
              ? "bg-emerald-100 text-emerald-600"
              : "bg-orange-100 text-orange-600"
            }`}
        >

          {order.status.replaceAll("_", " ")}

        </span>

        <div className="flex items-center gap-1 text-gray-500">

          <span className="material-symbols-outlined text-[18px]">
            schedule
          </span>

          <span className="text-sm">
            ETA 15 mins
          </span>

        </div>

      </div>

      {/* ADDRESS */}
      <div className="flex items-start gap-3 mb-5">

        <div
          className="w-9 h-9 rounded-xl

          bg-indigo-50

          flex items-center justify-center"
        >

          <span className="material-symbols-outlined text-indigo-500 text-[20px]">
            location_on
          </span>

        </div>

        <div>

          <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
            Delivery Address
          </p>

          <p className="text-sm text-gray-600 leading-relaxed">
            {order.shippingAddress || "Address not available"}
          </p>

        </div>

      </div>

      {/* PROGRESS */}
      <div className="mb-5">

        <div className="flex justify-between text-[11px] text-gray-400 mb-2">

          <span>Picked</span>
          <span>On Route</span>
          <span>Delivered</span>

        </div>

        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">

          <div
            className="w-[72%] h-full rounded-full

            bg-gradient-to-r
            from-[#6366F1]
            to-[#7C83FF]"
          ></div>

        </div>

      </div>

      {/* BUTTONS */}
      <div className="flex flex-col gap-3">

        {/* TOP BUTTONS */}
        <div className="flex gap-3">

          {/* NAVIGATE */}
          <button
            className="flex-1 py-3 rounded-[22px]

    bg-gradient-to-br
    from-cyan-500/90
    via-sky-500/90
    to-blue-500/90

    backdrop-blur-xl

    border border-white/20

    text-white
    font-semibold

    shadow-[0_10px_28px_rgba(14,165,233,0.28)]

    hover:shadow-[0_14px_36px_rgba(14,165,233,0.38)]

    hover:brightness-110

    active:scale-[0.98]

    transition-all duration-300"
          >

            Navigate

          </button>


          {/* SEND OTP */}
          <button
            onClick={() => onSendOtp(order.orderId)}
            className="flex-1 py-3 rounded-[22px]

            bg-gradient-to-br
            from-[#7C83FF]
            via-[#6366F1]
            to-[#5B5FEF]

            text-white
            font-semibold

            border border-white/20

            shadow-[0_10px_30px_rgba(99,102,241,0.35)]

            hover:shadow-[0_14px_40px_rgba(99,102,241,0.45)]

            hover:brightness-110

            active:scale-[0.98]

            transition-all duration-300"
          >

            Reached Destination

          </button>

        </div>

        {/* UNABLE TO DELIVER */}
        <button
          onClick={() => onUnableToDeliver(order.orderId)}
          className="w-full py-3 rounded-[22px]

        bg-red-500/10 backdrop-blur-xl

        border border-red-200/40

        text-red-500
        font-semibold

        shadow-[0_8px_24px_rgba(239,68,68,0.12)]

        hover:bg-red-500/15
        hover:shadow-[0_12px_30px_rgba(239,68,68,0.18)]

        active:scale-[0.99]

        transition-all duration-300"
        >

          Unable to Deliver

        </button>

      </div>

    </div>
  );
};

export default OrderCard;