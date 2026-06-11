import React, { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import AdminHeader from "../../components/AdminHeader";
import AdminSidebar from "../../components/AdminSidebar";
import {
    getDeliveryPartnerById,
    approveDeliveryPartner,
    rejectDeliveryPartner
} from "../../services/deliveryApi";

const ManageDeliveryPartnerDetails = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const [partner, setPartner] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const handleLogout = () => {
        sessionStorage.removeItem("adminToken");
        sessionStorage.removeItem("adminRole");
        navigate("/admin");
    };
    useEffect(() => {

        fetchPartner();

    }, [id]);

    const fetchPartner = async () => {

        try {

            const data =
                await getDeliveryPartnerById(id);

            setPartner(data);

        } catch (error) {

            console.error(
                "Error fetching partner",
                error
            );
        }
    };

    const handleApprove = async () => {

        try {

            setActionLoading(true);

            await approveDeliveryPartner(id);

            alert("Partner approved successfully");

            fetchPartner();

        } catch (error) {

            console.error(
                "Approval failed",
                error
            );

            alert("Approval failed");

        } finally {

            setActionLoading(false);
        }
    };

    const handleReject = async () => {

        try {

            setActionLoading(true);

            await rejectDeliveryPartner(id);

            alert("Application rejected successfully");

            fetchPartner();

        } catch (error) {

            console.error(
                "Reject failed",
                error
            );

            alert("Reject failed");

        } finally {

            setActionLoading(false);
        }
    };

    if (!partner) {

        return (
            <div className="p-10 text-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen text-gray-800 relative overflow-hidden">

            {/* BACKGROUND */}
            <div
                className="fixed inset-0 -z-10
                bg-gradient-to-br from-[#fdfcfb] via-[#f8f5ff] to-[#f5f7ff]"
            />

            <div
                className="fixed top-[-120px] left-[-120px]
                w-[340px] h-[340px]
                bg-[#f5d0c5]/20 rounded-full blur-[120px] -z-10"
            />

            <div
                className="fixed bottom-[-120px] right-[-120px]
                w-[340px] h-[340px]
                bg-[#c4b5fd]/20 rounded-full blur-[120px] -z-10"
            />

            <div className="relative z-10">

                <AdminHeader />
                <AdminSidebar handleLogout={handleLogout} />

                {/* MAIN */}
                <main className="md:ml-64 pt-20 px-5 pb-6">

                    {/* HEADER */}
                    <div className="flex items-center justify-between mb-5">

                        <div>

                            <h1 className="text-2xl font-bold text-slate-800">
                                Delivery Partner Details
                            </h1>

                            <p className="text-sm text-slate-500 mt-1">
                                Review submitted documents and verification details
                            </p>

                        </div>

                        <div
                            className={`px-3 py-1 rounded-full text-xs font-semibold
    ${partner.approved
                                    ? "bg-emerald-50 text-emerald-600"
                                    : partner.rejected
                                        ? "bg-red-50 text-red-600"
                                        : "bg-orange-50 text-orange-600"
                                }`}
                        >
                            {
                                partner.approved
                                    ? "Approved"
                                    : partner.rejected
                                        ? "Rejected"
                                        : "Pending Review"
                            }
                        </div>

                    </div>

                    {/* MAIN CARD */}
                    <div
                        className="bg-white/70 backdrop-blur-2xl
                        border border-white/50 rounded-[24px]
                        shadow-[0px_20px_60px_rgba(15,23,42,0.06)]
                        overflow-hidden"
                    >

                        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">

                            {/* LEFT SIDE */}
                            <div
                                className="p-5 border-r border-slate-100
                                bg-gradient-to-b from-white/30 to-white/5"
                            >

                                <div className="flex flex-col items-center">

                                    {/* IMAGE */}
                                    <img
                                        src={
                                            partner.profileImage ||
                                            "https://via.placeholder.com/300"
                                        }
                                        alt="partner"
                                        className="w-40 h-40 object-cover rounded-3xl shadow-md"
                                    />

                                    {/* NAME */}
                                    <h2 className="text-xl font-bold text-slate-800 mt-4 text-center">
                                        {partner.user?.name}
                                    </h2>

                                    {/* BUTTONS */}
                                    <div className="w-full mt-6">

                                        {!partner.approved && !partner.rejected ? (

                                            <div className="flex flex-col gap-3">

                                                <button
                                                    onClick={handleReject}
                                                    disabled={actionLoading}
                                                    className="
                w-full h-11 rounded-2xl
                bg-red-50 border border-red-100
                text-red-600 text-sm font-semibold
                hover:bg-red-100
                transition-all duration-300
                "
                                                >
                                                    {actionLoading
                                                        ? "Processing..."
                                                        : "Reject Application"}
                                                </button>

                                                <button
                                                    onClick={handleApprove}
                                                    disabled={actionLoading}
                                                    className="
                w-full h-11 rounded-2xl
                bg-emerald-50 border border-emerald-100
                text-emerald-700 text-sm font-semibold
                hover:bg-emerald-100
                transition-all duration-300
                "
                                                >
                                                    {actionLoading
                                                        ? "Processing..."
                                                        : "Approve Partner"}
                                                </button>

                                            </div>

                                        ) : partner.approved ? (

                                            <div
                                                className="
            bg-emerald-50
            border border-emerald-200
            rounded-2xl
            p-4
            text-center
            "
                                            >
                                                <p className="font-bold text-emerald-700">
                                                    ✅ Partner Approved
                                                </p>

                                                <p className="text-xs text-emerald-600 mt-1">
                                                    This delivery partner has been verified and approved.
                                                </p>
                                            </div>

                                        ) : (

                                            <div
                                                className="
            bg-red-50
            border border-red-200
            rounded-2xl
            p-4
            text-center
            "
                                            >
                                                <p className="font-bold text-red-700">
                                                    ❌ Application Rejected
                                                </p>

                                                <p className="text-xs text-red-600 mt-1">
                                                    This application has been rejected.
                                                </p>
                                            </div>

                                        )}

                                    </div>
                                </div>

                            </div>

                            {/* RIGHT SIDE */}
                            <div className="p-5">

                                {/* DETAILS */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                                    {[
                                        {
                                            label: "Phone Number",
                                            value: partner.phone || "Not Added",
                                        },
                                        {
                                            label: "Vehicle Type",
                                            value: partner.vehicleType || "Not Added",
                                        },
                                        {
                                            label: "Vehicle Number",
                                            value: partner.vehicleNumber || "Not Added",
                                        },
                                        {
                                            label: "License Number",
                                            value: partner.licenseNumber || "Not Added",
                                        },
                                        {
                                            label: "Aadhaar Number",
                                            value: partner.aadhaarNumber || "Not Added",
                                        },
                                    ].map((item, index) => (

                                        <div
                                            key={index}
                                            className="bg-white rounded-xl
                                            border border-slate-100
                                            p-3 shadow-sm"
                                        >

                                            <p
                                                className="text-[10px]
                                                uppercase tracking-wide
                                                text-slate-400 mb-1"
                                            >
                                                {item.label}
                                            </p>

                                            <p className="font-semibold text-sm text-slate-800">
                                                {item.value}
                                            </p>

                                        </div>

                                    ))}

                                </div>

                                {/* DOCUMENTS */}
                                <div>

                                    <h3 className="text-base font-bold text-slate-800 mb-4">
                                        Uploaded Documents
                                    </h3>

                                    <div className="grid md:grid-cols-3 gap-4">

                                        {[
                                            {
                                                name: "Driving License",
                                                image: partner.drivingLicenseImage
                                            },
                                            {
                                                name: "Aadhaar Card",
                                                image: partner.aadhaarImage
                                            },
                                            {
                                                name: "Vehicle RC",
                                                image: partner.vehicleRcImage
                                            }
                                        ].map((doc, index) => (

                                            <div
                                                key={index}
                                                className="bg-white border border-slate-100 rounded-2xl
                overflow-hidden shadow-sm hover:shadow-lg
                transition-all duration-300"
                                            >

                                                {/* IMAGE */}
                                                <div className="h-56 bg-slate-50 overflow-hidden">

                                                    {doc.image ? (

                                                        <img
                                                            src={doc.image}
                                                            alt={doc.name}
                                                            className="
            w-full
            h-full
            object-cover
            "
                                                        />

                                                    ) : (

                                                        <div className="h-full flex items-center justify-center">

                                                            <div className="text-center text-slate-400">

                                                                <span className="material-symbols-outlined text-5xl">
                                                                    image_not_supported
                                                                </span>

                                                                <p className="text-xs mt-2">
                                                                    Not Uploaded
                                                                </p>

                                                            </div>

                                                        </div>

                                                    )}

                                                </div>

                                                {/* DETAILS */}
                                                <div className="p-4">

                                                    <h4 className="font-semibold text-sm text-slate-800">
                                                        {doc.name}
                                                    </h4>

                                                    <p
                                                        className={`text-xs mt-1 ${doc.image
                                                            ? "text-emerald-600"
                                                            : "text-red-500"
                                                            }`}
                                                    >
                                                        {doc.image
                                                            ? "Uploaded Successfully"
                                                            : "Document Missing"}
                                                    </p>



                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </main>

            </div>

        </div>
    );
};

export default ManageDeliveryPartnerDetails;