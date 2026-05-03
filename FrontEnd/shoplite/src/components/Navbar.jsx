import React from "react";
import { MdSearch, MdShoppingCart } from "react-icons/md";

const Navbar = ({
    onNavigate,
    location,
    cart,
    searchTerm,
    setSearchTerm,
    setCurrentPage,
    handleProfileClick,
    onCartClick
}) => {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/60 border-b border-white/40">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">

                {/* LOGO */}
                <div
                    onClick={() => onNavigate("/")}
                    className="text-2xl font-black tracking-tight text-indigo-600 cursor-pointer"
                >
                    ShopLite
                </div>

                {/* NAV ITEMS */}
                <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-600">
                    {[
                        { name: "Home", path: "/" },
                        { name: "Categories", path: "/categories" },
                        { name: "Brands", path: "/brand/aurel" },
                        { name: "Deals", path: "/top-deals" },
                        { name: "Orders", path: "/orders" },
                        { name: "Tickets", path: "/tickets", secondary: true }
                    ].map((item, i) => {
                        const isActive =
                            item.name === "Brands"
                                ? location.pathname.startsWith("/brand")
                                : location.pathname === item.path;

                        return (
                            <button
                                key={i}
                                onClick={() => onNavigate(item.path)}
                                className={`relative transition ${isActive
                                    ? "text-indigo-600"
                                    : item.secondary
                                        ? "text-gray-400 hover:text-indigo-500"
                                        : "text-gray-600 hover:text-indigo-600"
                                    }`}
                            >
                                {item.name}

                                <span
                                    className={`absolute left-0 -bottom-1 h-[2px] bg-indigo-500 transition-all duration-300 ${isActive ? "w-full" : "w-0"
                                        }`}
                                />
                            </button>
                        );
                    })}
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-4">

                    {/* SEARCH */}
                    <div className="hidden md:flex items-center bg-white/80 backdrop-blur-md border border-gray-200 rounded-full px-4 py-2 w-56">
                        <MdSearch className="text-gray-500 mr-2" size={18} />
                        <input
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search..."
                            className="bg-transparent outline-none text-sm w-full"
                        />
                    </div>

                    {/* CART */}
                    <button
                        onClick={onCartClick}
                        className="relative p-2 rounded-full hover:bg-gray-100 transition"
                    >
                        <MdShoppingCart size={22} />

                        {cart.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                {cart.length}
                            </span>
                        )}
                    </button>

                    {/* PROFILE */}
                    <button onClick={handleProfileClick}>
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-indigo-200 to-purple-200 shadow-md">
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgcj9i-xOULjXbKX_gAzqP3OP_0GxiEBwAFPjURfiNHeiove_rW5LSqbTrLaXOika9GUOCug1BZDM4pjJcvgJpgo8VE0bUDHJ9Dt_Y4R3S1TSi0TYN7TlG1NcXEuq9uf3Tl5IBPZgZqD5ggbaqv6PNT9ZYyVBk4TdE4BnjEu7WExWjF3uUBPvu2Iux7I2JMHX1JdziVvAtvFh4QYmhYEdxx1Vw7E1AK6f5T5ielO_yR6BfQN0ZMpAV14dYZGKBl_iDL-juLNgde-c"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </button>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;