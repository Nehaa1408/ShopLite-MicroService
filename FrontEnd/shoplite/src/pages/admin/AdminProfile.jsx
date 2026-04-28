import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import adminAxios from "../../api/adminAxios";

const AdminProfile = () => {
    const [admin, setAdmin] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) => location.pathname.startsWith(path);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, statsRes] = await Promise.all([
                    adminAxios.get("/admin/profile"),
                    adminAxios.get("/orders/admin/stats"),
                ]);

                setAdmin(profileRes.data);
                setStats(statsRes.data);
            } catch (err) {
                console.error(err);

                if (err.response?.status === 401) {
                    sessionStorage.removeItem("adminToken");
                    navigate("/admin/login");
                } else {
                    setError("Failed to load profile");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        users: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await adminAxios.get("/orders/admin/stats");
                setStats(res.data);
            } catch (err) {
                console.error("Stats error:", err);
            }
        };

        fetchStats();
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await adminAxios.get("/admin/profile");
                console.log("PROFILE:", res.data);
                setAdmin(res.data);
            } catch (err) {
                console.error("Profile fetch error:", err);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <div className="p-10 text-center">Loading...</div>;
    }

    if (error) {
        return <div className="p-10 text-center text-red-500">{error}</div>;
    }

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        sessionStorage.removeItem("adminToken");
        navigate("/admin/login", { replace: true });
    };
    return (
        <div className="bg-background font-body-md text-on-background antialiased">

            {/* SideNavBar */}

            {/* SIDEBAR */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 px-4 py-6 hidden md:flex flex-col border-r border-outline-variant/15 bg-surface">
                {/* TOP BRAND */}
                <div className="mb-8 px-2">
                    <div className="flex items-center gap-3 p-2">
                        <div className="w-10 h-10 bg-primary-container/20 rounded-xl flex items-center justify-center text-primary">
                            <span
                                className="material-symbols-outlined transition-all duration-200 hover:scale-[1.02]"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                storefront
                            </span>
                        </div>

                        <div>
                            <p className="font-bold text-primary text-sm">ShopLite Admin</p>
                            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                                MANAGEMENT CONSOLE
                            </p>
                        </div>
                    </div>
                </div>

                {/* NAV */}
                <nav className="flex-1 space-y-1">

                    <div
                        onClick={() => navigate("/admin")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
  ${isActive("/admin/dashboard")
                                ? "bg-gradient-to-r from-primary to-primary-container text-white shadow-md"
                                : "text-slate-600 hover:bg-slate-100 hover:text-primary"
                            }`}
                    >
                        <span className="material-symbols-outlined">dashboard</span>
                        Dashboard
                    </div>



                    <div
                        onClick={() => navigate("/admin/products")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition
   ${isActive("/admin/products")
                                ? "bg-gradient-to-r from-primary to-primary-container text-white shadow-lg"
                                : "hover:bg-surface-container hover:text-primary"
                            }`}

                    >
                        <span className="material-symbols-outlined">inventory_2</span>
                        Manage Products
                    </div>
                    <div
                        onClick={() => navigate("/admin/add-product")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition
   ${isActive("/admin/add-product")
                                ? "bg-gradient-to-r from-primary to-primary-container text-white shadow-lg"
                                : "hover:bg-surface-container hover:text-primary"
                            }`}
                    >
                        <span className="material-symbols-outlined">add_box</span>
                        Add Product
                    </div>

                    <div
                        onClick={() => navigate("/manage-orders")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition
  ${isActive("/manage-orders")
                                ? "bg-gradient-to-r from-primary to-primary-container text-white shadow-lg"
                                : "hover:bg-surface-container hover:text-primary"
                            }`}
                    >
                        <span className="material-symbols-outlined">shopping_cart</span>
                        Manage Orders
                    </div>
                    {/* Tickets */}
                    <div
                        onClick={() => navigate("/admin/tickets")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition
   ${isActive("/admin/tickets")
                                ? "bg-gradient-to-r from-primary to-primary-container text-white shadow-lg"
                                : "hover:bg-surface-container hover:text-primary"
                            }`}
                    >
                        <span className="material-symbols-outlined">
                            confirmation_number
                        </span>
                        Tickets
                    </div>
                </nav>

                {/* BOTTOM */}
                <div>
                    <button className="w-full py-3 bg-primary/10 text-primary font-bold rounded-xl text-sm flex items-center justify-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-sm">analytics</span>
                        New Report
                    </button>

                    <div className="border-t border-outline-variant/10 pt-4">
                        <div
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                            <span className="material-symbols-outlined">logout</span>
                            Logout
                        </div>
                    </div>
                </div>
            </aside>

            {/* TopNavBar */}
            <header className="fixed top-0 right-0 left-64 z-30 h-16 flex justify-between items-center px-8 
bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-lg">

                {/* LEFT */}
                <div className="flex items-center gap-10">

                    {/* SEARCH */}
                    <div className="relative group">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition">
                            search
                        </span>

                        <input
                            className="pl-10 pr-4 py-2 bg-slate-100/70 rounded-xl w-64 text-sm outline-none 
        focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all duration-300 shadow-inner"
                            placeholder="Search dashboard..."
                        />
                    </div>

                    {/* NAV */}
                    <nav className="flex gap-6">
                        <span className="text-slate-500 hover:text-primary cursor-pointer transition">
                            Overview
                        </span>

                        <span className="relative text-primary font-semibold cursor-pointer">
                            Analytics
                            <span className="absolute left-0 bottom-[-6px] w-full h-[2px] bg-primary rounded-full"></span>
                        </span>
                    </nav>

                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-5">

                    {/* NOTIFICATIONS */}
                    <div className="relative cursor-pointer group">
                        <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition">
                            notifications
                        </span>

                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </div>

                    {/* HELP */}
                    <span className="material-symbols-outlined text-slate-500 hover:text-primary cursor-pointer transition">
                        help_outline
                    </span>

                    <div className="h-8 w-px bg-slate-200"></div>

                    {/* PROFILE */}
                    <div className="flex items-center gap-3 cursor-pointer group">

                        <div className="flex flex-col text-right">
                            <span className="font-semibold text-slate-700 group-hover:text-primary transition">
                                {admin?.name}
                            </span>
                            <span className="text-xs text-primary font-semibold">
                                {admin?.role}
                            </span>
                        </div>

                        <div className="relative">
                            <img
                                className="w-10 h-10 rounded-full border-2 border-primary-container object-cover 
          transition duration-300 group-hover:scale-110 group-hover:shadow-lg"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCd1GQl0Skd1Du9uQrB7MnFaly036-VaOOFqkGAKLN6eFIZ-9xIo9wcgUMp8_eYk1KPGEZeIDC1dGQNqxH6M3CDui_MFq5QC9f4G3WdQYxP2fIF1CwTL5XsxQS-9wqPam2OLkWZVaaH3dsKW8-u25Fyo9ysKO-COrMFf_Rgz33FZvZc53HgMtBMpUgl2hB50RDqjWNxTeyL_8KnBdMKFa1k0h-mFJZXaBEmfvghP758TlXyfoOWAqeO5I19eedh5I-A9qjvtebdTOw"
                                alt="admin"
                            />

                            {/* ONLINE DOT */}
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        </div>

                    </div>

                </div>
            </header>

            {/* Main */}
            <main className="ml-64 pt-20 px-8 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

                <div className="max-w-[1440px] mx-auto space-y-10 animate-fade-in">

                    {/* PROFILE HEADER */}
                    <section className="relative overflow-hidden rounded-3xl shadow-lg group">

                        <div
                            className="h-52 w-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 
        group-hover:scale-105 transition duration-500"
                            style={{
                                backgroundImage:
                                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC-OtAZDHSK_h6vfG0bZ0OhzqiXkmZ320Tcs16CWcTUyied9lYtTLdZzu9u_a23MLc1D66eCtwC7QZzrh6ocNbdDRdokp4TXHvLGVMN-wolZ4KTOH_FtUOiJ80-CMDncRqsd5Mz4pgRFdUwloLgk7QwSNSahbjuYIHOdr6T2f-NXp6Gnh_HIqfghpplTlZr0cLQwt7wTGThx_-Qt0OFpfer4DBQ_1hzGCWxjlGUmQ7VxA0Zz5zB3HVNowciaJDU7EsbiyL12PFKdCU')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        />

                        <div className="px-8 pb-8 flex items-end gap-6 -mt-12">

                            <img
                                className="w-32 h-32 rounded-full border-4 border-white shadow-xl 
          transition duration-300 group-hover:scale-110"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYdsP_9N_Pp2eiKMlHzvW5igA_Tp7PhRdvu76xwgfpByOh_rkn9Xw_BOqpvNZ9RjbqaGZvP3urv4j5wIRxkmVzT1mIdzkz9KI4oOyEoMyPNj0DzYlDcERTb6FqYJybkXNTf1RnMdmC8B7T2X9S1Lbm4QTVytzWSo8voVFNbLfD6ZsWGuz9V7GS7jBgqSdTP7n57beR66rntzyjS2_yq2wCxpYbvSvc03RO00xWjqHU2IkALkmMur5lpG-5wy2RgJys_gmj44yYy3s"
                                alt="profile"
                            />

                            <div>
                                <h2 className="text-3xl font-extrabold tracking-tight">
                                    {admin?.name}
                                </h2>
                                <p className="text-primary font-semibold text-sm">
                                    {admin?.role}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Admin • ShopLite System
                                </p>
                            </div>

                        </div>
                    </section>

                    {/* STATS */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {[
                            { label: "Total Orders", value: stats.orders, color: "text-blue-600" },
                            { label: "Products", value: stats.products, color: "text-purple-600" },
                            { label: "Users", value: stats.users, color: "text-green-600" },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="bg-white p-6 rounded-2xl shadow-md 
          hover:shadow-2xl transition-all duration-300 
          hover:-translate-y-2 cursor-pointer"
                            >
                                <p className="text-xs text-slate-400 uppercase tracking-wider">
                                    {item.label}
                                </p>

                                <h3 className={`text-4xl font-extrabold mt-3 ${item.color}`}>
                                    {item.value}
                                </h3>
                            </div>
                        ))}

                    </section>

                    {/* PERSONAL INFO */}
                    <section className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition">

                        <h3 className="text-xl font-bold mb-6 tracking-wide">
                            Personal Information
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">

                            {[
                                { label: "Full Name", value: admin.name },
                                { label: "Email", value: admin.email },
                                { label: "Role", value: admin.role },
                                { label: "Phone", value: admin.phone || "Not Provided" },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="bg-slate-50 p-5 rounded-xl 
            hover:bg-white hover:shadow-md transition duration-300"
                                >
                                    <p className="text-xs text-slate-400 mb-1">
                                        {item.label}
                                    </p>
                                    <p className="font-semibold text-lg">
                                        {item.value}
                                    </p>
                                </div>
                            ))}

                        </div>
                    </section>

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

    );
};

export default AdminProfile;