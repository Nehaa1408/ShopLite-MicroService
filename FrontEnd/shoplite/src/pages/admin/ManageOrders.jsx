import { useEffect, useState } from "react";
import adminAxios from "../../api/adminAxios";
import { useLocation, useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import AdminSidebar from "../../components/AdminSidebar";

const ManageOrders = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDelivery, setSelectedDelivery] = useState({});
  const isActive = (path) => location.pathname === path;
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    inTransit: 0,
    completed: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;

  const currentOrders = orders.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await adminAxios.get("/orders/admin");
        const orders = ordersRes.data;

        setOrders(orders);

        const pending = orders.filter(
          (o) => o.status === "PLACED" || o.status === "CONFIRMED"
        ).length;

        const inTransit = orders.filter(
          (o) => o.status === "OUT_FOR_DELIVERY"
        ).length;

        const completed = orders.filter(
          (o) => o.status === "DELIVERED"
        ).length;

        setStats({
          pending,
          inTransit,
          completed,
        });

        const usersRes = await adminAxios.get("/users/delivery");
        setUsers(usersRes.data);

      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchData();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "PLACED":
        return "bg-blue-100 text-blue-600";
      case "SHIPPED":
        return "bg-yellow-100 text-yellow-600";
      case "DELIVERED":
        return "bg-green-100 text-green-600";
      case "CANCELLED":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminRole");
    navigate("/admin");
  };


  const handleAssign = async (orderId) => {
    const deliveryId = selectedDelivery[orderId];

    if (!deliveryId) {
      alert("Select delivery agent first");
      return;
    }

    try {
      await adminAxios.put(`/orders/admin/${orderId}/assign/${deliveryId}`);
      alert("Assigned successfully");

      // refresh orders
      const res = await adminAxios.get("/orders/admin");
      setOrders(res.data);


      const orders = res.data;

      const pending = orders.filter(
        (o) => o.status === "PLACED" || o.status === "CONFIRMED"
      ).length;

      const inTransit = orders.filter(
        (o) => o.status === "OUT_FOR_DELIVERY"
      ).length;

      const completed = orders.filter(
        (o) => o.status === "DELIVERED"
      ).length;

      setStats({
        pending,
        inTransit,
        completed,
      });

    } catch (err) {
      console.error(err);
      alert("Assignment failed");
    }
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
        <AdminHeader />

        {/* SIDEBAR */}
        <AdminSidebar handleLogout={handleLogout} />

        {/* HEADER */}
        <header className="md:ml-64 h-16 flex justify-between items-center px-6 bg-surface/80 backdrop-blur-xl shadow">
          <input
            placeholder="Search orders..."
            className="hidden md:block bg-surface-container-low px-4 py-2 rounded-lg outline-none"
          />

          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined">notifications</span>
            <span className="material-symbols-outlined">settings</span>

            {/* PROFILE ICON (fixed) */}
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-primary/10 text-primary">
              <span className="material-symbols-outlined">person</span>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="md:ml-64 p-6">
          {/* TITLE */}
          <h1 className="text-3xl font-extrabold mb-2">Manage Orders</h1>
          <p className="text-on-surface-variant mb-6">
            Track and update customer order statuses.
          </p>

          {/* STATS */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">

            {/* Pending */}
            <div className="group p-6 rounded-2xl bg-white/70 backdrop-blur-md 
  border border-white/40 shadow-md 
  transition-all duration-300 
  hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] 
  hover:border-blue-300 flex gap-4 items-center">

              <div className="w-12 h-12 flex items-center justify-center rounded-xl 
    bg-blue-50 text-blue-600 
    group-hover:bg-blue-100 group-hover:text-blue-700 transition">
                <span className="material-symbols-outlined">pending_actions</span>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Pending Orders
                </p>
                <h2 className="text-3xl font-semibold text-gray-800">
                  {stats.pending}
                </h2>
              </div>
            </div>

            {/* In Transit */}
            <div className="group p-6 rounded-2xl bg-white/70 backdrop-blur-md 
  border border-white/40 shadow-md 
  transition-all duration-300 
  hover:shadow-[0_0_25px_rgba(139,92,246,0.25)] 
  hover:border-purple-300 flex gap-4 items-center">

              <div className="w-12 h-12 flex items-center justify-center rounded-xl 
    bg-purple-50 text-purple-600 
    group-hover:bg-purple-100 group-hover:text-purple-700 transition">
                <span className="material-symbols-outlined">local_shipping</span>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  In Transit
                </p>
                <h2 className="text-3xl font-semibold text-gray-800">
                  {stats.inTransit}
                </h2>
              </div>
            </div>

            {/* Completed */}
            <div className="group p-6 rounded-2xl bg-white/70 backdrop-blur-md 
  border border-white/40 shadow-md 
  transition-all duration-300 
  hover:shadow-[0_0_25px_rgba(34,197,94,0.25)] 
  hover:border-green-300 flex gap-4 items-center">

              <div className="w-12 h-12 flex items-center justify-center rounded-xl 
    bg-green-50 text-green-600 
    group-hover:bg-green-100 group-hover:text-green-700 transition">
                <span className="material-symbols-outlined">check_circle</span>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Completed
                </p>
                <h2 className="text-3xl font-semibold text-gray-800">
                  {stats.completed}
                </h2>
              </div>
            </div>

          </div>

          {/* TABLE */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl 
shadow-[0px_20px_50px_rgba(0,0,0,0.08)] 
border border-white/40 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/60 backdrop-blur-md text-gray-500 text-xs uppercase tracking-wide">
                <tr className="border-t border-white/30 
transition-all duration-300
hover:bg-white/60 
hover:shadow-[0px_10px_30px_rgba(168,85,247,0.15)]
hover:-translate-y-[2px]">
                  <th className="p-4 text-left">Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th className="text-right pr-6">Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentOrders.map((o, i) => {
                  const total = o.items?.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  );

                  return (
                    <tr
                      key={i}
                      className="border-t border-white/30 
  transition-all duration-300
  hover:bg-white/60 
  hover:shadow-[0px_10px_30px_rgba(168,85,247,0.15)]
  hover:-translate-y-[2px]"
                    >
                      {/* ORDER ID */}
                      <td className="p-4 font-bold">#{o.orderId}</td>

                      {/* CUSTOMER */}
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-surface-container-highest rounded-full flex items-center justify-center text-xs font-bold text-primary">
                            {o.user?.name?.charAt(0) || "U"}
                          </div>
                          {o.user?.name || "User"}
                        </div>
                      </td>

                      {/* DATE */}
                      <td>
                        {new Date(o.orderDate).toLocaleDateString()}
                      </td>

                      {/* TOTAL */}
                      <td className="font-bold">
                        ₹{total?.toFixed(2) || 0}
                      </td>

                      {/* STATUS */}
                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                            o.status
                          )}`}
                        >
                          {o.status}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      {/* ACTIONS */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-3">

                          {/* View */}
                          <button className="text-indigo-600 text-sm font-medium hover:underline">
                            View
                          </button>

                          {/* Delivery Dropdown */}
                          <select
                            className="px-3 py-1.5 rounded-lg text-sm bg-white border"
                            value={selectedDelivery[o.orderId] || ""}
                            onChange={(e) =>
                              setSelectedDelivery({
                                ...selectedDelivery,
                                [o.orderId]: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Delivery</option>

                            {users.map((u) => (
                              <option key={u.id} value={u.id}>
                                {u.name} ({u.email})
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleAssign(o.orderId)}
                            className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white
  bg-gradient-to-r from-[#6366f1] to-[#a855f7]
  shadow-md hover:shadow-lg transition"
                          >
                            Assign
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* FOOTER */}
            <div className="p-4 flex justify-between text-xs text-on-surface-variant">
              <span>
                Showing {indexOfFirst + 1} -{" "}
                {Math.min(indexOfLast, orders.length)} of {orders.length} orders
              </span>

              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${currentPage === i + 1
                      ? "bg-primary text-white"
                      : "bg-gray-200"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageOrders;
