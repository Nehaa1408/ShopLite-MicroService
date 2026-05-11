import React, { memo } from "react";
import { calculateOrderTotal } from "../../utils/orderPricing";

const OrderCard = ({
  order,
  onSendOtp,
  onConfirmCod,
  onUnableToDeliver
}) => {

  const items = order.items || [];

  const { total } = calculateOrderTotal(items);

  const isReturnPickup =
    order.flowType === "RETURN_PICKUP";

  const isDeliveryFlow =
    order.flowType === "DELIVERY";

  const isCod =
    isDeliveryFlow &&
    order.paymentMethod === "COD";

  const codPending =
    isCod &&
    order.paymentStatus === "COD_PENDING";

  const paymentDone =
    order.paymentStatus === "SUCCESS";

  // IMAGE PATH FIX
  const getImage = (img) => {

    if (!img) {
      return "/products/placeholder.webp";
    }

    if (img.startsWith("http")) {
      return img;
    }

    const cleanImage = img.replace(/^\/+/, "");

    return `/products/${cleanImage}`;
  };

  return (

    <div
      className="group relative overflow-hidden

      bg-white/72

      backdrop-blur-xl

      border border-white/60

      rounded-[30px]

      p-5

      transition-all duration-500

      hover:-translate-y-[4px]

      hover:scale-[1.01]

      hover:bg-white/80

      hover:shadow-[0_30px_80px_rgba(15,23,42,0.08)]"
    >

      {/* INNER PREMIUM BORDER */}
      <div
        className="absolute inset-0 rounded-[30px]

        border border-white/40

        pointer-events-none"
      />

      {/* AMBIENT GLOW */}
      <div
        className="absolute top-[-80px] right-[-80px]

        w-[180px] h-[180px]

        bg-indigo-100/20

        rounded-full

        blur-3xl"
      />

      {/* IMAGES */}
      <div className="flex items-center -space-x-3 mb-5">

        {items.slice(0, 3).map((item, i) => (

          <div
            key={i}
            className="relative z-10"
          >

            <img
              src={getImage(item.image)}
              alt={item.productName}
              onError={(e) => {
                e.target.src = "/products/placeholder.webp";
              }}
              className="w-[58px] h-[58px]

              rounded-[18px]

              object-cover

              border-4 border-white

              shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
            />

          </div>

        ))}

      </div>

      {/* PRODUCT NAME */}
      <h2
        className="text-[20px]

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

        <p className="text-[30px] font-bold tracking-tight text-indigo-600">
          ${total.toFixed(2)}
        </p>

        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />

        <p className="text-sm text-gray-500 font-medium">
          {items.length} item{items.length > 1 ? "s" : ""}
        </p>

      </div>

      {/* PAYMENT STATUS */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">

        {/* PAYMENT METHOD */}
        <div
          className={`px-4 h-9 rounded-full border flex items-center gap-2

    ${isCod
              ? `
          bg-amber-50
          border-amber-100
        `
              : `
          bg-emerald-50
          border-emerald-100
        `
            }`}
        >

          <div
            className={`w-2 h-2 rounded-full

      ${isCod
                ? "bg-amber-400"
                : "bg-emerald-400"
              }`}
          />

          <span
            className={`text-[11px] font-bold tracking-wide

      ${isCod
                ? "text-amber-600"
                : "text-emerald-600"
              }`}
          >

            {isCod && paymentDone
              ? "COD PAID"
              : isCod
                ? "COD"
                : "PAYMENT DONE"}

          </span>

        </div>

        {/* PAYMENT STATUS */}
        <div
          className={`px-4 h-9 rounded-full border flex items-center gap-2

    ${paymentDone
              ? `
          bg-emerald-50
          border-emerald-100
        `
              : `
          bg-rose-50
          border-rose-100
        `
            }`}
        >

          <div
            className={`w-2 h-2 rounded-full animate-pulse

      ${paymentDone
                ? "bg-emerald-400"
                : "bg-rose-400"
              }`}
          />

          <span
            className={`text-[11px] font-bold tracking-wide

      ${paymentDone
                ? "text-emerald-600"
                : "text-rose-600"
              }`}
          >

            {paymentDone
              ? "VERIFIED"
              : "PENDING"}

          </span>

        </div>

      </div>

      {/* STATUS + ETA */}
      <div className="flex items-center justify-between mb-4">

        {/* STATUS */}
        <div
          className={`inline-flex items-center gap-2

          px-4 h-9

          rounded-full

          border

          ${order.status === "DELIVERED"
              ? `
                bg-emerald-50
                border-emerald-100
              `
              : `
                bg-orange-50
                border-orange-100
              `
            }`}
        >

          <div
            className={`w-2 h-2 rounded-full animate-pulse

            ${order.status === "DELIVERED"
                ? "bg-emerald-400"
                : "bg-orange-400"
              }`}
          />

          <span
            className={`text-[11px] font-bold tracking-wide

            ${order.status === "DELIVERED"
                ? "text-emerald-500"
                : "text-orange-500"
              }`}
          >

            {order.status.replaceAll("_", " ")}

          </span>

        </div>

        {/* ETA */}
        <div className="flex items-center gap-1.5 text-gray-500">

          <span className="material-symbols-outlined text-[18px]">
            schedule
          </span>

          <span className="text-sm font-medium">
            ETA 15 mins
          </span>

        </div>

      </div>

      {/* ADDRESS */}
      <div className="flex items-start gap-3 mb-6">

        <div
          className="w-10 h-10 rounded-2xl

          bg-indigo-50

          flex items-center justify-center

          shrink-0"
        >

          <span className="material-symbols-outlined text-indigo-500 text-[20px]">
            location_on
          </span>

        </div>

        <div>

          <p
            className="text-[11px]

            uppercase

            tracking-[0.15em]

            text-gray-400

            mb-1"
          >
            Delivery Address
          </p>

          <p className="text-sm text-gray-600 leading-relaxed">
            {order.shippingAddress || "Address not available"}
          </p>

        </div>

      </div>

      {/* BUTTONS */}
      <div className="flex flex-col gap-3">

        {/* TOP BUTTONS */}
        <div className="flex gap-3">

          {/* NAVIGATE */}
          <button
            className="group relative overflow-hidden

            flex-1 h-[54px]

            rounded-2xl

            bg-white/95

            border border-cyan-100

            text-gray-700 text-sm font-semibold

            shadow-[0_10px_30px_rgba(6,182,212,0.10)]

            hover:-translate-y-[2px]

            hover:border-cyan-200

            hover:shadow-[0_16px_40px_rgba(6,182,212,0.18)]

            active:scale-[0.98]

            transition-all duration-300"
          >

            {/* EDGE LIGHT */}
            <div
              className="absolute inset-0 rounded-2xl

              border border-cyan-300/0

              group-hover:border-cyan-300/40

              transition-all duration-300"
            />

            {/* MOVING LIGHT */}
            <div
              className="absolute inset-0

              opacity-0 group-hover:opacity-100

              bg-[linear-gradient(120deg,transparent,rgba(34,211,238,0.14),transparent)]

              translate-x-[-120%]

              group-hover:translate-x-[120%]

              transition-all duration-1000"
            />

            <span
              className="relative z-10

              flex items-center justify-center gap-2"
            >

              <span
                className="material-symbols-outlined

                text-[18px]

                text-cyan-500

                group-hover:scale-110

                transition-transform duration-300"
              >
                navigation
              </span>

              Navigate

            </span>

          </button>

          {/* REACHED DESTINATION */}
          <button
            disabled={isCod && codPending}
            onClick={() =>
              onSendOtp(
                order.flowType === "RETURN_PICKUP"
                  ? order.returnId
                  : order.orderId,
                order.flowType
              )
            }
            className="group relative overflow-hidden

            flex-1 h-[54px]

            rounded-2xl

            bg-white/95

            border border-indigo-100

            text-gray-700 text-sm font-semibold

            shadow-[0_10px_30px_rgba(99,102,241,0.10)]

            hover:-translate-y-[2px]

            hover:border-indigo-200

            hover:shadow-[0_16px_42px_rgba(99,102,241,0.20)]

            active:scale-[0.98]
            transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >

            {/* EDGE LIGHT */}
            <div
              className="absolute inset-0 rounded-2xl

              border border-indigo-300/0

              group-hover:border-indigo-300/40

              transition-all duration-300"
            />

            {/* MOVING LIGHT */}
            <div
              className="absolute inset-0

              opacity-0 group-hover:opacity-100

              bg-[linear-gradient(120deg,transparent,rgba(99,102,241,0.14),transparent)]

              translate-x-[-120%]

              group-hover:translate-x-[120%]

              transition-all duration-1000"
            />

            <span
              className="relative z-10

              flex items-center justify-center gap-2"
            >

              <span
                className="material-symbols-outlined

                text-[18px]

                text-indigo-500

                group-hover:scale-110

                transition-transform duration-300"
              >
                verified
              </span>

              {isReturnPickup
                ? "Reached Pickup"
                : codPending
                  ? "Collect COD First"
                  : "Reached Destination"}

            </span>

          </button>

        </div>

        {/* COD PAYMENT BUTTON */}
        {
          isCod && codPending && (

            <button
              onClick={() => onConfirmCod?.(order.orderId)}
              className="group relative overflow-hidden

      w-full h-[54px]

      rounded-2xl

      bg-gradient-to-br
      from-emerald-500
      to-green-500

      text-white text-sm font-semibold

      shadow-[0_14px_34px_rgba(34,197,94,0.24)]

      hover:-translate-y-[2px]

      active:scale-[0.98]

      transition-all duration-300"
            >

              <span
                className="relative z-10

        flex items-center justify-center gap-2"
              >

                <span className="material-symbols-outlined text-[18px]">
                  payments
                </span>

                COD Completed

              </span>

            </button>
          )
        }

        {/* UNABLE BUTTON */}
        <button
          onClick={() => onUnableToDeliver(order.orderId)}
          className="group relative overflow-hidden

          w-full h-[52px]

          rounded-2xl

          bg-white/95

          border border-red-100

          text-red-500 text-sm font-semibold

          shadow-[0_10px_28px_rgba(239,68,68,0.08)]

          hover:-translate-y-[1px]

          hover:border-red-200

          hover:shadow-[0_14px_34px_rgba(239,68,68,0.14)]

          active:scale-[0.99]

          transition-all duration-300"
        >

          {/* EDGE LIGHT */}
          <div
            className="absolute inset-0 rounded-2xl

            border border-red-300/0

            group-hover:border-red-300/40

            transition-all duration-300"
          />

          {/* MOVING LIGHT */}
          <div
            className="absolute inset-0

            opacity-0 group-hover:opacity-100

            bg-[linear-gradient(120deg,transparent,rgba(248,113,113,0.12),transparent)]

            translate-x-[-120%]

            group-hover:translate-x-[120%]

            transition-all duration-1000"
          />

          <span
            className="relative z-10

            flex items-center justify-center gap-2"
          >

            <span
              className="material-symbols-outlined

              text-[18px]

              group-hover:scale-110

              transition-transform duration-300"
            >
              warning
            </span>

            Unable to Deliver

          </span>

        </button>

      </div>

    </div>
  );
};

export default React.memo(OrderCard);