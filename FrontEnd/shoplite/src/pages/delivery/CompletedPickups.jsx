import React, { useEffect, useState } from "react";
import DeliveryLayout from "../../components/delivery/DeliveryLayout";
import { getCompletedReturnPickups } from "../../services/deliveryApi";

const CompletedPickups = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {

    try {

      const completedReturns =
        await getCompletedReturnPickups();

      // RETURN PICKUPS

      const formattedReturns =
        Array.isArray(completedReturns)
          ? completedReturns
          : [];
      setOrders(formattedReturns);

    } catch (err) {

      console.error(
        "Error fetching completed orders",
        err
      );

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
              Completed Pickups
            </h1>

            <p className="text-gray-500">
              Track all completed return pickups
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
              ✨ {orders.length} pickups completed
            </p>

          </div>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-gray-400">
            Loading completed pickups...
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
            No completed pickups yet
          </div>
        )}

        {/* GRID */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">

          {orders.map((order) => {
            console.log(JSON.stringify(order, null, 2));
            const items =
              order.items && order.items.length > 0
                ? order.items
                : [
                  {
                    productName:
                      order.selectedItems ||
                      "Returned Product",

                    quantity: 1,

                    price:
                      order.refundAmount || 0,

                    image:
                      "/products/placeholder.webp"
                  }
                ];



            return (

              <div
                key={order.returnId}

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
                    ✓ Pickup Completed
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
                {/* PICKUP INFO */}
                <div className="flex items-center gap-3 mb-5">

                  <div
                    className="px-4 py-2 rounded-2xl

    bg-indigo-50

    border border-indigo-100

    text-indigo-600

    text-sm font-semibold"
                  >

                    Return Pickup

                  </div>

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

                      Pickup Address

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

                    Return Requested on{" "}


                    {order.returnRequestedDate
                      ? new Date(order.returnRequestedDate).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )
                      : "N/A"}

                    {" "}at{" "}

                    {order.returnRequestedDate
                      ? new Date(order.returnRequestedDate).toLocaleTimeString(
                        "en-IN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                      : "--:--"}

                  </p>

                </div>

              </div>

            );
          })}

        </div>

      </div>

    </DeliveryLayout>
  );
};

export default CompletedPickups;