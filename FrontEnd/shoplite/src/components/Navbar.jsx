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
    onCartClick,
    onTicketsClick
}) => {
    return (
        <nav className="fixed top-4 left-0 w-full z-50 px-4 md:px-6">

            <div
                className="
        max-w-[1380px]
        mx-auto
        h-20
        px-8
        flex items-center justify-between
        rounded-[28px]
        border border-white/40
       bg-white/70
        backdrop-blur-2xl
        shadow-[0_10px_40px_rgba(0,0,0,0.06)]
    "
            >

                {/* LOGO */}
                <div
                    onClick={() => onNavigate("/")}
                    className="
text-3xl
font-black
tracking-tight
cursor-pointer
text-[#111111]
hover:opacity-80
transition
"
                >
                    ShopLite
                </div>

                {/* NAV ITEMS */}
                <div className="hidden lg:flex items-center gap-10">

                    {[
                        { name: "Home", path: "/" },
                        { name: "Categories", path: "/categories" },
                        { name: "Brands", path: "/brand/aurel" },
                        { name: "Deals", path: "/top-deals" }
                    ].map((item, i) => {

                        const isActive =
                            item.name === "Brands"
                                ? location.pathname.startsWith("/brand")
                                : location.pathname === item.path;

                        return (
                            <button
                                key={i}
                                onClick={() => onNavigate(item.path)}
                                className={`
                        relative
                        text-[15px]
                        font-semibold
                        transition-all duration-300
                        ${isActive
                                        ? "text-[#111111]"
                                        : "text-gray-600 hover:text-black"
                                    }
                    `}
                            >

                                {item.name}

                                <span
                                    className={`
                            absolute
                            left-0
                            -bottom-2
                            h-[2px]
                            rounded-full
                           bg-black
                            transition-all duration-300
                            ${isActive ? "w-full" : "w-0"}
                        `}
                                />

                            </button>
                        );
                    })}
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">

                    {/* SEARCH */}
                    <div
                        className="
                hidden md:flex
                items-center
                w-[260px]
                h-12
                px-5
                rounded-full
               bg-black/[0.03]
                border border-white/50
                shadow-inner
            "
                    >

                        <MdSearch className="text-gray-400 mr-2" size={18} />

                        <input
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search luxury products..."
                            className="
                    bg-transparent
                    outline-none
                    text-sm
                    w-full
                    placeholder:text-gray-400
                "
                        />

                    </div>

                    {/* CART */}
                    <button
                        onClick={onCartClick}
                        className="
                relative
                w-11 h-11
                rounded-full
                bg-black/[0.03]
                text-black
                border border-black/5
                flex items-center justify-center
                hover:scale-105
                transition
                shadow-sm
            "
                    >

                        <MdShoppingCart size={20} className="text-black" />

                        {cart.length > 0 && (
                            <span
                                className="
                        absolute
                        -top-1
                        -right-1
                        bg-black
                        text-white
                        text-[10px]
                        font-bold
                        w-5 h-5
                        rounded-full
                        flex items-center justify-center
                    "
                            >
                                {cart.length}
                            </span>
                        )}

                    </button>

                    {/* PROFILE */}
                    <button
                        onClick={handleProfileClick}
                        className="
                w-11 h-11
                rounded-full
                overflow-hidden
                border border-white/50
                shadow-sm
                hover:scale-105
                transition
            "
                    >

                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgcj9i-xOULjXbKX_gAzqP3OP_0GxiEBwAFPjURfiNHeiove_rW5LSqbTrLaXOika9GUOCug1BZDM4pjJcvgJpgo8VE0bUDHJ9Dt_Y4R3S1TSi0TYN7TlG1NcXEuq9uf3Tl5IBPZgZqD5ggbaqv6PNT9ZYyVBk4TdE4BnjEu7WExWjF3uUBPvu2Iux7I2JMHX1JdziVvAtvFh4QYmhYEdxx1Vw7E1AK6f5T5ielO_yR6BfQN0ZMpAV14dYZGKBl_iDL-juLNgde-c"
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />

                    </button>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;