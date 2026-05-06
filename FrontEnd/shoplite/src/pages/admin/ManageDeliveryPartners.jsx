import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import AdminSidebar from "../../components/AdminSidebar";
import {
    getAllDeliveryPartners,
    getPendingDeliveryPartners
} from "../../services/deliveryApi";
const ManageDeliveryPartners = () => {

    const navigate = useNavigate();
    const [partners, setPartners] = useState([]);

    const [pendingPartners, setPendingPartners] = useState([]);

    const handleLogout = () => {
        sessionStorage.removeItem("adminToken");
        sessionStorage.removeItem("adminRole");
        navigate("/admin");
    };

    useEffect(() => {

        fetchPartners();

    }, []);

    const fetchPartners = async () => {

        try {

            const allPartners =
                await getAllDeliveryPartners();

            const pending =
                await getPendingDeliveryPartners();

            setPartners(allPartners);

            setPendingPartners(pending);

        } catch (error) {

            console.error(
                "Error fetching delivery partners",
                error
            );
        }
    };

    return (
        <div className="min-h-screen text-gray-800 relative overflow-hidden">

            {/* BACKGROUND */}
            <div className="fixed inset-0 -z-10 
            bg-gradient-to-br from-[#fdfcfb] via-[#f7f1ec] to-[#f3e8ff]" />

            <div className="fixed top-[-120px] left-[-120px] 
            w-[420px] h-[420px]
            bg-[#f5d0c5]/40 rounded-full blur-[140px] -z-10" />

            <div className="fixed bottom-[-140px] right-[-120px] 
            w-[420px] h-[420px]
            bg-[#e9d5ff]/40 rounded-full blur-[140px] -z-10" />

            <div className="relative z-10">

                <AdminHeader />

                {/* SIDEBAR */}
                <AdminSidebar handleLogout={handleLogout} />

                {/* MAIN */}
                <main className="md:ml-64 pt-24 px-6">

                    {/* TITLE */}
                    <div className="flex justify-between items-center mb-8">

                        <div>
                            <h1 className="text-3xl font-extrabold">
                                Manage Delivery Partners
                            </h1>

                            <p className="text-sm text-on-surface-variant">
                                Review and approve delivery partner verification requests.
                            </p>
                        </div>

                    </div>

                    {/* STATS */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">

                        {/* TOTAL */}
                        <div className="bg-white p-6 rounded-2xl 
                        shadow-[0px_10px_30px_rgba(0,0,0,0.06)] 
                        transition-all duration-300 
                        hover:shadow-[0px_20px_50px_rgba(99,102,241,0.25)] 
                        hover:-translate-y-1 
                        hover:ring-1 hover:ring-indigo-200">

                            <p className="text-xs text-on-surface-variant font-medium mb-2">
                                Total Delivery Partners
                            </p>

                            <p className="text-xl font-bold">
                                {partners.length}
                            </p>

                        </div>

                        {/* PENDING */}
                        <div className="bg-white p-6 rounded-2xl 
                        shadow-[0px_10px_30px_rgba(0,0,0,0.06)] 
                        transition-all duration-300 
                        hover:shadow-[0px_20px_50px_rgba(99,102,241,0.25)] 
                        hover:-translate-y-1 
                        hover:ring-1 hover:ring-indigo-200">

                            <p className="text-xs text-on-surface-variant font-medium mb-2">
                                Pending Verification
                            </p>

                            <p className="text-xl font-bold">
                                {pendingPartners.length}
                            </p>

                        </div>

                        {/* APPROVED */}
                        <div className="bg-white p-6 rounded-2xl 
                        shadow-[0px_10px_30px_rgba(0,0,0,0.06)] 
                        transition-all duration-300 
                        hover:shadow-[0px_20px_50px_rgba(99,102,241,0.25)] 
                        hover:-translate-y-1 
                        hover:ring-1 hover:ring-indigo-200">

                            <p className="text-xs text-on-surface-variant font-medium mb-2">
                                Approved Partners
                            </p>

                            <p className="text-xl font-bold">
                                {
                                    partners.filter(
                                        (partner) => partner.approved
                                    ).length
                                }
                            </p>

                        </div>

                        {/* REJECTED */}
                        <div className="bg-white p-6 rounded-2xl 
                        shadow-[0px_10px_30px_rgba(0,0,0,0.06)] 
                        transition-all duration-300 
                        hover:shadow-[0px_20px_50px_rgba(99,102,241,0.25)] 
                        hover:-translate-y-1 
                        hover:ring-1 hover:ring-indigo-200">

                            <p className="text-xs text-on-surface-variant font-medium mb-2">
                                Rejected Applications
                            </p>

                            <p className="text-xl font-bold">
                                {
                                    partners.filter(
                                        (partner) => partner.rejected
                                    ).length
                                }
                            </p>

                        </div>

                    </div>

                    {/* TABLE */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-2xl 
                    shadow-[0px_20px_50px_rgba(0,0,0,0.08)] 
                    border border-white/40 overflow-hidden">

                        <table className="w-full text-left">

                            {/* HEAD */}
                            <thead className="bg-white/60 backdrop-blur-md 
                            text-gray-500 text-xs uppercase tracking-wide">

                                <tr>

                                    <th className="p-4 text-xs">
                                        CONTACT
                                    </th>

                                    <th className="p-4 text-xs">
                                        VEHICLE
                                    </th>

                                    <th className="p-4 text-xs text-center">
                                        STATUS
                                    </th>

                                </tr>

                            </thead>

                            {/* BODY */}
                            <tbody>
                                {partners.map((partner) => (

                                    <tr
                                        key={partner.id}
                                        onClick={() =>
                                            navigate(
                                                `/admin/delivery-partner/${partner.id}`
                                            )
                                        }
                                        className="border-t border-white/30 
        transition-all duration-300 cursor-pointer
        hover:bg-white/60 
        hover:shadow-[0px_10px_30px_rgba(99,102,241,0.15)] 
        hover:-translate-y-[2px]"
                                    >

                                        {/* CONTACT */}
                                        <td className="p-4">

                                            <p className="font-semibold text-lg">
                                                {partner.phone || "No Phone"}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                {partner.user?.email}
                                            </p>

                                        </td>

                                        {/* VEHICLE */}
                                        <td className="p-4">

                                            <div className="flex items-center gap-3">

                                                <div className="w-12 h-12 rounded-xl 
                bg-indigo-50 flex items-center 
                justify-center text-indigo-500">

                                                    <span className="material-symbols-outlined">
                                                        electric_bike
                                                    </span>

                                                </div>

                                                <div>

                                                    <p className="font-semibold">
                                                        {partner.vehicleType || "Not Added"}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {partner.vehicleNumber || "No Number"}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>

                                        {/* STATUS */}
                                        <td className="p-4 text-center">

                                            {partner.approved ? (

                                                <span className="inline-flex items-center gap-2 
        px-3 py-1.5 rounded-full text-xs 
        font-semibold text-emerald-600 bg-emerald-100">

                                                    <span className="w-2 h-2 rounded-full 
            bg-emerald-500"></span>

                                                    Approved

                                                </span>

                                            ) : partner.rejected ? (

                                                <span className="inline-flex items-center gap-2 
        px-3 py-1.5 rounded-full text-xs 
        font-semibold text-red-600 bg-red-100">

                                                    <span className="w-2 h-2 rounded-full 
            bg-red-500"></span>

                                                    Rejected

                                                </span>

                                            ) : (

                                                <span className="inline-flex items-center gap-2 
        px-3 py-1.5 rounded-full text-xs 
        font-semibold text-orange-600 bg-orange-100">

                                                    <span className="w-2 h-2 rounded-full 
            bg-orange-500"></span>

                                                    Pending

                                                </span>

                                            )}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </main>

            </div>

        </div>
    );
};

export default ManageDeliveryPartners;