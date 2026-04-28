import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:8080/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(res.data);
      } catch (err) {
        console.error("Fetch orders error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      filter === "ALL" ||
      order.status?.toLowerCase() === filter.toLowerCase();

    const matchesSearch =
      search === "" ||
      (order.orderId + "").toLowerCase().includes(search.toLowerCase()) ||
      (order.items || []).some((i) =>
        i.productName?.toLowerCase().includes(search.toLowerCase())
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
              { name: "Brands", path: "/brands" },
              { name: "Deals", path: "/top-deals" },
              { name: "Orders", path: "/orders" },
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
            {["ALL", "DELIVERED", "PROCESSING", "CANCELLED"].map((f) => (
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
              const items = order.items || [];

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
                          Order #{order.orderId}
                        </h3>

                        <span
                          className={`px-3 py-1 rounded-full text-xs ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <p className="text-sm text-text-muted">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-indigo-600">
                        ₹{total.toFixed(2)}
                      </p>
                      <p className="text-sm text-text-muted">
                        {items.length} Items
                      </p>
                    </div>
                  </div>

                  {/* IMAGES */}
                  <div className="flex gap-4 mb-6 flex-wrap">
                    {items.slice(0, 3).map((item, i) => (
                      <img
                        key={i}
                        src={
                          item.image?.startsWith("http")
                            ? item.image
                            : `/products/${item.image}`
                        }
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                    ))}

                    {items.length > 3 && (
                      <div className="w-20 h-20 flex items-center justify-center border border-dashed rounded-xl text-indigo-600">
                        +{items.length - 3}
                      </div>
                    )}
                  </div>

                  {/* BUTTON */}
                  <div className="flex justify-end">
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

      {/* FOOTER */}
      < footer className="mt-20 py-10 border-t text-center text-text-muted" >
        © 2024 ShopLite Luxury E-commerce.
      </footer >
    </div >
  );
};

export default OrderHistory;