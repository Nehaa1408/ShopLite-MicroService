import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import adminAxios from "../../api/adminAxios";
import { toast } from "react-toastify";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";


const AdminTicketDetails = () => {

    const [reply, setReply] = useState("");
    const navigate = useNavigate();

    const { id } = useParams();
    const isActive = (path) => location.pathname === path;

    const [message, setMessage] = useState("");

    const showMessage = (msg) => {
        setMessage(msg);
    };


    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            setMessage("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [message]);
    const [ticket, setTicket] = useState(null);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const res = await adminAxios.get(`/tickets/${id}`);
                setTicket(res.data);
            } catch (err) {
                console.error("Ticket fetch error:", err);
            }
        };

        fetchTicket();
    }, [id]);


    if (!ticket) {
        return (
            <div className="p-10 text-center text-gray-500">
                Ticket not found
            </div>
        );
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
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


                {/* MAIN */}
                <main className="flex-1 ml-64 mt-16 p-8 space-y-6">
                    {message && (
                        <div className="mb-6 bg-white border border-gray-200 shadow-md rounded-xl p-4">
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                                <span className="text-green-600 font-bold">✔</span>
                                <span className="font-medium">{message}</span>
                            </div>
                        </div>
                    )}
                    {/* TOP */}
                    <div>
                        <p className="text-sm text-gray-500">
                            Support Tickets &gt;{" "}
                            <span className="text-blue-600">
                                #{ticket.id}
                            </span>
                        </p>

                        <h1 className="text-3xl font-black mt-2">
                            {ticket.subject}
                        </h1>
                    </div>

                    {/* GRID */}
                    <div className="grid lg:grid-cols-3 gap-6">

                        {/* LEFT */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* DESCRIPTION */}
                            <div className="bg-white p-6 rounded-xl shadow">
                                <p className="text-sm text-gray-500 mb-2">Initial Request</p>
                                <p>{ticket.message || "No message"}</p>
                            </div>

                            {/* CHAT */}
                            <div className="space-y-4">

                                <div className="bg-white p-4 rounded-xl shadow">
                                    <p className="text-sm font-bold">{ticket.user?.name || "User"}</p>
                                    <p className="text-sm mt-1">
                                        {ticket.message || "User message"}
                                    </p>
                                </div>

                                <div className="bg-blue-100 p-4 rounded-xl shadow">
                                    <p className="text-sm font-bold text-blue-600">Admin</p>
                                    <p className="text-sm mt-1">
                                        We are checking your issue.
                                    </p>
                                </div>

                            </div>

                            {/* REPLY BOX */}
                            <div className="bg-white p-6 rounded-xl shadow">
                                <textarea
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    placeholder="Write reply..."
                                    className="w-full border p-3 rounded-lg"
                                />

                                <button
                                    onClick={() => {
                                        if (!reply.trim()) {
                                            showMessage(" Reply cannot be empty");
                                            return;
                                        }

                                        showMessage(" Reply sent successfully");
                                        setReply("");
                                    }}
                                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Send
                                </button>
                                <button
                                    onClick={() => navigate("/admin/tickets")}
                                    className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
                                >
                                    ← Back to Tickets
                                </button>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="space-y-6">

                            {/* ACTIONS */}
                            <div className="bg-white p-6 rounded-xl shadow">
                                <h3 className="font-bold mb-4">Ticket Actions</h3>

                                <select
                                    className="w-full mb-3 p-2 border rounded"
                                    value={ticket.status}
                                    onChange={async (e) => {
                                        try {
                                            const value = e.target.value;

                                            const res = await adminAxios.put(
                                                `/tickets/${ticket.id}?status=${value}`
                                            );

                                            setTicket(res.data);
                                            showMessage(`✅ Status updated to ${value.replace("_", " ")}`);
                                        } catch (err) {
                                            console.error(err);
                                            showMessage("❌ Failed to update status");
                                        }
                                    }}
                                >
                                    <option value="OPEN">Open</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="RESOLVED">Resolved</option>
                                </select>

                                <button
                                    onClick={async () => {
                                        try {
                                            await adminAxios.put(`/tickets/${ticket.id}?status=RESOLVED`);
                                            setTicket({ ...ticket, status: "RESOLVED" });

                                            showMessage(" Ticket resolved successfully");
                                        } catch (err) {
                                            console.error(err);
                                            showMessage("❌ Failed to resolve ticket");
                                        }
                                    }}
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg"
                                >
                                    Resolve Ticket
                                </button>
                            </div>

                            {/* USER */}
                            <div className="bg-white p-6 rounded-xl shadow">
                                <h3 className="font-bold mb-2">Customer</h3>
                                <p>{ticket.user?.name || "User"}</p>
                                <p className="text-sm text-gray-500">
                                    Priority: Normal
                                </p>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminTicketDetails;