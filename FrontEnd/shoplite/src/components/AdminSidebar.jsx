import { useNavigate, useLocation } from "react-router-dom";

export default function AdminSidebar({ handleLogout }) {
    const navigate = useNavigate();
    const location = useLocation();

    // single function (clean)
    const isActive = (path) => location.pathname.startsWith(path);

    // reusable styles
    const ACTIVE =
        "bg-gradient-to-r from-[#6366f1]/20 to-[#a855f7]/20 text-indigo-600 shadow-inner border border-white/40";

    const INACTIVE =
        "text-gray-500 hover:bg-white/40 hover:shadow-md hover:ring-2";

    return (
        <aside className="fixed left-0 top-20 bottom-0 w-64 p-4 hidden md:flex flex-col
    bg-gradient-to-b from-white/40 to-white/10 
    backdrop-blur-xl border-r border-white/20
    shadow-[4px_0_40px_rgba(0,0,0,0.05)]">

            <nav className="flex-1 space-y-3 mt-4">

                {/* Dashboard (EXACT MATCH ONLY) */}
                <div
                    onClick={() => navigate("/admin")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer
          ${location.pathname === "/admin"
                            ? ACTIVE
                            : INACTIVE + " hover:ring-purple-200"
                        }`}
                >
                    <span className="material-symbols-outlined">dashboard</span>
                    Dashboard
                </div>

                {/* Manage Products */}
                <div
                    onClick={() => navigate("/admin/products")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer
          ${isActive("/admin/products")
                            ? ACTIVE
                            : INACTIVE + " hover:ring-purple-200"
                        }`}
                >
                    <span className="material-symbols-outlined">inventory_2</span>
                    Manage Products
                </div>

                {/* Add Product */}
                <div
                    onClick={() => navigate("/admin/add-product")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer
          ${isActive("/admin/add-product")
                            ? ACTIVE
                            : INACTIVE + " hover:ring-blue-200"
                        }`}
                >
                    <span className="material-symbols-outlined">add_box</span>
                    Add Product
                </div>

                {/* Orders */}
                <div
                    onClick={() => navigate("/manage-orders")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer
          ${isActive("/manage-orders")
                            ? ACTIVE
                            : INACTIVE + " hover:ring-indigo-200"
                        }`}
                >
                    <span className="material-symbols-outlined">shopping_cart</span>
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

                {/* Tickets */}
                <div
                    onClick={() => navigate("/admin/tickets")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer
          ${isActive("/admin/tickets")
                            ? ACTIVE
                            : INACTIVE + " hover:ring-pink-200"
                        }`}
                >
                    <span className="material-symbols-outlined">confirmation_number</span>
                    Tickets
                </div>

            </nav>

            {/* Logout */}
            <div className="pt-4 border-t border-white/40">
                <div
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-500 
          hover:bg-red-50 rounded-2xl cursor-pointer transition-all duration-300"
                >
                    <span className="material-symbols-outlined">logout</span>
                    Logout
                </div>
            </div>

        </aside>
    );
}