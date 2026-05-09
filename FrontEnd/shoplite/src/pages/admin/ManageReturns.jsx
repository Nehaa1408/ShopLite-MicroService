import { useEffect, useState } from "react";
import adminAxios from "../../api/adminAxios";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import AdminSidebar from "../../components/AdminSidebar";

const ManageReturns = () => {

    const navigate = useNavigate();

    const [selectedDelivery, setSelectedDelivery] = useState({});
    const [users, setUsers] = useState([]);
    const [returns, setReturns] = useState([]);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedReturn, setSelectedReturn] = useState(null);

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

    const indexOfLast =
        currentPage * ordersPerPage;

    const indexOfFirst =
        indexOfLast - ordersPerPage;

    const currentReturns =
        returns.slice(indexOfFirst, indexOfLast);

    const totalPages =
        Math.ceil(returns.length / ordersPerPage);

    // ================= REFRESH RETURNS =================
    const refreshReturns = async () => {

        const res =
            await adminAxios.get("/returns/admin");

        setReturns(res.data);

        setStats({
            pending: res.data.filter(
                (r) =>
                    r.status === "RETURN_REQUESTED"
            ).length,

            inTransit: res.data.filter(
                (r) =>
                    r.status ===
                    "PICKUP_PARTNER_ASSIGNED"
            ).length,

            completed: res.data.filter(
                (r) =>
                    r.status ===
                    "REFUND_PROCESSED"
            ).length,
        });

        return res.data;
    };

    // ================= INITIAL LOAD =================
    useEffect(() => {

        const fetchData = async () => {

            try {

                await refreshReturns();

                const usersRes =
                    await adminAxios.get(
                        "/users/delivery"
                    );

                setUsers(usersRes.data);

            } catch (err) {

                console.error(
                    "Error:",
                    err
                );
            }
        };

        fetchData();

    }, []);

    // ================= STATUS COLORS =================
    const getStatusStyle = (status) => {

        switch (status) {

            case "RETURN_REQUESTED":
                return "bg-blue-100 text-blue-600";

            case "RETURN_APPROVED":
                return "bg-purple-100 text-purple-600";

            case "PICKUP_PARTNER_ASSIGNED":
                return "bg-orange-100 text-orange-600";

            case "PICKUP_COMPLETED":
                return "bg-indigo-100 text-indigo-600";

            case "REFUND_PROCESSED":
                return "bg-green-100 text-green-600";

            case "RETURN_REJECTED":
                return "bg-red-100 text-red-600";

            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    // ================= FORMAT STATUS =================
    const formatStatus = (status) => {

        return status
            ?.replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (c) =>
                c.toUpperCase()
            );
    };

    // ================= LOGOUT =================
    const handleLogout = () => {

        sessionStorage.removeItem(
            "adminToken"
        );

        sessionStorage.removeItem(
            "adminRole"
        );

        navigate("/admin");
    };

    // ================= ASSIGN PICKUP =================
    const handleAssign = async (returnId) => {

        const deliveryId =
            selectedDelivery[returnId];

        if (!deliveryId) {

            setToast({
                show: true,
                message:
                    "Please select a pickup partner first",
                type: "error",
            });

            setTimeout(() => {

                setToast((prev) => ({
                    ...prev,
                    show: false,
                }));

            }, 2000);

            return;
        }

        try {

            await adminAxios.put(
                `/returns/admin/${returnId}/assign/${deliveryId}`
            );

            const data =
                await refreshReturns();

            const updatedReturn =
                data.find(
                    (r) =>
                        r.returnId ===
                        selectedReturn.returnId
                );

            setSelectedReturn(
                updatedReturn
            );

            setToast({
                show: true,
                message:
                    "Pickup partner assigned successfully.",
                type: "success",
            });

        } catch (err) {

            console.error(err);

            setToast({
                show: true,
                message:
                    "Failed to assign pickup partner",
                type: "error",
            });
        }

        setTimeout(() => {

            setToast((prev) => ({
                ...prev,
                show: false,
            }));

        }, 2000);
    };

    // ================= UPDATE RETURN STATUS =================
    const updateReturnStatus = async (
        returnId,
        status
    ) => {

        try {

            await adminAxios.put(
                `/returns/admin/${returnId}/status`,
                null,
                {
                    params: { status },
                }
            );

            const data =
                await refreshReturns();

            const updatedReturn =
                data.find(
                    (r) =>
                        r.returnId === returnId
                );

            setSelectedReturn(
                updatedReturn
            );

            setToast({
                show: true,
                message:
                    `Return updated to ${formatStatus(status)}`,
                type: "success",
            });

        } catch (err) {

            console.error(err);

            setToast({
                show: true,
                message:
                    "Failed to update return status",
                type: "error",
            });
        }

        setTimeout(() => {

            setToast((prev) => ({
                ...prev,
                show: false,
            }));

        }, 2000);
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
                    <h1 className="text-3xl font-extrabold mb-2">Manage Returns</h1>
                    <p className="text-on-surface-variant mb-6">
                        Track customer return requests and refund processing.
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
                                <span className="material-symbols-outlined">assignment_return</span>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    Pending Returns
                                </p>
                                <h2 className="text-3xl font-semibold text-gray-800">
                                    {stats.pending}
                                </h2>
                            </div>
                        </div>

                        {/* Pickup Scheduled */}
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
                                    Pickup Scheduled
                                </p>
                                <h2 className="text-3xl font-semibold text-gray-800">
                                    {stats.inTransit}
                                </h2>
                            </div>
                        </div>

                        {/* Refund Completed */}
                        <div className="group p-6 rounded-2xl bg-white/70 backdrop-blur-md 
  border border-white/40 shadow-md 
  transition-all duration-300 
  hover:shadow-[0_0_25px_rgba(34,197,94,0.25)] 
  hover:border-green-300 flex gap-4 items-center">

                            <div className="w-12 h-12 flex items-center justify-center rounded-xl 
    bg-green-50 text-green-600 
    group-hover:bg-green-100 group-hover:text-green-700 transition">
                                <span className="material-symbols-outlined">payments</span>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    Refund Processed
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
                                    <th className="p-4 text-left">Order</th>
                                    <th>Customer</th>
                                    <th>Requested Date</th>
                                    <th>Refund Amount</th>
                                    <th>Status</th>
                                    <th className="text-right pr-6">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentReturns.map((r, i) => {
                                    const refundAmount = r.refundAmount || 0;
                                    return (

                                        <tr
                                            key={i}
                                            className="border-t border-white/30 transition-all duration-300 hover:bg-white/70  hover:shadow-[0px_10px_30px_rgba(168,85,247,0.10)] hover:-translate-y-[2px]"
                                        >

                                            {/* ORDER ID */}
                                            <td className="p-5 font-black text-gray-800">
                                                {r.orderId}
                                            </td>

                                            {/* CUSTOMER */}
                                            <td>

                                                <div className="flex items-center gap-3">

                                                    <div
                                                        className="w-10 h-10 rounded-full  bg-gradient-to-br from-indigo-500 to-purple-500  text-white flex items-center justify-center  text-sm font-bold  shadow-md"
                                                    >
                                                        {r.customerName?.charAt(0) || "U"}
                                                    </div>

                                                    <div>

                                                        <p className="font-semibold text-gray-800">
                                                            {r.customerName || "User"}
                                                        </p>

                                                        <p className="text-xs text-gray-400">
                                                            {r.customerEmail || "No email"}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* DATE */}
                                            <td className="text-gray-600 font-medium">

                                                {new Date(
                                                    r.returnRequestedDate || r.orderDate
                                                ).toLocaleDateString(
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
                                                    className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 font-bold"
                                                >
                                                    ${refundAmount.toFixed(2)}
                                                </span>

                                            </td>

                                            {/* STATUS */}
                                            <td>

                                                <div className="flex flex-col gap-2">

                                                    <span
                                                        className={`w-fit px-4 py-1.5 rounded-full text-xs font-bold tracking-wide ${getStatusStyle(
                                                            r.status
                                                        )}`}
                                                    >
                                                        {formatStatus(r.status)}
                                                    </span>


                                                </div>

                                            </td>


                                            {/* ACTIONS */}
                                            <td className="p-5">

                                                <div className="flex justify-end">

                                                    <button
                                                        onClick={() => {
                                                            setSelectedReturn(r);
                                                            setShowViewModal(true);
                                                        }}
                                                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
                                                    >
                                                        View
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
                                {Math.min(indexOfLast, returns.length)} of {returns.length} returns
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
                {/* VIEW RETURN MODAL */}
                {showViewModal && selectedReturn && (

                    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

                        <div className="w-full max-w-3xl   max-h-[90vh]  overflow-y-auto rounded-[32px]  bg-white   shadow-[0_25px_80px_rgba(0,0,0,0.18)]   p-8" >

                            {/* HEADER */}
                            <div className="flex items-start justify-between mb-8">

                                <div>

                                    <p className="text-sm text-orange-500 font-semibold mb-2">
                                        RETURN DETAILS
                                    </p>
                                    <h2 className="text-3xl font-black text-gray-800">
                                        Return Request - Order #{selectedReturn.orderId}
                                    </h2>
                                </div>

                                <button
                                    onClick={() => {

                                        setShowViewModal(false);
                                        setSelectedReturn(null);

                                    }}
                                    className="w-11 h-11 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition-all duration-300"
                                >
                                    ✕
                                </button>

                            </div>

                            {/* STATUS */}
                            <div className="mb-8">

                                <span
                                    className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                                        selectedReturn.status || "RETURN_REQUESTED"
                                    )}`}
                                >
                                    {formatStatus(
                                        selectedReturn.status || "RETURN_REQUESTED"
                                    )}
                                </span>

                            </div>

                            {/* RETURN REASON */}
                            <div className="mb-8 rounded-3xl border border-orange-100 bg-orange-50 p-6">

                                <p className="text-xs uppercase tracking-wider text-orange-400 mb-4">
                                    Return Reason
                                </p>

                                <div className="flex items-center justify-between flex-wrap gap-4">

                                    <div>

                                        <h3 className="text-2xl font-black text-gray-800 mb-2">

                                            {selectedReturn.returnReason || "Damaged Product"}

                                        </h3>

                                        <p className="text-gray-600 max-w-2xl">

                                            {selectedReturn.returnReason ||
                                                "Customer requested return for selected items."}

                                        </p>
                                    </div>

                                    <div
                                        className="px-5 py-2 rounded-2xl
            bg-orange-100 text-orange-600
            font-bold text-sm"
                                    >
                                        High Priority
                                    </div>

                                </div>

                            </div>



                            {/* CUSTOMER + DELIVERY */}
                            <div className="grid md:grid-cols-2 gap-6 mb-8">

                                {/* CUSTOMER */}
                                <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6">

                                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-4">
                                        Customer Information
                                    </p>

                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {selectedReturn.customerName || "Customer"}
                                    </h3>

                                    <p className="text-gray-600">
                                        {selectedReturn.customerEmail || "No email"}
                                    </p>

                                </div>

                                {/* DELIVERY */}
                                <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-6">

                                    <p className="text-xs uppercase tracking-wider text-indigo-400 mb-4">
                                        Pickup Partner
                                    </p>

                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {selectedReturn.pickupPartnerName ||
                                            "Not Assigned"}

                                    </h3>
                                    <p className="text-gray-600">

                                        {selectedReturn.pickupPartnerName
                                            ? "Pickup partner assigned successfully"
                                            : "Pickup partner not assigned yet"}

                                    </p>
                                </div>

                            </div>

                            {/* ASSIGN PICKUP PARTNER */}
                            {selectedReturn.status === "RETURN_REQUESTED" &&
                                !selectedReturn.pickupPartnerName && (

                                    <div className="mt-6 rounded-3xl border border-orange-100 bg-orange-50 p-6">

                                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                                            Assign Pickup Partner
                                        </h3>

                                        <div className="flex gap-4">

                                            <select
                                                value={selectedDelivery[selectedReturn.returnId] || ""}
                                                onChange={(e) =>
                                                    setSelectedDelivery({
                                                        ...selectedDelivery,
                                                        [selectedReturn.returnId]: e.target.value,
                                                    })
                                                }
                                                className="flex-1 rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none"
                                            >
                                                <option value="">
                                                    Select Pickup Partner
                                                </option>

                                                {users.map((u) => (
                                                    <option key={u.id} value={u.id}>
                                                        {u.name}
                                                    </option>
                                                ))}
                                            </select>

                                            <button
                                                onClick={() => handleAssign(selectedReturn.returnId)}
                                                className="px-6 py-3 rounded-2xl bg-orange-500 text-white font-semibold"
                                            >
                                                Assign
                                            </button>

                                        </div>

                                    </div>

                                )}

                            {/* PRODUCTS */}
                            <div className="mb-8">

                                <h3 className="text-xl font-bold text-gray-800 mb-5">
                                    Returned Items
                                </h3>
                                <div className="space-y-4">

                                    {selectedReturn.items?.map((item, i) => (

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

                                                    <div className="flex items-center gap-3 mt-1">

                                                        <p className="text-sm text-gray-500">
                                                            Qty: {item.quantity}
                                                        </p>

                                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                        <p
                                                            className={`text-sm font-medium

    ${selectedReturn.status === "REFUND_PROCESSED"
                                                                    ? "text-green-600"
                                                                    : selectedReturn.status === "RETURN_REJECTED"
                                                                        ? "text-red-500"
                                                                        : selectedReturn.status === "PICKUP_COMPLETED"
                                                                            ? "text-indigo-600"
                                                                            : selectedReturn.status === "PICKUP_PARTNER_ASSIGNED"
                                                                                ? "text-orange-500"
                                                                                : "text-blue-500"
                                                                }`}
                                                        >

                                                            {formatStatus(
                                                                selectedReturn.status || "RETURN_REQUESTED"
                                                            )}
                                                        </p>
                                                    </div>

                                                </div>

                                            </div>

                                            <p className="font-bold text-indigo-600">
                                                ${item.price}
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
                                        ${selectedReturn.refundAmount?.toFixed(2)}
                                    </p>

                                </div>
                                {/* RETURN TIMELINE */}



                                <div className="space-y-5">
                                    {/* PICKUP */}
                                    {(selectedReturn.status === "PICKUP_PARTNER_ASSIGNED" ||
                                        selectedReturn.status === "PICKUP_COMPLETED" ||
                                        selectedReturn.status === "REFUND_PROCESSED") && (

                                            <div className="flex items-start gap-4">

                                                <div className="w-4 h-4 rounded-full bg-orange-500 mt-1"></div>

                                                <div>

                                                    <h4 className="font-bold text-gray-800">
                                                        Pickup Assigned
                                                    </h4>

                                                    <p className="text-sm text-gray-500">
                                                        Delivery partner assigned for pickup
                                                    </p>

                                                    {selectedReturn.status === "PICKUP_PARTNER_ASSIGNED" && (

                                                        <button
                                                            onClick={() =>
                                                                updateReturnStatus(
                                                                    selectedReturn.returnId,
                                                                    "PICKUP_COMPLETED"
                                                                )
                                                            }
                                                            className="mt-4 px-5 py-2 rounded-xl bg-indigo-500 text-white font-semibold"
                                                        >
                                                            Mark Pickup Completed
                                                        </button>

                                                    )}

                                                </div>

                                            </div>

                                        )}
                                    {/* RECEIVED */}
                                    {(selectedReturn.status === "PICKUP_COMPLETED" ||
                                        selectedReturn.status === "REFUND_PROCESSED") && (

                                            <div className="flex items-start gap-4">

                                                <div className="w-4 h-4 rounded-full bg-indigo-500 mt-1"></div>

                                                <div>
                                                    <h4 className="font-bold text-gray-800">
                                                        Pickup Completed
                                                    </h4>

                                                    <p className="text-sm text-gray-500">
                                                        Returned item received successfully
                                                    </p>

                                                </div>

                                            </div>
                                        )}

                                    {/* COMPLETED */}
                                    {selectedReturn.status === "REFUND_PROCESSED" && (

                                        <div className="flex items-start gap-4">

                                            <div className="w-4 h-4 rounded-full bg-green-500 mt-1"></div>

                                            <div>

                                                <h4 className="font-bold text-gray-800">
                                                    Refund Processed
                                                </h4>

                                                <p className="text-sm text-gray-500">
                                                    Refund processed successfully
                                                </p>

                                            </div>

                                        </div>
                                    )}

                                    {/* REJECTED */}
                                    {selectedReturn.status === "RETURN_REJECTED" && (

                                        <div className="flex items-start gap-4">

                                            <div className="w-4 h-4 rounded-full bg-red-500 mt-1"></div>

                                            <div>

                                                <h4 className="font-bold text-gray-800">
                                                    Return Rejected
                                                </h4>

                                                <p className="text-sm text-gray-500">
                                                    Return request was rejected
                                                </p>

                                            </div>

                                        </div>
                                    )}

                                </div>



                            </div>
                            {selectedReturn.status === "PICKUP_COMPLETED" && (

                                <div className="flex gap-4 mt-10">

                                    {/* APPROVE */}
                                    <button
                                        onClick={() =>
                                            updateReturnStatus(
                                                selectedReturn.returnId,
                                                "REFUND_PROCESSED"
                                            )
                                        }
                                        className="flex-1 relative overflow-hidden rounded-2xl px-6 py-4 bg-gradient-to-r from-[#7C6CFB] via-[#8B7CFF] to-[#A88BFF] text-white font-semibold tracking-wide shadow-[0_8px_25px_rgba(124,108,251,0.28)] transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(139,124,255,0.45)] active:scale-[0.98]"
                                    >

                                        <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition duration-300"></div>

                                        <div className="relative flex items-center justify-center gap-2">

                                            <span className="material-symbols-outlined text-[20px]">
                                                check_circle
                                            </span>

                                            <span>
                                                Approve Return
                                            </span>

                                        </div>

                                    </button>

                                    {/* REJECT */}
                                    <button
                                        onClick={() =>
                                            updateReturnStatus(
                                                selectedReturn.returnId,
                                                "RETURN_REJECTED"
                                            )
                                        }
                                        className="flex-1 relative overflow-hidden rounded-2xl px-6 py-4 bg-gradient-to-r from-[#F472B6] via-[#FB7185] to-[#FDA4AF] text-white font-semibold tracking-wide shadow-[0_8px_25px_rgba(244,114,182,0.28)] transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(251,113,133,0.40)] active:scale-[0.98]"
                                    >
                                        <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition duration-300"></div>

                                        <div className="relative flex items-center justify-center gap-2">

                                            <span className="material-symbols-outlined text-[20px]">
                                                cancel
                                            </span>

                                            <span>
                                                Reject Return
                                            </span>

                                        </div>

                                    </button>

                                </div>

                            )}
                        </div>

                    </div>
                )}
            </div>
            {/* TOAST */}
            {toast.show && (

                <div
                    className="fixed top-24 left-1/2 -translate-x-1/2  z-[9999]  min-w-[380px] px-5 py-4 rounded-3xl  bg-white/90  backdrop-blur-xl border border-white shadow-[0_10px_40px_rgba(0,0,0,0.12)] animate-[fadeIn_.25s_ease]"
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
                                    ? "Assignment Successful"
                                    : "Assignment Failed"}

                            </p>

                            <p className="text-sm text-gray-500">
                                {toast.message}
                            </p>

                        </div>

                    </div>

                </div>
            )}
        </div>
    );
};

export default ManageReturns;
