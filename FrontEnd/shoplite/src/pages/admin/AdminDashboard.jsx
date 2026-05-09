import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import adminAxios from "../../api/adminAxios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [ticketCount, setTicketCount] = useState(0);
  const isActive = (path) => location.pathname === path;

  // STATES
  const [orders, setOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [statsData, setStatsData] = useState({
    products: 0,
    orders: 0,
    users: 0,
  });

  //  FETCH RECENT ORDERS
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await adminAxios.get("/orders/admin");
        console.log("ORDERS:", res.data);

        setOrders(res.data.slice(0, 5)); // latest 5 orders
      } catch (err) {
        console.error("Orders fetch error:", err);
      }
    };

    fetchOrders();
  }, []);

  // FETCH TOP SELLING PRODUCTS
  useEffect(() => {
    const fetchTopProducts = async () => {
      try {

        const res = await adminAxios.get(
          "/orders/admin/top-products"
        );

        console.log("TOP PRODUCTS:", res.data);

        setTopProducts(res.data);

      } catch (err) {

        console.error(
          "Top products fetch error:",
          err
        );
      }
    };

    fetchTopProducts();
  }, []);

  //  FETCH DASHBOARD STATS
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminAxios.get("/orders/admin/stats");

        console.log("STATS:", res.data); // 🔍 debug

        setStatsData({
          products: res.data.products,
          orders: res.data.orders,
          users: res.data.users,
        });
      } catch (err) {
        console.error("Stats fetch error:", err);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchTicketCount = async () => {
      try {
        const res = await adminAxios.get("/tickets/admin/count");
        setTicketCount(res.data);
      } catch (err) {
        console.error("Ticket count error:", err);
      }
    };

    fetchTicketCount();
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminRole");
    navigate("/admin/login", { replace: true });
  };
  // STATS DISPLAY
  const stats = [
    {
      title: "Total Revenue",
      value: "$128,430",
      icon: "payments",
      color: "indigo",
      growth: "+12.5%",
    },
    {
      title: "Total Orders",
      value: statsData.orders,
      icon: "shopping_cart",
      color: "green",
      growth: "+8.2%",
    },
    {
      title: "Live Products",
      value: statsData.products,
      icon: "inventory_2",
      color: "blue",
      growth: "Static",
    },
    {
      title: "Open Tickets",
      value: ticketCount,
      icon: "confirmation_number",
      color: "red",
      growth: "-2.1%",
    },
  ];

  //  STATUS STYLE 
  const getStatusStyle = (status) => {
    switch (status) {
      case "PLACED":
        return "bg-blue-100 text-blue-700";
      case "SHIPPED":
        return "bg-amber-100 text-amber-700";
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-700";
      case "CANCELLED":
        return "bg-red-100 text-red-600";
      default:
        return "";
    }
  };

  const colorStyles = {
    indigo: {
      bg: "bg-indigo-100 text-indigo-600",
      glow: "hover:shadow-[0_0_25px_rgba(99,102,241,0.25)]",
      badge: "bg-green-100 text-green-500",
    },
    green: {
      bg: "bg-green-100 text-green-600",
      glow: "hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]",
      badge: "bg-green-100 text-green-500",
    },
    blue: {
      bg: "bg-blue-100 text-blue-600",
      glow: "hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]",
      badge: "bg-gray-100 text-gray-400",
    },
    red: {
      bg: "bg-red-100 text-red-500",
      glow: "hover:shadow-[0_0_25px_rgba(239,68,68,0.25)]",
      badge: "bg-red-100 text-red-500",
    },
  };

  return (
    <div className="min-h-screen text-gray-800 relative overflow-hidden">

      <div className="fixed inset-0 -z-10 
bg-gradient-to-br from-[#fdfcfb] via-[#f7f1ec] to-[#f3e8ff]" />

      <div className="fixed top-[-120px] left-[-120px] w-[420px] h-[420px]
bg-[#f5d0c5]/40 rounded-full blur-[140px] -z-10" />

      <div className="fixed bottom-[-140px] right-[-120px] w-[420px] h-[420px]
bg-[#e9d5ff]/40 rounded-full blur-[140px] -z-10" />

      <div className="relative z-10">

        {/* HEADER */}
        <header
          className="fixed top-0 left-0 right-0 z-50 
h-20 px-8 flex items-center justify-between
bg-gradient-to-r from-white/40 to-white/20 
backdrop-blur-xl border-b border-white/20"
        >

          {/* LEFT */}
          <div className="flex items-center gap-5">

            {/* LOGO ICON */}
            <div className="w-10 h-10 rounded-xl 
    bg-gradient-to-br from-[#60a5fa] to-[#a78bfa] 
    flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-lg">
                shopping_bag
              </span>
            </div>

            {/* TEXT */}
            <div>
              <h1 className="text-lg font-bold text-blue-600 leading-none">
                ShopLite
              </h1>
              <p className="text-[10px] tracking-widest text-gray-400 font-semibold">
                MANAGEMENT SUITE
              </p>
            </div>

            {/* WELCOME */}
            <p className="hidden md:block text-sm text-gray-500 ml-6">
              Welcome back, <span className="font-semibold text-blue-600">Admin</span>
            </p>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            {/* SEARCH */}
            <div className="hidden md:flex items-center 
    bg-white/30 border border-white/20 backdrop-blur-md 
    px-5 py-2.5 rounded-full shadow-sm w-64">
              <span className="material-symbols-outlined text-gray-400 text-sm mr-2">
                search
              </span>
              <input
                placeholder="Search insights..."
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>

            {/* ICON GROUP */}
            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-full 
      bg-white/40 backdrop-blur-md border border-white/40
      flex items-center justify-center shadow-sm cursor-pointer">
                <span className="material-symbols-outlined text-gray-600">
                  notifications
                </span>
              </div>

              <div className="w-10 h-10 rounded-full 
      bg-white/40 backdrop-blur-md border border-white/40
      flex items-center justify-center shadow-sm cursor-pointer">
                <span className="material-symbols-outlined text-gray-600">
                  settings
                </span>
              </div>

            </div>

            {/* DIVIDER */}
            <div className="hidden md:block w-px h-6 bg-gray-300/50"></div>

            {/* QUICK STATS */}
            <button className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full 
    bg-gradient-to-r from-[#6366f1] to-[#a855f7] 
    text-white text-sm font-semibold shadow-md">
              <span className="material-symbols-outlined text-sm">bolt</span>
              Quick Stats
            </button>

            {/* PROFILE */}
            <div
              onClick={() => navigate("/admin/profile")}
              className="w-10 h-10 rounded-full 
      bg-gradient-to-br from-blue-100 to-purple-100 
      flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-blue-600">
                account_circle
              </span>
            </div>

          </div>
        </header>
        {/* SIDEBAR */}
        <aside className="fixed left-0 top-20 bottom-0 w-64 p-4 hidden md:flex flex-col
bg-gradient-to-b from-white/40 to-white/10 
backdrop-blur-xl border-r border-white/20
shadow-[4px_0_40px_rgba(0,0,0,0.05)]" >

          {/* NAV */}
          <nav className="flex-1 space-y-3 mt-4">

            {/* DASHBOARD (ACTIVE) */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl
    bg-gradient-to-r from-[#6366f1]/20 to-[#a855f7]/20 
    text-indigo-600 font-semibold
    shadow-inner border border-white/40">
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </div>

            {/* ITEM */}
            <div
              onClick={() => navigate("/admin/products")}
              className={`group flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer
      transition-all duration-300
      ${isActive("/admin/products")
                  ? "bg-gradient-to-r from-[#6366f1]/20 to-[#a855f7]/20 text-indigo-600 shadow-inner border border-white/40"
                  : "text-gray-500 hover:bg-white/40 hover:shadow-md hover:ring-2 hover:ring-purple-200"
                }`}
            >
              <span className="material-symbols-outlined transition-colors group-hover:text-indigo-500">
                inventory_2
              </span>
              Manage Products
            </div>

            {/* ADD PRODUCT */}
            <div
              onClick={() => navigate("/admin/add-product")}
              className="group flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer
      text-gray-500 transition-all duration-300
      hover:bg-white/40 hover:shadow-md hover:ring-2 hover:ring-blue-200"
            >
              <span className="material-symbols-outlined transition-colors group-hover:text-blue-500">
                add_box
              </span>
              Add Product
            </div>

            {/* ORDERS */}
            <div
              onClick={() => navigate("/manage-orders")}
              className="group flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer
      text-gray-500 transition-all duration-300
      hover:bg-white/40 hover:shadow-md hover:ring-2 hover:ring-indigo-200"
            >
              <span className="material-symbols-outlined transition-colors group-hover:text-indigo-500">
                shopping_cart
              </span>
              Manage Orders
            </div>

            {/* Manage Delivery Partners */}
            <div
              onClick={() => navigate("/admin/delivery-partners")}
              className={`group flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer
  transition-all duration-300
  ${isActive("/admin/delivery-partners")
                  ? "bg-gradient-to-r from-[#6366f1]/20 to-[#a855f7]/20 text-indigo-600 shadow-inner border border-white/40"
                  : "text-gray-500 hover:bg-white/40 hover:shadow-md hover:ring-2 hover:ring-cyan-200"
                }`}
            >
              <span className="material-symbols-outlined transition-colors group-hover:text-cyan-500">
                local_shipping
              </span>

              Manage Deliveries
            </div>

            {/* Manage Returns */}
            <div
              onClick={() => navigate("/admin/returns")}
              className={`group flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer
transition-all duration-300
${isActive("/admin/returns")
                  ? "bg-gradient-to-r from-[#6366f1]/20 to-[#a855f7]/20 text-indigo-600 shadow-inner border border-white/40"
                  : "text-gray-500 hover:bg-white/40 hover:shadow-md hover:ring-2 hover:ring-orange-200"
                }`}
            >
              <span className="material-symbols-outlined transition-colors group-hover:text-orange-500">
                assignment_return
              </span>

              Manage Returns
            </div>

            {/* TICKETS */}
            <div
              onClick={() => navigate("/admin/tickets")}
              className={`group flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer
      transition-all duration-300
      ${isActive("/admin/tickets")
                  ? "bg-gradient-to-r from-[#6366f1]/20 to-[#a855f7]/20 text-indigo-600 shadow-inner border border-white/40"
                  : "text-gray-500 hover:bg-white/40 hover:shadow-md hover:ring-2 hover:ring-pink-200"
                }`}
            >
              <span className="material-symbols-outlined transition-colors group-hover:text-pink-500">
                confirmation_number
              </span>
              Tickets
            </div>

          </nav>

          {/* LOGOUT  */}
          <div className="pt-4 border-t border-white/40">

            <div
              onClick={handleLogout}
              className="group flex items-center gap-3 px-4 py-3 text-red-500 
      hover:bg-red-50 rounded-2xl cursor-pointer transition-all duration-300
      hover:ring-2 hover:ring-red-200"
            >
              <span className="material-symbols-outlined transition group-hover:scale-110">
                logout
              </span>
              Logout
            </div>

          </div>

        </aside>

        {/* MAIN */}
        <main className="md:ml-64 pt-24 px-6 pb-12">

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-black">Dashboard</h1>
            <p className="text-on-surface-variant">
              Welcome back, Admin. Here's what's happening today.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, i) => {
              const style = colorStyles[stat.color];

              return (
                <div
                  key={i}
                  className={`group p-6 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/20
        shadow-[0_10px_30px_rgba(0,0,0,0.05)]
        transition-all duration-300 ${style.glow}`}
                >
                  <div className="flex items-center justify-between mb-4">

                    {/* ICON */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${style.bg}`}>
                      <span className="material-symbols-outlined">
                        {stat.icon}
                      </span>
                    </div>

                    {/* GROWTH */}
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${style.badge}`}>
                      {stat.growth}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h3 className="text-xl font-bold text-gray-900">{stat.value}</h3>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">

            {/* LEFT - TRENDING PRODUCTS */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-700">
                  Trending Products
                </h2>

                <span
                  onClick={() => navigate("/admin/products")}
                  className="text-sm text-indigo-600 font-semibold cursor-pointer hover:underline"
                >
                  View All Inventory
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-6">

                {topProducts.map((p, i) => (

                  <div
                    key={p.id}
                    className="group rounded-3xl overflow-hidden 
        bg-white/40 backdrop-blur-xl border border-white/20
        transition-all duration-300
        hover:shadow-[0_0_25px_rgba(99,102,241,0.25)]"
                  >

                    {/* IMAGE */}
                    <div className="relative overflow-hidden aspect-square">

                      <img
                        src={
                          p.imageUrl?.startsWith("http")
                            ? p.imageUrl
                            : `/products/${p.imageUrl}`
                        }
                        alt={p.name}
                        className="w-full h-full object-cover 
            transition-transform duration-700 
            group-hover:scale-110"
                      />

                      {/* RANK BADGE */}
                      <div className="absolute top-3 left-3 
          bg-indigo-600 text-white text-xs font-bold
          px-3 py-1 rounded-full shadow-lg">

                        #{i + 1} Top Sold

                      </div>

                    </div>

                    {/* DETAILS */}
                    <div className="p-4">

                      <h4 className="font-semibold text-gray-800 truncate">
                        {p.name}
                      </h4>

                      <div className="flex justify-between mt-2">

                        <span className="text-sm text-gray-500">
                          ${p.price}
                        </span>

                        <span className="text-xs font-semibold text-indigo-600">
                          Best Seller
                        </span>

                      </div>

                    </div>

                  </div>

                ))}

              </div>
            </div>
            {/* RIGHT - QUICK ACTIONS */}
            <div
              className="p-6 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/20
    shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
            >
              <h3 className="font-semibold text-gray-700 mb-4">Quick Actions</h3>

              <div className="grid grid-cols-2 gap-4">

                {/* BUTTON */}
                <div
                  onClick={() => navigate("/admin/add-product")}
                  className="group flex flex-col items-center justify-center gap-2 p-4 rounded-2xl
        bg-white/70 hover:bg-white transition cursor-pointer
        hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]"
                >
                  <span className="material-symbols-outlined text-gray-600 group-hover:text-indigo-600">
                    add_box
                  </span>
                  <p className="text-sm text-gray-600">Add Product</p>
                </div>

                {/* BUTTON */}
                <div
                  onClick={() => navigate("/manage-orders")}
                  className="group flex flex-col items-center justify-center gap-2 p-4 rounded-2xl
        bg-white/70 hover:bg-white transition cursor-pointer
        hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                >
                  <span className="material-symbols-outlined text-gray-600 group-hover:text-green-600">
                    inventory
                  </span>
                  <p className="text-sm text-gray-600">Bulk Orders</p>
                </div>

                {/* BUTTON */}
                <div
                  className="group flex flex-col items-center justify-center gap-2 p-4 rounded-2xl
        bg-white/70 hover:bg-white transition cursor-pointer
        hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]"
                >
                  <span className="material-symbols-outlined text-gray-600 group-hover:text-blue-600">
                    campaign
                  </span>
                  <p className="text-sm text-gray-600">Newsletter</p>
                </div>

                {/* BUTTON */}
                <div
                  className="group flex flex-col items-center justify-center gap-2 p-4 rounded-2xl
        bg-white/70 hover:bg-white transition cursor-pointer
        hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]"
                >
                  <span className="material-symbols-outlined text-gray-600 group-hover:text-purple-600">
                    settings
                  </span>
                  <p className="text-sm text-gray-600">Store Config</p>
                </div>

              </div>
            </div>

          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* RECENT ORDERS */}
            <div className="group lg:col-span-2 p-6 rounded-3xl 
bg-white/40 backdrop-blur-xl border border-white/20
shadow-[0_10px_30px_rgba(0,0,0,0.05)]
transition-all duration-300
hover:shadow-[0_0_35px_rgba(99,102,241,0.25)]">

              {/* HEADER */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-gray-700">Recent Orders</h2>
                <span
                  onClick={() => navigate("/orders")}
                  className="text-sm text-indigo-600 font-semibold cursor-pointer hover:underline"
                >
                  View All Orders
                </span>
              </div>

              {/* TABLE */}
              <table className="w-full text-sm">

                <thead className="text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="text-left pb-3">Order ID</th>
                    <th className="text-left pb-3">Customer</th>
                    <th className="text-left pb-3">Amount</th>
                    <th className="text-left pb-3">Status</th>
                    <th className="text-left pb-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((o, i) => {

                    const items = o.items || [];
                    const total = items.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    );

                    const name = o.userName || o.user?.name || "Customer";

                    const initials = name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase();

                    const statusStyle =
                      o.status === "DELIVERED"
                        ? "bg-green-100 text-green-600"
                        : o.status === "SHIPPED"
                          ? "bg-blue-100 text-blue-600"
                          : o.status === "PLACED"
                            ? "bg-indigo-100 text-indigo-600"
                            : o.status === "CANCELLED"
                              ? "bg-red-100 text-red-500"
                              : "bg-gray-100 text-gray-500";

                    return (
                      <tr
                        key={i}
                        className="group border-t border-white/40 
          transition-all duration-300
          hover:bg-white/70 hover:shadow-sm"
                      >

                        {/* ORDER ID */}
                        <td className="py-4 font-semibold text-gray-700">
                          #ORD-{o.orderId}
                        </td>

                        {/* CUSTOMER */}
                        <td className="py-4">
                          <div className="flex items-center gap-3 
            transition-all duration-300 group-hover:translate-x-[2px]">

                            <div className="w-8 h-8 rounded-full 
              bg-indigo-100 text-indigo-600 
              flex items-center justify-center text-xs font-bold
              transition group-hover:scale-110">
                              {initials}
                            </div>

                            <span className="text-gray-700">{name}</span>
                          </div>
                        </td>

                        {/* AMOUNT */}
                        <td className="py-4 font-semibold text-gray-800">
                          ${total.toFixed(2)}
                        </td>

                        {/* STATUS */}
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full 
              transition-all duration-300 group-hover:scale-105 ${statusStyle}`}
                          >
                            {o.status}
                          </span>
                        </td>

                        {/* ACTION */}
                        <td className="py-4">
                          <span
                            onClick={() => navigate("/order-tracking", { state: o })}
                            className="material-symbols-outlined text-gray-400 cursor-pointer 
              transition-all duration-300
              group-hover:text-indigo-600 group-hover:scale-110"
                          >
                            visibility
                          </span>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>

            <div
              className="p-6 rounded-3xl 
  bg-white/40 backdrop-blur-xl border border-white/20
  shadow-[0_10px_30px_rgba(0,0,0,0.05)]
  transition-all duration-300
  hover:shadow-[0_0_30px_rgba(99,102,241,0.25)]"
            >

              {/* HEADER */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-gray-700">Active Shipment</h2>
                <span className="text-xs text-indigo-600 font-semibold">
                  #ORD-2842
                </span>
              </div>

              {/* PROGRESS LINE */}
              <div className="relative flex items-center justify-between mb-6">

                {/* BASE LINE */}
                <div className="absolute top-1/2 left-0 w-full h-[3px] bg-gray-200 -translate-y-1/2 rounded-full"></div>

                {/* ANIMATED PROGRESS LINE */}
                <div className="absolute top-1/2 left-0 h-[3px] bg-indigo-500 -translate-y-1/2 rounded-full
  animate-progress"></div>

                {/* STEP 1 */}
                <div className="z-10 flex flex-col items-center">
                  <div className="step-complete">
                    <span className="material-symbols-outlined text-sm">check</span>
                  </div>
                  <p className="text-[10px] mt-2 text-gray-400">PLACED</p>
                </div>

                {/* STEP 2 (ACTIVE) */}
                <div className="z-10 flex flex-col items-center">
                  <div className="step-active">
                    <span className="material-symbols-outlined text-sm">check</span>
                  </div>
                  <p className="text-[10px] mt-2 text-indigo-600 font-semibold">SHIPPED</p>
                </div>

                {/* STEP 3 */}
                <div className="z-10 flex flex-col items-center">
                  <div className="step-pending">
                    <span className="material-symbols-outlined text-sm">radio_button_unchecked</span>
                  </div>
                  <p className="text-[10px] mt-2 text-gray-400">ARRIVED</p>
                </div>

              </div>

              {/* DELIVERY CARD */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/70">

                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <span className="material-symbols-outlined">local_shipping</span>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Estimated Delivery
                  </p>
                  <p className="text-xs text-gray-400">
                    Tomorrow, 4:00 PM
                  </p>
                </div>

              </div>

            </div>

          </div>

        </main>

        {/* LOGOUT MODAL */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

            <div className="bg-white rounded-2xl shadow-2xl w-[350px] p-6 animate-scaleIn" onClick={(e) => e.stopPropagation()}>

              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-500 text-3xl">
                    logout
                  </span>
                </div>
              </div>

              <h2 className="text-lg font-bold text-center mb-2">
                Logout?
              </h2>

              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to logout from your admin account?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmLogout}
                  className="flex-1 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default AdminDashboard;
