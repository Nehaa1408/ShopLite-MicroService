import React, { useEffect, useState, useCallback } from "react";
import DeliveryLayout from "../../components/delivery/DeliveryLayout";
import OrderCard from "../../components/delivery/OrderCard";
import {
    getDeliveryOrders,
    sendDeliveryOtp,
    verifyDeliveryOtp,
    markDeliveryFailed,
    getAssignedReturnPickups,
    sendReturnPickupOtp,
    verifyReturnPickupOtp
} from "../../services/deliveryApi";

const DeliveryDashboard = () => {

    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedFlowType, setSelectedFlowType] =
        useState("DELIVERY");
    const [otp, setOtp] = useState("");
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [loadingOtp, setLoadingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success"
    });

    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [issueOrderId, setIssueOrderId] = useState(null);
    const [selectedReason, setSelectedReason] = useState("");
    const [otherReason, setOtherReason] = useState("");

    const fetchOrders = useCallback(async () => {

        try {

            const deliveryOrders =
                await getDeliveryOrders();

            const returnOrders =
                await getAssignedReturnPickups();

            // DELIVERY ORDERS
            const formattedDeliveries =
                (Array.isArray(deliveryOrders)
                    ? deliveryOrders
                    : []
                ).map(order => ({
                    ...order,
                    flowType: "DELIVERY"
                }));

            // RETURN PICKUPS
            const formattedReturns =
                (Array.isArray(returnOrders)
                    ? returnOrders
                    : []
                )

                    // REMOVE COMPLETED PICKUPS
                    .filter(order =>
                        order.status !== "PICKUP_COMPLETED"
                    )

                    .map(order => ({
                        ...order,
                        flowType: "RETURN_PICKUP"
                    }));

            setOrders([
                ...formattedDeliveries,
                ...formattedReturns
            ]);

        } catch (err) {

            console.error(
                "Error fetching orders",
                err
            );

            setOrders([]);
        }

    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    useEffect(() => {

        let interval;

        if (showOtpModal && resendTimer > 0) {

            interval = setInterval(() => {

                setResendTimer(prev => prev - 1);

            }, 1000);
        }

        if (resendTimer === 0) {

            setCanResend(true);
        }

        return () => clearInterval(interval);

    }, [showOtpModal, resendTimer]);


    // SEND OTP
    const handleSendOtp = async (
        id,
        flowType
    ) => {

        try {

            setLoadingOtp(true);

            // DELIVERY
            if (flowType === "DELIVERY") {

                await sendDeliveryOtp(id);

            } else {

                // RETURN PICKUP
                await sendReturnPickupOtp(id);
            }

            setSelectedOrderId(id);
            setSelectedFlowType(flowType);

            setShowOtpModal(true);

            setResendTimer(60);

            setCanResend(false);

            setToast({
                show: true,
                message:
                    flowType === "DELIVERY"
                        ? "Delivery OTP sent successfully"
                        : "Pickup OTP sent successfully",
                type: "success"
            });

        } catch (err) {

            console.error(
                "OTP send failed",
                err
            );

            setToast({
                show: true,
                message: "Failed to send OTP",
                type: "error"
            });

        } finally {

            setLoadingOtp(false);

            setTimeout(() => {

                setToast(prev => ({
                    ...prev,
                    show: false
                }));

            }, 3000);
        }
    };

    // VERIFY OTP
    const handleVerifyOtp = async () => {

        try {

            setVerifyingOtp(true);

            // DELIVERY OTP VERIFY
            if (selectedFlowType === "DELIVERY") {

                await verifyDeliveryOtp(
                    selectedOrderId,
                    otp
                );

            } else {

                // RETURN PICKUP OTP VERIFY
                await verifyReturnPickupOtp(
                    selectedOrderId,
                    otp
                );
            }

            setToast({
                show: true,
                message:
                    selectedFlowType === "DELIVERY"
                        ? "Order delivered successfully"
                        : "Return pickup completed successfully",
                type: "success"
            });

            setShowOtpModal(false);

            setOtp("");

            fetchOrders();

        } catch (err) {

            console.error(
                "OTP verification failed",
                err
            );

            setToast({
                show: true,
                message: "Invalid or expired OTP",
                type: "error"
            });

        } finally {

            setVerifyingOtp(false);

            setTimeout(() => {

                setToast(prev => ({
                    ...prev,
                    show: false
                }));

            }, 3000);
        }
    };
    const filteredOrders = orders.filter((o) =>
        o.orderId.toString().includes(search)
    );

    const active = orders.filter(o => o.status === "OUT_FOR_DELIVERY").length;

    return (
        <DeliveryLayout>

            {/* HERO */}
            <div className="mb-10">
                <h1 className="text-4xl font-bold mb-2">
                    Welcome back 👋
                </h1>
                <p className="text-gray-500">
                    You have <span className="text-purple-600 font-semibold">{active} active deliveries</span>
                </p>
            </div>

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">

                <h3 className="text-xl font-bold text-gray-800">
                    Active Deliveries
                </h3>

                <div className="relative w-full md:w-80">

                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        search
                    </span>

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search order ID..."
                        className="w-full pl-12 pr-4 py-3 rounded-2xl 
                        bg-white/70 backdrop-blur-lg border border-white/40
                        text-sm text-gray-700 outline-none
                        focus:ring-2 focus:ring-purple-300
                        hover:border-purple-200"
                    />
                </div>

            </div>

            {/* CARDS */}
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10">

                {filteredOrders.length === 0 ? (
                    <p className="text-gray-500">No matching orders</p>
                ) : (
                    filteredOrders.map((order) => (
                        <OrderCard
                            key={order.orderId}
                            order={order}
                            onSendOtp={(id, flowType) =>
                                handleSendOtp(id, flowType)
                            }
                            onUnableToDeliver={(id) => {

                                setIssueOrderId(id);

                                setShowIssueModal(true);
                            }}
                        />
                    ))
                )}

            </div>
            {/* OTP MODAL */}
            {showOtpModal && (

                <div
                    className="fixed inset-0 z-50

        bg-black/40 backdrop-blur-sm

        flex items-center justify-center

        px-4"
                >

                    <div
                        className="w-full max-w-md

            bg-white rounded-[28px]

            p-7 shadow-2xl"
                    >

                        {/* TITLE */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Verify Delivery OTP
                        </h2>

                        <p className="text-sm text-gray-500 mb-6">
                            Ask customer for the OTP sent to their email.
                        </p>

                        {/* INPUT */}
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 6-digit OTP"
                            className="w-full px-5 py-4 rounded-2xl

                border border-gray-200

                outline-none

                focus:ring-2 focus:ring-indigo-300

                text-lg tracking-[6px]

                text-center font-semibold

                mb-6"
                        />
                        {/* RESEND OTP */}
                        <div className="flex items-center justify-between mb-5">

                            <p className="text-sm text-gray-500">
                                Didn't receive OTP?
                            </p>

                            <button
                                disabled={!canResend || loadingOtp}
                                onClick={() => handleSendOtp(selectedOrderId)}
                                className={`text-sm font-semibold

        transition-all

        ${canResend
                                        ? "text-indigo-600 hover:text-indigo-700"
                                        : "text-gray-400 cursor-not-allowed"
                                    }`}
                            >

                                {loadingOtp
                                    ? "Sending..."
                                    : canResend
                                        ? "Resend OTP"
                                        : `Resend in ${resendTimer}s`
                                }

                            </button>

                        </div>
                        {/* BUTTONS */}
                        <div className="flex gap-3">

                            {/* CANCEL */}
                            <button
                                onClick={() => {
                                    setShowOtpModal(false);
                                    setOtp("");
                                }}
                                className="flex-1 py-3 rounded-2xl

                    border border-gray-200

                    text-gray-600 font-semibold

                    hover:bg-gray-50

                    transition-all"
                            >
                                Cancel
                            </button>

                            {/* VERIFY */}
                            <button
                                onClick={handleVerifyOtp}
                                className="flex-1 py-3 rounded-2xl

                    bg-gradient-to-b
                    from-[#7C83FF]
                    to-[#6366F1]

                    text-white font-semibold

                    shadow-lg

                    hover:opacity-95

                    transition-all"
                            >
                                Verify Delivery
                            </button>

                        </div>

                    </div>

                </div>
            )}
            {/* ISSUE MODAL */}
            {showIssueModal && (

                <div
                    className="fixed inset-0 z-50

        bg-black/40 backdrop-blur-sm

        flex items-center justify-center

        px-4"
                >

                    <div
                        className="w-full max-w-lg

            bg-white/80 backdrop-blur-2xl

            border border-white/30

            rounded-[30px]

            p-7 shadow-2xl"
                    >

                        {/* TITLE */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Unable to Deliver
                        </h2>

                        <p className="text-sm text-gray-500 mb-6">
                            Select the reason for delivery failure.
                        </p>

                        {/* REASONS */}
                        <div className="space-y-3 mb-6">

                            {[
                                "Customer unreachable",
                                "Wrong address",
                                "OTP not received",
                                "Fake email",
                                "Customer unavailable",
                                "Other"
                            ].map((reason) => (

                                <label
                                    key={reason}
                                    className={`flex items-center gap-3

                        px-4 py-3 rounded-2xl

                        border cursor-pointer

                        transition-all duration-300

                        ${selectedReason === reason
                                            ? "border-red-400 bg-red-50"
                                            : "border-gray-200 bg-white/60"
                                        }`}
                                >

                                    <input
                                        type="radio"
                                        name="deliveryIssue"
                                        value={reason}
                                        checked={selectedReason === reason}
                                        onChange={(e) =>
                                            setSelectedReason(e.target.value)
                                        }
                                    />

                                    <span className="text-sm font-medium text-gray-700">
                                        {reason}
                                    </span>

                                </label>
                            ))}

                        </div>

                        {/* OTHER TEXT */}
                        {selectedReason === "Other" && (

                            <textarea
                                value={otherReason}
                                onChange={(e) =>
                                    setOtherReason(e.target.value)
                                }
                                placeholder="Enter issue details..."
                                className="w-full h-28 resize-none

                    rounded-2xl

                    border border-gray-200

                    p-4 text-sm

                    outline-none

                    focus:ring-2 focus:ring-red-200

                    mb-6"
                            />
                        )}

                        {/* BUTTONS */}
                        <div className="flex gap-3">

                            {/* CANCEL */}
                            <button
                                onClick={() => {
                                    setShowIssueModal(false);
                                    setSelectedReason("");
                                    setOtherReason("");
                                }}
                                className="flex-1 py-3 rounded-2xl

                    border border-gray-200

                    text-gray-600 font-semibold

                    hover:bg-gray-50

                    transition-all"
                            >
                                Cancel
                            </button>

                            {/* SUBMIT */}
                            <button
                                onClick={async () => {

                                    try {

                                        const finalReason =
                                            selectedReason === "Other"
                                                ? otherReason
                                                : selectedReason;

                                        await markDeliveryFailed(
                                            issueOrderId,
                                            finalReason
                                        );

                                        fetchOrders();

                                        setShowIssueModal(false);

                                        setSelectedReason("");

                                        setOtherReason("");

                                        setToast({
                                            show: true,
                                            message: "Delivery issue submitted",
                                            type: "error"
                                        });

                                    } catch (err) {

                                        console.error(err);

                                        setToast({
                                            show: true,
                                            message: "Failed to submit issue",
                                            type: "error"
                                        });
                                    }

                                    setTimeout(() => {
                                        setToast(prev => ({
                                            ...prev,
                                            show: false
                                        }));
                                    }, 3000);
                                }}
                                disabled={!selectedReason}
                                className={`flex-1 py-3 rounded-2xl

text-white font-semibold

transition-all duration-300

${selectedReason
                                        ? `
bg-gradient-to-br
from-red-500
to-rose-500

shadow-[0_10px_30px_rgba(239,68,68,0.25)]
`
                                        : "bg-gray-300 cursor-not-allowed"
                                    }`}
                            >
                                Submit Issue
                            </button>

                        </div>

                    </div>

                </div>
            )}
            {/* TOAST */}
            {toast.show && (

                <div
                    className="fixed top-24 left-[58%]
        -translate-x-1/2

        z-[9999]

        w-fit
        min-w-[320px]
        max-w-[420px]

        px-5 py-3

        rounded-2xl

        shadow-[0_20px_50px_rgba(0,0,0,0.18)]

        backdrop-blur-2xl

        border border-white/20

        text-white font-medium

        animate-[fadeIn_.25s_ease]"
                    style={{
                        background:
                            toast.type === "success"
                                ? "rgba(16,185,129,0.92)"
                                : "rgba(239,68,68,0.92)"
                    }}
                >

                    <div className="flex items-center gap-3">

                        <span className="material-symbols-outlined text-[20px]">

                            {toast.type === "success"
                                ? "check_circle"
                                : "error"}

                        </span>

                        <span className="text-[15px] leading-none">
                            {toast.message}
                        </span>

                    </div>

                </div>
            )}
        </DeliveryLayout>
    );
};

export default DeliveryDashboard;