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
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

        hover:bg-white/70

        hover:shadow-[0px_10px_30px_rgba(168,85,247,0.10)]

        hover:-translate-y-[2px]"
                    >

                      {/* ORDER ID */}
                      <td className="p-5 font-black text-gray-800">
                        #{o.orderId}
                      </td>

                      {/* CUSTOMER */}
                      <td>

                        <div className="flex items-center gap-3">

                          <div
                            className="w-10 h-10 rounded-full

              bg-gradient-to-br
              from-indigo-500
              to-purple-500

              text-white

              flex items-center justify-center

              text-sm font-bold

              shadow-md"
                          >
                            {o.customerName?.charAt(0) || "U"}
                          </div>

                          <div>

                            <p className="font-semibold text-gray-800">
                              {o.customerName || "User"}
                            </p>

                            <p className="text-xs text-gray-400">
                              {o.customerEmail || "No email"}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* DATE */}
                      <td className="text-gray-600 font-medium">

                        {new Date(o.orderDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}

                      </td>

                      {/* TOTAL */}
                      <td>

                        <span
                          className="px-4 py-2 rounded-xl

            bg-indigo-50

            text-indigo-600

            font-bold"
                        >
                          ${total?.toFixed(2) || 0}
                        </span>

                      </td>

                      {/* STATUS */}
                      <td>

                        <div className="flex flex-col gap-2">

                          <span
                            className={`w-fit px-4 py-1.5 rounded-full text-xs font-bold tracking-wide ${getStatusStyle(
                              o.status
                            )}`}
                          >
                            {o.status}
                          </span>

                          {/* RATING PREVIEW */}
                          {o.deliveryRating && (

                            <div className="flex gap-[2px]">

                              {[1, 2, 3, 4, 5].map((star) => (

                                <span
                                  key={star}
                                  className={
                                    star <= o.deliveryRating
                                      ? "text-yellow-400 text-sm"
                                      : "text-gray-200 text-sm"
                                  }
                                >
                                  ★
                                </span>

                              ))}

                            </div>
                          )}

                        </div>

                      </td>

                      {/* ACTIONS */}
                      <td className="p-5">

                        <div className="flex items-center justify-end gap-4">

                          {/* DELIVERED → VIEW */}
                          {o.status === "DELIVERED" && (

                            <button
                              onClick={() => {
                                setSelectedOrder(o);
                                setShowViewModal(true);
                              }}
                              className="px-5 py-2 rounded-xl

                bg-gradient-to-r
                from-indigo-500
                to-purple-500

                text-white text-sm font-semibold

                shadow-md

                hover:shadow-xl

                hover:scale-[1.03]

                transition-all duration-300"
                            >
                              View Details
                            </button>
                          )}

                          {/* NOT DELIVERED */}
                          {o.status !== "DELIVERED" && (

                            <>

                              {/* DROPDOWN */}
                              <select
                                className="w-[220px]

                  px-4 py-2.5

                  rounded-2xl

                  text-sm

                  bg-white/90

                  border border-gray-200

                  shadow-sm

                  outline-none

                  focus:ring-2 focus:ring-indigo-200"
                                value={selectedDelivery[o.orderId] || ""}
                                onChange={(e) =>
                                  setSelectedDelivery({
                                    ...selectedDelivery,
                                    [o.orderId]: e.target.value,
                                  })
                                }
                              >

                                <option value="">
                                  Select Delivery Partner
                                </option>

                                {users.map((u) => (

                                  <option
                                    key={u.id}
                                    value={u.id}
                                  >
                                    {u.name} ({u.email})
                                  </option>

                                ))}

                              </select>

                              {/* ASSIGN */}
                              <button
                                onClick={() => handleAssign(o.orderId)}
                                className="px-5 py-2.5 rounded-2xl

                  bg-gradient-to-r
                  from-[#6366f1]
                  to-[#a855f7]

                  text-white text-sm font-semibold

                  shadow-md

                  hover:shadow-xl

                  hover:scale-[1.03]

                  transition-all duration-300"
                              >
                                Assign
                              </button>

                            </>
                          )}

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
        {/* VIEW ORDER MODAL */}
        {showViewModal && selectedOrder && (

          <div
            className="fixed inset-0 z-50

    bg-black/40 backdrop-blur-sm

    flex items-center justify-center

    p-4"
          >

            <div
              className="w-full max-w-3xl

      max-h-[90vh]

      overflow-y-auto

      rounded-[32px]

      bg-white

      shadow-[0_25px_80px_rgba(0,0,0,0.18)]

      p-8"
            >

              {/* HEADER */}
              <div className="flex items-start justify-between mb-8">

                <div>

                  <p className="text-sm text-indigo-500 font-semibold mb-2">
                    ORDER DETAILS
                  </p>

                  <h2 className="text-3xl font-black text-gray-800">
                    Order #{selectedOrder.orderId}
                  </h2>

                </div>

                <button
                  onClick={() => setShowViewModal(false)}
                  className="w-11 h-11 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition-all duration-300"
                >
                  ✕
                </button>

              </div>

              {/* STATUS */}
              <div className="mb-8">

                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status}
                </span>

              </div>

              {/* CUSTOMER + DELIVERY */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">

                {/* CUSTOMER */}
                <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6">

                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-4">
                    Customer Information
                  </p>

                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {selectedOrder.customerName || "Customer"}
                  </h3>

                  <p className="text-gray-600">
                    {selectedOrder.customerEmail || "No email"}
                  </p>

                </div>

                {/* DELIVERY */}
                <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-6">

                  <p className="text-xs uppercase tracking-wider text-indigo-400 mb-4">
                    Delivery Partner
                  </p>

                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {selectedOrder.deliveryAgentName || "Not Assigned"}
                  </h3>

                  <p className="text-gray-600">
                    {selectedOrder.deliveryAgentEmail || "No email"}
                  </p>

                </div>

              </div>

              {/* PRODUCTS */}
              <div className="mb-8">

                <h3 className="text-xl font-bold text-gray-800 mb-5">
                  Ordered Products
                </h3>

                <div className="space-y-4">

                  {selectedOrder.items?.map((item, i) => (

                    <div
                      key={i}
                      className="flex items-center justify-between

  rounded-2xl

  border border-gray-100

  bg-white

  p-4"
                    >

                      <div className="flex items-center gap-4">

                        <img
                          src={
                            item.image?.startsWith("http")
                              ? item.image
                              : `/products/${item.image}`
                          }
                          alt={item.productName}
                          className="w-16 h-16 rounded-2xl object-cover border border-gray-100"
                        />

                        <div>

                          <h4 className="font-semibold text-gray-800">
                            {item.productName}
                          </h4>

                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>

                        </div>

                      </div>

                      <p className="font-bold text-indigo-600">
                        ${item.price}
                      </p>

                    </div>
                  ))}

                </div>

              </div>

              {/* FEEDBACK */}
              {selectedOrder.deliveryRating && (

                <div
                  className="rounded-[28px]

          border border-yellow-100

          bg-gradient-to-br
          from-yellow-50
          via-white
          to-orange-50

          p-6"
                >

                  <div className="flex items-center justify-between mb-4">

                    <div>

                      <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                        Customer Feedback
                      </p>

                      <h3 className="text-2xl font-black text-gray-800">
                        Delivery Experience
                      </h3>

                    </div>

                    <div className="flex gap-1 text-3xl">

                      {[1, 2, 3, 4, 5].map((star) => (

                        <span
                          key={star}
                          className={
                            star <= selectedOrder.deliveryRating
                              ? "text-yellow-400"
                              : "text-gray-200"
                          }
                        >
                          ★
                        </span>

                      ))}

                    </div>

                  </div>

                  <div
                    className="rounded-2xl

            bg-white/80

            border border-white

            p-5

            text-gray-700"
                  >

                    {selectedOrder.deliveryFeedback ||
                      "Customer gave rating without written feedback."}

                  </div>

                </div>
              )}

            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
