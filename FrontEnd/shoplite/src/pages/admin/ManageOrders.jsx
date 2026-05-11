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
  const [rejectReason, setRejectReason] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
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
      case "OUT_FOR_DELIVERY":
        return "bg-yellow-100 text-yellow-600";
      case "DELIVERED":
        return "bg-green-100 text-green-600";
      case "CANCELLED":
        return "bg-red-100 text-red-600";
      case "DELIVERY_FAILED":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPaymentStatusStyle = (status) => {

    switch (status) {

      case "SUCCESS":
        return "bg-green-100 text-green-700";

      case "FAILED":
        return "bg-red-100 text-red-700";

      case "PENDING_VERIFICATION":
        return "bg-yellow-100 text-yellow-700";

      case "COD_PENDING":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminRole");
    navigate("/admin");
  };

  const showToast = (message, type = "success") => {

    setToast({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setToast(prev => ({
        ...prev,
        show: false,
      }));
    }, 2500);
  };


  const handleAssign = async (orderId) => {
    const deliveryId = selectedDelivery[orderId];

    if (!deliveryId) {

      showToast("Please select a delivery partner first", "error");

      return;
    }
    try {
      await adminAxios.put(`/orders/admin/${orderId}/assign/${deliveryId}`);
      showToast(
        "Delivery assigned successfully. Out for delivery email sent to customer."
      );

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
      showToast("Failed to assign delivery partner", "error");
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
                          ${o.totalAmount?.toFixed(2)}
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

                        <div className="flex items-center justify-end">

                          <button
                            onClick={() => {
                              setSelectedOrder(o);
                              setRejectReason("");
                              setShowViewModal(true);
                            }}
                            className="
        px-5 py-2 rounded-xl

        bg-gradient-to-r
        from-indigo-500
        to-purple-500

        text-white text-sm font-semibold

        shadow-md

        hover:shadow-xl
        hover:scale-[1.03]

        transition-all duration-300
      "
                          >
                            View Details
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
        </main >
        {/* VIEW ORDER MODAL */}
        {
          showViewModal && selectedOrder && (

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

                {/* PAYMENT SECTION */}
                <div className="mb-8">

                  <div
                    className="
      rounded-[28px]
      border border-[#eadff5]
      bg-gradient-to-br
      from-[#fcf7ff]
      via-white
      to-[#f7f0ff]
      p-6
    "
                  >

                    <div className="flex items-center justify-between mb-6">

                      <div>

                        <p className="text-xs uppercase tracking-widest text-purple-400 mb-2">
                          Payment Information
                        </p>

                        <h3 className="text-2xl font-black text-gray-800">
                          {selectedOrder.paymentMethod}
                        </h3>

                      </div>

                      <span
                        className={`
    px-4 py-2
    rounded-full
    text-xs
    font-bold
    ${getPaymentStatusStyle(selectedOrder.paymentStatus)}
  `}
                      >
                        {selectedOrder.paymentStatus}
                      </span>

                    </div>

                    {/* SCREENSHOT */}
                    {selectedOrder.paymentScreenshot && (

                      <div className="mb-6">

                        <p className="text-sm font-semibold text-gray-500 mb-3">
                          Uploaded Payment Screenshot
                        </p>

                        <img
                          src={selectedOrder.paymentScreenshot}
                          alt="Payment Screenshot"
                          className="
            w-full
            max-w-md
            rounded-3xl
            border border-white
            shadow-[0_15px_40px_rgba(0,0,0,0.08)]
          "
                        />

                      </div>
                    )}

                    {/* VERIFY ACTIONS */}
                    {selectedOrder.paymentStatus === "PENDING_VERIFICATION" && (

                      <div className="space-y-4">

                        <textarea
                          placeholder="Reason (required if rejecting payment)"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          className="
            w-full
            min-h-[100px]
            rounded-2xl
            border border-gray-200
            bg-white
            p-4
            outline-none
          "
                        />

                        <div className="flex flex-wrap gap-4">

                          {/* APPROVE */}
                          <button
                            disabled={processingPayment}
                            onClick={async () => {

                              try {

                                setProcessingPayment(true);

                                await adminAxios.put(
                                  `/orders/admin/${selectedOrder.orderId}/verify-payment`
                                );

                                const res = await adminAxios.get("/orders/admin");

                                setOrders(res.data);

                                const updated = res.data.find(
                                  (o) => o.orderId === selectedOrder.orderId
                                );

                                setSelectedOrder(updated);

                                showToast("Payment approved successfully");

                              } catch (err) {

                                console.error(err);

                                showToast("Failed to approve payment", "error");

                              } finally {

                                setProcessingPayment(false);
                              }
                            }}
                            className="
              px-6 py-3 rounded-2xl

              bg-gradient-to-r
              from-emerald-500
              to-green-500

              text-white font-semibold

              shadow-lg

              hover:scale-[1.02]

              transition-all duration-300
            "
                          >
                            Approve Payment
                          </button>

                          {/* REJECT */}
                          <button
                            disabled={processingPayment}
                            onClick={async () => {

                              if (!rejectReason.trim()) {
                                alert("Please enter rejection reason");
                                return;
                              }

                              try {

                                setProcessingPayment(true);

                                await adminAxios.put(
                                  `/orders/admin/${selectedOrder.orderId}/reject-payment?reason=${rejectReason}`
                                );

                                const res = await adminAxios.get("/orders/admin");

                                setOrders(res.data);

                                const updated = res.data.find(
                                  (o) => o.orderId === selectedOrder.orderId
                                );

                                setSelectedOrder(updated);

                                showToast(
                                  "Payment rejected & order cancelled"
                                );

                              } catch (err) {

                                console.error(err);

                                showToast(
                                  "Failed to reject payment",
                                  "error"
                                );

                              } finally {

                                setProcessingPayment(false);
                              }
                            }}
                            className="
              px-6 py-3 rounded-2xl

              bg-gradient-to-r
              from-red-500
              to-rose-500

              text-white font-semibold

              shadow-lg

              hover:scale-[1.02]

              transition-all duration-300
            "
                          >
                            Reject Payment
                          </button>

                        </div>

                      </div>
                    )}

                  </div>

                </div>

                {/* CANCELLATION / FAILURE REASON */}
                {(selectedOrder.status === "DELIVERY_FAILED" ||
                  selectedOrder.status === "CANCELLED") &&
                  selectedOrder.cancelReason && (

                    <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5">

                      <p className="text-xs uppercase tracking-wider text-red-400 mb-2">
                        {selectedOrder.status === "CANCELLED"
                          ? "Customer Cancellation Reason"
                          : "Delivery Failure Reason"}
                      </p>

                      <p className="text-red-700 font-medium">
                        {selectedOrder.cancelReason}
                      </p>

                    </div>
                  )}

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

                {/* ASSIGN DELIVERY AFTER PAYMENT APPROVAL */}
                {(
                  (
                    selectedOrder.paymentStatus === "SUCCESS" ||
                    selectedOrder.paymentStatus === "COD_PENDING"
                  ) &&
                  !selectedOrder.deliveryAgentName &&
                  selectedOrder.status !== "CANCELLED"
                ) && (

                    <div className="mb-8 rounded-3xl border border-indigo-100 bg-indigo-50 p-6">

                      <p className="text-xs uppercase tracking-wider text-indigo-400 mb-4">
                        Assign Delivery Partner
                      </p>

                      <div className="flex flex-col md:flex-row gap-4">

                        <select
                          className="
          flex-1
          px-4 py-3
          rounded-2xl
          border border-gray-200
          bg-white
          outline-none
        "
                          value={selectedDelivery[selectedOrder.orderId] || ""}
                          onChange={(e) =>
                            setSelectedDelivery({
                              ...selectedDelivery,
                              [selectedOrder.orderId]: e.target.value,
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

                        <button
                          onClick={async () => {

                            await handleAssign(selectedOrder.orderId);

                            const res = await adminAxios.get("/orders/admin");

                            setOrders(res.data);

                            const updated = res.data.find(
                              (o) => o.orderId === selectedOrder.orderId
                            );

                            setSelectedOrder(updated);
                          }}
                          className="
          px-6 py-3 rounded-2xl

          bg-gradient-to-r
          from-indigo-600
          to-purple-600

          text-white font-semibold

          shadow-lg

          hover:scale-[1.02]

          transition-all duration-300
        "
                        >
                          Assign Delivery
                        </button>

                      </div>

                    </div>
                  )}

                {/* REASSIGN DELIVERY */}
                {selectedOrder.status === "DELIVERY_FAILED" && (

                  <div className="mb-8 rounded-3xl border border-indigo-100 bg-indigo-50 p-6">

                    <p className="text-xs uppercase tracking-wider text-indigo-400 mb-4">
                      Reassign Delivery Partner
                    </p>

                    <div className="flex flex-col md:flex-row gap-4">

                      <select
                        className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 bg-white outline-none"
                        value={selectedDelivery[selectedOrder.orderId] || ""}
                        onChange={(e) =>
                          setSelectedDelivery({
                            ...selectedDelivery,
                            [selectedOrder.orderId]: e.target.value,
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

                      <button
                        onClick={() => handleAssign(selectedOrder.orderId)}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold"
                      >
                        Reassign Delivery
                      </button>

                    </div>

                  </div>
                )}

                {/* PRODUCTS */}
                <div className="mb-8">

                  <h3 className="text-xl font-bold text-gray-800 mb-5">
                    Ordered Products
                  </h3>

                  <div className="space-y-4">

                    {selectedOrder.items?.map((item, i) => (

                      <div
                        key={i}
                        className="flex items-center justify-between rounded-2xl  border border-gray-100  bg-white  p-4"
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
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>

                      </div>
                    ))}

                  </div>
                  {/* FINAL TOTAL */}
                  <div
                    className="mt-6  flex items-center justify-between  rounded-2xl bg-indigo-50 border border-indigo-100 px-6 py-5"
                  >

                    <p className="text-lg font-semibold text-gray-700">
                      Final Total
                    </p>

                    <p className="text-3xl font-black text-indigo-600">
                      ${selectedOrder.totalAmount?.toFixed(2)}
                    </p>

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
          )
        }
      </div >
      {/* TOAST */}
      {
        toast.show && (

          <div
            className="fixed top-24 left-1/2 -translate-x-1/2

    z-[9999]

    min-w-[380px]

    px-5 py-4

    rounded-3xl

    bg-white/90

    backdrop-blur-xl

    border border-white

    shadow-[0_10px_40px_rgba(0,0,0,0.12)]

    animate-[fadeIn_.25s_ease]"
          >

            <div className="flex items-center gap-4">

              {/* ICON */}
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center

        ${toast.type === "success"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-red-100 text-red-500"
                  }`}
              >

                <span className="text-xl">
                  {toast.type === "success" ? "✨" : "⚠️"}
                </span>

              </div>

              {/* MESSAGE */}
              <div className="flex flex-col">

                <p
                  className={`font-bold text-sm

          ${toast.type === "success"
                      ? "text-emerald-600"
                      : "text-red-500"
                    }`}
                >

                  {toast.type === "success"
                    ? "Success"
                    : "Error"}

                </p>

                <p className="text-sm text-gray-500">
                  {toast.message}
                </p>

              </div>

            </div>

          </div>
        )
      }
    </div >
  );
};

export default ManageOrders;
