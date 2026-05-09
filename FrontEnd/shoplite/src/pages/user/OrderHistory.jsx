import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const OrderHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ratings, setRatings] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [otherCancelReason, setOtherCancelReason] = useState("");
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnOrderId, setReturnOrderId] = useState(null);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState(null);
  const [selectedReturnItems, setSelectedReturnItems] = useState([]);
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState({});
  const [returns, setReturns] = useState([]);
  const [returnReason, setReturnReason] = useState("");
  const [otherReturnReason, setOtherReturnReason] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");

  const ordersPerPage = 5;

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const token = localStorage.getItem("token");

        // ORDERS
        const res = await axios.get(
          "http://localhost:8080/api/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(res.data);

        // RETURNS
        const returnRes = await axios.get(
          "http://localhost:8080/api/returns/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReturns(returnRes.data);

      } catch (err) {

        console.error(
          "Fetch orders error:",
          err
        );

      } finally {

        setLoading(false);
      }
    };

    fetchOrders();

  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  useEffect(() => {

    if (showReturnModal || showCancelModal) {

      document.body.style.overflow = "hidden";

    } else {

      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };

  }, [showReturnModal, showCancelModal]);

  const filteredOrders = orders.filter((order) => {

    const orderStatus =
      order.status?.toLowerCase();

    const processingStatuses = [
      "placed",
      "confirmed",
      "packed",
      "processing",
      "shipped",
      "out for delivery"
    ];

    // REAL RETURN CHECK
    const hasReturnRequest =
      returns.some(
        (r) => r.orderId === order.orderId
      );

    const matchesFilter =

      filter === "ALL" ||

      (filter === "PROCESSING" &&
        processingStatuses.includes(orderStatus)) ||

      (filter === "DELIVERED" &&
        orderStatus === "delivered") ||

      (filter === "RETURNED" &&
        hasReturnRequest) ||

      (filter === "CANCELLED" &&
        orderStatus === "cancelled");

    const matchesSearch =
      search === "" ||
      (order.orderId + "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      (order.items || []).some((i) =>
        i.productName
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );

    return matchesFilter && matchesSearch;

  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;

  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);

  const getVisiblePages = () => {
    const delta = 1;
    const range = [];

    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage > 2) range.unshift("...");
    if (currentPage < totalPages - 1) range.push("...");

    if (!range.includes(1)) range.unshift(1);
    if (!range.includes(totalPages)) range.push(totalPages);

    return range;
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-600";
      case "processing":
        return "bg-indigo-100 text-indigo-600";
      case "cancelled":
        return "bg-gray-200 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const totalOrders = orders.length;

  const totalSpent = React.useMemo(() => {
    return orders.reduce((sum, order) => {
      const items = order.items || [];
      return sum + items.reduce((s, i) => s + i.price * i.quantity, 0);
    }, 0);
  }, [orders]);

  const cancelOrder = async () => {

    try {

      const token = localStorage.getItem("token");

      const finalReason =
        cancelReason === "Other"
          ? otherCancelReason
          : cancelReason;

      await axios.put(
        `http://localhost:8080/api/orders/${cancelOrderId}/cancel?reason=${encodeURIComponent(finalReason)}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // REFRESH ORDERS
      const res = await axios.get(
        "http://localhost:8080/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data);

      setShowCancelModal(false);

      setCancelReason("");

      setOtherCancelReason("");

    } catch (err) {

      console.error(err);

      setToastMessage(
        "⚠️ " +
        (err?.response?.data ||
          "Order cancellation failed")
      );

      setToastType("error");

      setTimeout(() => {
        setToastMessage("");
      }, 2000);
    }
  };

  const submitFeedback = async (orderId) => {

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8080/api/delivery-feedback/add",
        {
          orderId,
          rating: ratings[orderId],
          feedback: feedbacks[orderId],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // REFRESH ORDERS
      const res = await axios.get(
        "http://localhost:8080/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data);

      setSubmittedFeedbacks({
        ...submittedFeedbacks,
        [orderId]: true,
      });

    } catch (err) {

      console.error(err);

      setToastMessage(
        "⚠️ Feedback submission failed"
      );

      setToastType("error");

      setTimeout(() => {
        setToastMessage("");
      }, 2000);
    }
  };

  // ================= RETURN REQUEST =================

  const submitReturnRequest = async () => {

    try {

      const token = localStorage.getItem("token");

      const finalReason =
        returnReason === "Other"
          ? otherReturnReason
          : returnReason;

      const selectedProducts =
        selectedReturnItems
          .map((itemKey) =>
            itemKey.split("-").slice(1).join("-")
          )
          .join(",");

      await axios.post(
        "http://localhost:8080/api/returns/request",
        {
          orderId: returnOrderId,
          returnReason: finalReason,
          selectedItems: selectedProducts,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // REFRESH RETURNS
      const returnRes = await axios.get(
        "http://localhost:8080/api/returns/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReturns(returnRes.data);

      setToastMessage(
        "📦 Return request submitted successfully"
      );

      setToastType("success");

      setTimeout(() => {
        setToastMessage("");
      }, 2000);

      setShowReturnModal(false);

      setReturnReason("");

      setOtherReturnReason("");

      setSelectedReturnItems([]);

      setSelectedReturnOrder(null);

    } catch (err) {

      console.error(err);

      setToastMessage(
        "⚠️ " +
        (err?.response?.data ||
          "Return request failed")
      );

      setToastType("error");

      setTimeout(() => {
        setToastMessage("");
      }, 2000);
    }
  };

  const deliveredOrders = React.useMemo(() => {
    return orders.filter(
      (o) => o.status?.toLowerCase() === "delivered"
    ).length;
  }, [orders]);

  console.log("Stats Render:", totalOrders, totalSpent, deliveredOrders);

  return (
    <div className="bg-surface min-h-screen text-on-surface relative overflow-hidden">

      {/* PREMIUM BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-blue-500/25 rounded-full blur-[120px]"></div>
        <div className="absolute top-10 right-[-120px] w-[350px] h-[350px] bg-sky-400/25 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[140px]"></div>
        <div className="absolute top-[30%] left-[30%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* NEW NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/70 border-b border-white/40">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">

          {/* LOGO */}
          <div
            onClick={() => navigate("/")}
            className="text-2xl font-black tracking-tight text-indigo-600 cursor-pointer"
          >
            ShopLite
          </div>

          {/* NAV ITEMS */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-600">
            {[
              { name: "Home", path: "/" },
              { name: "Categories", path: "/categories" },
              { name: "Brands", path: "/brand/aurel" },
              { name: "Deals", path: "/top-deals" },
              { name: "Orders", path: "/orders" },
              { name: "Tickets", path: "/tickets", secondary: true }
            ].map((item, i) => {
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={i}
                  onClick={() => navigate(item.path)}
                  className={`relative transition ${isActive ? "text-indigo-600" : "hover:text-indigo-600"
                    }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            {/* HOME ICON */}
            <button onClick={() => navigate("/")}>
              <span className="material-symbols-outlined">home</span>
            </button>

            {/* CART */}
            <button onClick={() => navigate("/cart")}>
              <span className="material-symbols-outlined">shopping_cart</span>
            </button>

            {/* PROFILE */}
            <button>
              <span className="material-symbols-outlined">account_circle</span>
            </button>

          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="pt-32 px-10 max-w-7xl mx-auto">
        {/* PREMIUM TOAST */}
        {toastMessage && (

          <div
            className={`fixed top-24 right-6 z-[100] px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border text-white font-semibold animate-[slideIn_.4s_ease]

    ${toastType === "success"
                ? "bg-gradient-to-r from-emerald-500 to-green-500 border-emerald-300"
                : "bg-gradient-to-r from-red-500 to-rose-500 border-red-300"
              }`}
          >
            {toastMessage}
          </div>
        )}

        {/* HEADER */}
        <h1 className="text-5xl font-heading font-bold mb-2">
          Order History
        </h1>
        <p className="text-text-muted mb-10">
          Track and manage your recent purchases
        </p>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col md:flex-row gap-6 items-center mb-10">
          <div className="relative w-full max-w-xl">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 py-3 rounded-full bg-white/70 shadow-soft border border-border outline-none"
              placeholder="Search orders..."
            />
          </div>
          {/* FILTER */}
          <div className="flex gap-3">
            {["ALL", "PROCESSING", "DELIVERED", "RETURNED", "CANCELLED"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-full ${filter === f
                  ? "bg-indigo-600 text-white shadow-glow"
                  : "bg-white/70 border"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        {/* EMPTY STATE */}
        {filteredOrders.length === 0 && (
          <p className="text-center text-gray-500">No orders found.</p>
        )}

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 rounded-2xl flex gap-4 items-center shadow-soft">
            <div className="p-4 bg-indigo-100 rounded-xl">
              <span className="material-symbols-outlined text-indigo-600">
                inventory_2
              </span>
            </div>
            <div>
              <p className="text-sm text-text-muted">Total Orders</p>
              <h2 className="text-2xl font-bold">{totalOrders}</h2>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex gap-4 items-center shadow-soft">
            <div className="p-4 bg-purple-100 rounded-xl">
              <span className="material-symbols-outlined text-purple-600">
                payments
              </span>
            </div>
            <div>
              <p className="text-sm text-text-muted">Total Spent</p>
              <h2 className="text-2xl font-bold">
                ${totalSpent.toFixed(2)}
              </h2>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex gap-4 items-center shadow-soft">
            <div className="p-4 bg-green-100 rounded-xl">
              <span className="material-symbols-outlined text-green-600">
                verified
              </span>
            </div>
            <div>
              <p className="text-sm text-text-muted">Delivered Orders</p>
              <h2 className="text-2xl font-bold">{deliveredOrders}</h2>
            </div>
          </div>
        </div>

        {/* ORDERS */}
        <div className="space-y-8">

          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : filteredOrders.length === 0 ? (
            <p className="text-center text-gray-500">No orders found.</p>
          ) : (
            currentOrders.map((order, index) => {

              const displayOrderNumber =
                filteredOrders.length - ((currentPage - 1) * ordersPerPage + index);

              const returnedProductNames =
                returns
                  .filter(
                    (r) =>
                      r.orderId === order.orderId
                  )
                  .flatMap((r) =>
                    r.selectedItems
                      ?.split(",")
                      .map((i) => i.trim()) || []
                  );

              const items = order.items || [];

              const allItemsReturned =
                items.every((item) =>
                  returnedProductNames.includes(
                    item.productName
                  )
                );
              const total = items.reduce(
                (sum, i) => sum + i.price * i.quantity,
                0
              );

              return (
                <div
                  key={index}
                  className="glass-card p-8 rounded-3xl shadow-hover"
                >
                  {/* TOP */}
                  <div className="flex justify-between mb-6 flex-wrap gap-4">

                    <div>
                      <div className="flex gap-3 items-center">
                        <h3 className="font-semibold text-lg">
                          Order #{displayOrderNumber}
                        </h3>

                        <span
                          className={`px-3 py-1 rounded-full text-xs ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="space-y-1">

                        <div className="text-sm text-text-muted">

                          <p>
                            Ordered:
                            {" "}
                            {new Date(
                              order.orderDate
                            ).toLocaleDateString()}
                          </p>

                          {order.deliveredAt && (

                            <p>
                              Delivered:
                              {" "}
                              {new Date(
                                order.deliveredAt
                              ).toLocaleDateString()}
                            </p>

                          )}

                        </div>

                        {order.status?.toLowerCase() === "delivered" && (
                          order.returnEligible ? (

                            <p className="text-xs font-medium text-orange-500">
                              ↩ Return available till{" "}
                              {new Date(
                                order.returnEligibleTill
                              ).toLocaleDateString()}
                            </p>

                          ) : (

                            <p className="text-xs font-medium text-gray-400">
                              Return window expired
                            </p>

                          )
                        )}

                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-indigo-600">
                        ${total.toFixed(2)}
                      </p>
                      <p className="text-sm text-text-muted">
                        {items.length} Items
                      </p>
                    </div>
                  </div>

                  {/* IMAGES */}
                  <div className="flex gap-6 mb-8 flex-wrap">

                    {items.slice(0, 3).map((item, i) => (

                      <div
                        key={i}
                        className="relative group"
                      >

                        {/* PRODUCT IMAGE */}
                        <img
                          src={
                            item.image?.startsWith("http")
                              ? item.image
                              : `/products/${item.image}`
                          }
                          className="w-24 h-24 rounded-2xl object-cover border border-white/40 shadow-md"
                        />

                        {/* PRODUCT NAME */}
                        <p className="mt-3 text-xs font-semibold text-center text-gray-700 max-w-[96px] truncate">
                          {item.productName}
                        </p>
                      </div>

                    ))}

                    {items.length > 3 && (

                      <div className="w-24 h-24 rounded-2xl object-cover border border-white/40 shadow-md">
                        +{items.length - 3}
                      </div>

                    )}

                  </div>

                  {/* DELIVERY FEEDBACK */}
                  {order.status?.toLowerCase() === "delivered" && (

                    <>
                      {/* THANK YOU STATE */}
                      {submittedFeedbacks[order.orderId] ? (

                        <div className="mt-8">

                          <div className="relative overflow-hidden rounded-[32px] border border-green-200/50 bg-gradient-to-br from-green-50 via-emerald-50 to-white p-8 shadow-[0_20px_60px_rgba(16,185,129,0.15)]">

                            <div className="absolute top-0 right-0 w-40 h-40 bg-green-200/30 blur-3xl rounded-full"></div>

                            <div className="relative z-10 text-center">

                              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-4xl shadow-lg mb-5">
                                ❤️
                              </div>

                              <h2 className="text-3xl font-black text-gray-800 mb-3">
                                Thank You for Your Feedback
                              </h2>

                              <p className="text-gray-600 text-lg leading-relaxed max-w-xl mx-auto">
                                Your feedback helps us improve the ShopLite delivery experience
                                and motivates our delivery partners to provide exceptional service.
                              </p>

                            </div>
                          </div>
                        </div>

                      ) : order.deliveryRating && order.deliveryFeedback ? (

                        /* EXISTING FEEDBACK */
                        <div className="mt-8">

                          <div className="relative overflow-hidden rounded-[32px] border border-yellow-200/40 bg-gradient-to-br from-yellow-50 via-white to-orange-50 p-8 shadow-[0_20px_60px_rgba(251,191,36,0.12)]">

                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-200/30 rounded-full blur-3xl"></div>

                            <div className="relative z-10">

                              <div className="flex items-center justify-between flex-wrap gap-4 mb-5">

                                <div>
                                  <h3 className="text-2xl font-black text-gray-800">
                                    Delivery Feedback
                                  </h3>

                                  <p className="text-gray-500 mt-1">
                                    Your submitted delivery experience
                                  </p>
                                </div>

                                <div className="flex gap-1 text-3xl">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                      key={star}
                                      className={
                                        star <= Number(order.deliveryRating)
                                          ? "text-yellow-400"
                                          : "text-gray-200"
                                      }
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>

                              </div>

                              <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-3xl p-5 text-gray-700 leading-relaxed shadow-sm">
                                “{order.deliveryFeedback}”
                              </div>

                            </div>
                          </div>
                        </div>

                      ) : order.returnEligible ? (

                        /* FEEDBACK FORM */
                        <div className="mt-8">

                          <div className="relative overflow-hidden rounded-[32px] border border-white/30 bg-white/60 backdrop-blur-2xl p-8 shadow-[0_20px_80px_rgba(99,102,241,0.12)]">

                            {/* BACKGROUND BLOBS */}
                            <div className="absolute -top-10 right-0 w-52 h-52 bg-indigo-300/20 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-300/20 rounded-full blur-3xl"></div>

                            <div className="relative z-10">

                              {/* HEADER */}
                              <div className="mb-8">

                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-5">
                                  ✨ Delivery Experience
                                </div>

                                <h2 className="text-3xl font-black text-gray-800 mb-2">
                                  Rate Your Delivery
                                </h2>

                                <p className="text-gray-500 text-lg">
                                  Share your experience with the ShopLite delivery service
                                </p>

                              </div>

                              {/* STARS */}
                              <div className="flex gap-3 mb-8">

                                {[1, 2, 3, 4, 5].map((star) => (

                                  <button
                                    key={star}
                                    onClick={() =>
                                      setRatings({
                                        ...ratings,
                                        [order.orderId]: star,
                                      })
                                    }
                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl transition-all duration-300 transform hover:scale-110 ${ratings[order.orderId] >= star
                                      ? "bg-gradient-to-br from-yellow-300 to-orange-400 text-white shadow-[0_10px_30px_rgba(251,191,36,0.4)]"
                                      : "bg-white/70 text-gray-300 border border-gray-200 hover:border-yellow-300"
                                      }`}
                                  >
                                    ★
                                  </button>

                                ))}

                              </div>

                              {/* FEEDBACK BOX */}
                              <div className="mb-6">

                                <textarea
                                  placeholder="Tell us about your delivery experience..."
                                  value={feedbacks[order.orderId] || ""}
                                  onChange={(e) =>
                                    setFeedbacks({
                                      ...feedbacks,
                                      [order.orderId]: e.target.value,
                                    })
                                  }
                                  rows={5}
                                  className="w-full rounded-3xl border border-white/40 bg-white/70 backdrop-blur-md p-6 text-gray-700 placeholder-gray-400 outline-none focus:ring-4 focus:ring-indigo-200 resize-none shadow-inner"
                                />

                              </div>

                              {/* SUBMIT BUTTON */}
                              <button
                                onClick={() => submitFeedback(order.orderId)}
                                className="group relative overflow-hidden px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-semibold text-sm shadow-[0_10px_25px_rgba(99,102,241,0.28)] transition-all duration-300 hover:scale-[1.02]"
                              >

                                <span className="relative z-10 flex items-center gap-2">
                                  Submit Feedback
                                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                                    →
                                  </span>
                                </span>

                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition"></div>

                              </button>

                            </div>
                          </div>
                        </div>

                      ) : null}
                    </>
                  )}

                  {/* BUTTONS */}

                  <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/20">

                    {/* CANCEL ORDER */}
                    {(order.status?.toLowerCase() === "placed" ||
                      order.status?.toLowerCase() === "confirmed" ||
                      order.status?.toLowerCase() === "packed") && (

                        <button
                          onClick={() => {

                            setCancelOrderId(order.orderId);

                            setShowCancelModal(true);
                          }}
                          className="px-6 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition"
                        >
                          Cancel Order
                        </button>
                      )}

                    {/* RETURN ITEMS */}
                    {order.status?.toLowerCase() === "delivered" &&
                      !allItemsReturned && (

                        order.returnEligible ? (

                          <button
                            onClick={() => {

                              setReturnOrderId(order.orderId);
                              setSelectedReturnOrder(order);
                              setSelectedReturnItems([]);
                              setShowReturnModal(true);
                            }}
                            className="px-6 py-2 rounded-full border border-orange-200 text-orange-600 hover:bg-orange-50 transition"
                          >
                            Return Items
                          </button>

                        ) : (

                          <button
                            disabled
                            className="px-6 py-2 rounded-full border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                          >
                            Return Window Expired
                          </button>

                        )
                      )}

                    {/* VIEW DETAILS */}
                    <button
                      onClick={() =>
                        navigate("/order-tracking", { state: order })
                      }
                      className="px-6 py-2 rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-glow"
                    >
                      View Details
                    </button>

                  </div>
                </div>
              );
            })
          )}

        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-3 mt-12 items-center">

          {/* PAGE NUMBERS */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-12 items-center">

              {/* PREV */}
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-xl bg-white/60 hover:shadow-soft transition disabled:opacity-40"
              >
                {"<"}
              </button>

              {/* PAGE NUMBERS */}
              {getVisiblePages().map((p, i) =>
                p === "..." ? (
                  <span key={i} className="px-2 text-gray-400">...</span>
                ) : (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(p)}
                    className={`w-10 h-10 rounded-xl transition ${currentPage === p
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-glow"
                      : "bg-white/60 hover:shadow-soft"
                      }`}
                  >
                    {p}
                  </button>
                )
              )}

              {/* NEXT */}
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-xl bg-white/60 hover:shadow-soft transition disabled:opacity-40"
              >
                {">"}
              </button>

            </div>
          )}
        </div>
      </main >

      {/* RETURN REQUEST MODAL */}
      {showReturnModal && (

        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-5xl bg-white rounded-[32px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto">

            {/* SELECT RETURN ITEMS */}
            <div className="mb-6">

              <h2 className="text-2xl font-black text-gray-800 mb-2">
                Select Items to Return
              </h2>

              <p className="text-sm text-gray-500 mb-5">
                Choose the products you want to return from this order.
              </p>

              <div className="grid grid-cols-2 gap-4">

                {selectedReturnOrder?.items?.map((item, index) => {

                  const itemKey =
                    `${returnOrderId}-${item.productName}`;

                  const isSelected =
                    selectedReturnItems.includes(itemKey);

                  const isReturned =
                    returns
                      .filter(
                        (r) =>
                          r.orderId === returnOrderId
                      )
                      .flatMap((r) =>
                        r.selectedItems
                          ?.split(",")
                          .map((i) => i.trim()) || []
                      )
                      .includes(item.productName);
                  return (

                    <div
                      key={index}
                      onClick={() => {

                        if (isReturned) return;

                        if (isSelected) {

                          setSelectedReturnItems(
                            selectedReturnItems.filter(
                              (i) => i !== itemKey
                            )
                          );

                        } else {

                          setSelectedReturnItems([
                            ...selectedReturnItems,
                            itemKey
                          ]);
                        }
                      }}
                      className={`relative p-4 rounded-3xl border transition-all duration-300

  ${isReturned
                          ? "opacity-60 bg-gray-100 border-gray-200 cursor-not-allowed"
                          : "cursor-pointer"
                        }

  ${isSelected
                          ? "border-orange-400 bg-orange-50"
                          : "border-gray-200 hover:border-orange-200"
                        }`}
                    >

                      {/* CHECKBOX */}
                      <div
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center

    ${isSelected
                            ? "bg-orange-500 border-orange-500 text-white"
                            : "border-gray-300"
                          }`}
                      >
                        {isSelected && "✓"}
                      </div>

                      {/* IMAGE */}
                      <img
                        src={
                          item.image?.startsWith("http")
                            ? item.image
                            : `/products/${item.image}`
                        }
                        alt=""
                        className="w-24 h-24 mx-auto rounded-2xl object-cover border border-gray-100 shadow-sm"
                      />

                      {/* INFO */}
                      <div className="text-center mt-4">
                        <div className="flex flex-col items-center">

                          <h3 className="font-bold text-gray-800">
                            {item.productName}
                          </h3>

                          {isReturned && (

                            <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-600 text-[10px] font-bold tracking-wide">
                              RETURN REQUESTED
                            </span>

                          )}

                        </div>

                        <div className="flex items-center justify-center gap-2 mt-2 text-sm">

                          <span className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </span>

                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>

                          <span className="text-sm font-semibold text-indigo-600">
                            ${item.price}
                          </span>

                        </div>

                      </div>
                    </div>
                  );
                })}

              </div>

            </div>

            {/* SUBTITLE */}
            <p className="text-sm text-gray-500 mb-6">
              Please select a reason for your return request.
            </p>

            {/* REASONS */}
            <div className="space-y-3 mb-6">

              {[
                "Damaged product",
                "Wrong item received",
                "Size issue",
                "Product not as expected",
                "Missing accessories",
                "Other"
              ].map((reason) => (

                <label
                  key={reason}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl border cursor-pointer transition-all duration-300
            ${returnReason === reason
                      ? "border-orange-400 bg-orange-50"
                      : "border-gray-200"
                    }`}
                >

                  <input
                    type="radio"
                    name="returnReason"
                    value={reason}
                    checked={returnReason === reason}
                    onChange={(e) =>
                      setReturnReason(e.target.value)
                    }
                  />

                  <span className="text-sm font-medium text-gray-700">
                    {reason}
                  </span>

                </label>
              ))}

            </div>

            {/* OTHER REASON */}
            {returnReason === "Other" && (

              <textarea
                value={otherReturnReason}
                onChange={(e) =>
                  setOtherReturnReason(e.target.value)
                }
                placeholder="Enter return reason..."
                className="w-full h-28 resize-none rounded-2xl border border-gray-200 p-4 text-sm outline-none focus:ring-2 focus:ring-orange-200 mb-6"
              />

            )}

            {/* BUTTONS */}
            <div className="flex gap-3">

              {/* CLOSE */}
              <button
                onClick={() => {

                  setShowReturnModal(false);

                  setReturnReason("");

                  setOtherReturnReason("");

                  setSelectedReturnItems([]);

                  setSelectedReturnOrder(null);
                }}
                className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50"
              >
                Close
              </button>

              {/* SUBMIT */}
              <button
                onClick={submitReturnRequest}
                disabled={
                  !returnReason ||
                  selectedReturnItems.length === 0
                }
                className={`flex-1 py-3 rounded-2xl text-white font-semibold transition-all
  ${returnReason &&
                    selectedReturnItems.length > 0
                    ? "bg-gradient-to-br from-orange-500 to-red-500 hover:scale-[1.02] shadow-lg hover:shadow-orange-300/40"
                    : "bg-gray-300 cursor-not-allowed"
                  }`}
              >
                Submit Return
              </button>
            </div>

          </div>

        </div>
      )}

      {/* CANCEL ORDER MODAL */}
      {showCancelModal && (

        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">

          <div className="w-full max-w-lg bg-white rounded-[32px] p-7 shadow-2xl">

            {/* TITLE */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Cancel Order
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              Please select a reason for cancellation.
            </p>

            {/* REASONS */}
            <div className="space-y-3 mb-6">

              {[
                "Ordered by mistake",
                "Found cheaper elsewhere",
                "Wrong address",
                "Need faster delivery",
                "Payment issue",
                "Other"
              ].map((reason) => (

                <label
                  key={reason}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl border cursor-pointer transition-all duration-300
            ${cancelReason === reason
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200"
                    }`}
                >

                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={cancelReason === reason}
                    onChange={(e) =>
                      setCancelReason(e.target.value)
                    }
                  />

                  <span className="text-sm font-medium text-gray-700">
                    {reason}
                  </span>

                </label>
              ))}

            </div>

            {/* OTHER */}
            {cancelReason === "Other" && (

              <textarea
                value={otherCancelReason}
                onChange={(e) =>
                  setOtherCancelReason(e.target.value)
                }
                placeholder="Enter cancellation reason..."
                className="w-full h-28 resize-none rounded-2xl border border-gray-200 p-4 text-sm outline-none focus:ring-2 focus:ring-red-200 mb-6"
              />
            )}

            {/* BUTTONS */}
            <div className="flex gap-3">

              {/* CLOSE */}
              <button
                onClick={() => {

                  setShowCancelModal(false);

                  setCancelReason("");

                  setOtherCancelReason("");
                }}
                className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50"
              >
                Close
              </button>

              {/* SUBMIT */}
              <button
                onClick={cancelOrder}
                disabled={!cancelReason}
                className={`flex-1 py-3 rounded-2xl text-white font-semibold transition-all
          ${cancelReason
                    ? "bg-gradient-to-br from-red-500 to-rose-500"
                    : "bg-gray-300 cursor-not-allowed"
                  }`}
              >
                Confirm Cancel
              </button>

            </div>

          </div>

        </div>
      )}
      {/* FOOTER */}
      < footer className="mt-20 py-10 border-t text-center text-text-muted" >
        © ShopLite Luxury E-commerce.
      </footer >
    </div >
  );
};

export default OrderHistory;