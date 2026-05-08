import React, { useEffect, useState } from "react";
import DeliveryLayout from "../../components/delivery/DeliveryLayout";
import { getCompletedOrders } from "../../services/deliveryApi";

const Completed = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {

    try {

      const res = await getCompletedOrders();

      setOrders(Array.isArray(res) ? res : []);

    } catch (err) {

      console.error("Error fetching completed orders", err);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // IMAGE FIX
  const getImage = (img) => {

    if (!img) {
      return "/products/placeholder.webp";
    }

    if (img.startsWith("http")) {
      return img;
    }

    return `/products/${img.replace(/^\/+/, "")}`;
  };

  return (

    <DeliveryLayout>

      <div className="p-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">

          <div>

            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Completed Deliveries
            </h1>

            <p className="text-gray-500">
              Track all successfully delivered orders
            </p>

          </div>

          <div
            className="bg-white/60 backdrop-blur-xl

            border border-white/50

            rounded-2xl

            px-5 py-3

            shadow-sm"
          >

            <p className="text-sm text-indigo-600 font-semibold">
              ✨ {orders.length} deliveries completed
            </p>

          </div>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-gray-400">
            Loading completed deliveries...
          </div>
        )}

        {/* EMPTY */}
        {!loading && orders.length === 0 && (
          <div
            className="bg-white/50 backdrop-blur-xl

            border border-white/40

            rounded-3xl

            p-10

            text-center text-gray-400"
          >
            No completed deliveries yet
          </div>
        )}

        {/* GRID */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">

          {orders.map((order) => {

            const items = order.items || [];

            const totalPrice = items.reduce(
              (acc, item) =>
                acc + ((item.price || 0) * (item.quantity || 1)),
              0
            );

            return (

              <div
                key={order.orderId}

                className="group

                bg-white/55 backdrop-blur-xl

                border border-white/50

                rounded-[28px]

                p-5

                transition-all duration-300

                hover:-translate-y-1
                hover:shadow-[0_10px_30px_rgba(99,102,241,0.08)]"
              >

                {/* TOP */}
                <div className="flex items-start justify-between mb-5">

                  {/* IMAGES */}
                  <div className="flex gap-2">

                    {items.slice(0, 2).map((item, i) => (

                      <img
                        key={i}
                        src={getImage(item.image)}
                        alt={item.productName}

                        onError={(e) => {
                          e.target.src =
                            "/products/placeholder.webp";
                        }}

                        className="w-[64px] h-[64px]

                        rounded-2xl

                        object-cover

                        border border-gray-100

                        bg-gray-100"
                      />

                    ))}

                  </div>

                  {/* STATUS */}
                  <div
                    className="px-4 py-2 rounded-full

                    bg-emerald-50

                    border border-emerald-100

                    text-emerald-600

                    text-xs font-semibold"
                  >

                    ✓ Delivered

                  </div>

                </div>

                {/* TITLE */}
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
                    ${totalPrice}
                  </p>

                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>

                  <p className="text-sm text-gray-500">
                    {items.length} item{items.length > 1 ? "s" : ""}
                  </p>

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

                {/* DATE */}
                {/* DELIVERY TIME */}
                <div className="flex items-center gap-2 text-gray-500 mb-6">

                  <span className="material-symbols-outlined text-[18px] text-purple-500">
                    schedule
                  </span>

                  <p className="text-sm">

                    Delivered on{" "}

                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )
                      : "N/A"}

                    {" "}at{" "}

                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleTimeString(
                        "en-IN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                      : "--:--"}

                  </p>

                </div>

                {/* CUSTOMER FEEDBACK */}
                {order.deliveryRating && (

                  <div
                    className="relative overflow-hidden

    rounded-[24px]

    border border-amber-100

    bg-gradient-to-br
    from-amber-50/90
    via-white
    to-yellow-50/80

    p-4

    mb-5

    shadow-[0_8px_24px_rgba(251,191,36,0.10)]"
                  >

                    {/* LIGHT GLOW */}
                    <div
                      className="absolute -top-8 -right-8

      w-24 h-24

      bg-yellow-200/30

      rounded-full

      blur-2xl"
                    ></div>

                    <div className="relative z-10">

                      {/* TOP */}
                      <div className="flex items-start justify-between gap-3 mb-3">

                        <div>

                        
                          <h3 className="text-[17px] font-bold text-gray-800 leading-none">
                            Delivery Experience
                          </h3>

                        </div>

                        {/* STARS */}
                        <div className="flex gap-[2px] mt-1">

                          {[1, 2, 3, 4, 5].map((star) => (

                            <span
                              key={star}
                              className={`text-[20px] ${star <= order.deliveryRating
                                  ? "text-amber-400"
                                  : "text-gray-200"
                                }`}
                            >
                              ★
                            </span>

                          ))}

                        </div>

                      </div>

                      {/* FEEDBACK */}
                      <div
                        className="rounded-2xl

        bg-white/85

        border border-white

        px-4 py-3

        text-[14px]

        leading-relaxed

        text-gray-700

        shadow-sm"
                      >

                        {order.deliveryFeedback?.trim()
                          ? `“${order.deliveryFeedback}”`
                          : "Customer gave rating without written feedback."}

                      </div>

                    </div>

                  </div>
                )}

                {/* BUTTONS */}
                <div className="flex gap-3">

                  {/* RECEIPT */}
                  <button
                    className="flex-1 py-3 rounded-2xl

                    bg-white/80

                    border border-gray-100

                    text-gray-700
                    font-semibold

                    hover:bg-white

                    transition-all duration-300"
                  >

                    View Receipt

                  </button>

                  {/* COMPLETED */}
                  <button
                    className="flex-1 py-3 rounded-2xl

                    bg-gradient-to-b
                    from-[#7C83FF]
                    to-[#6366F1]

                    text-white
                    font-semibold

                    shadow-[0_8px_18px_rgba(99,102,241,0.18)]"
                  >

                    Completed

                  </button>

                </div>

              </div>

            );
          })}

        </div>

      </div>

    </DeliveryLayout>
  );
};

export default Completed;