import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const DeliveryLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("deliveryToken");
    sessionStorage.removeItem("deliveryRole");
    navigate("/delivery");
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-[#fdf6f0] via-[#f9ebe7] to-[#f6e7ea] text-gray-800 overflow-x-hidden">

      {/* SOFT ORBS */}
      <div className="fixed w-[400px] h-[400px] bg-purple-200 blur-[120px] opacity-30 rounded-full top-[-100px] right-[-100px]"></div>
      <div className="fixed w-[400px] h-[400px] bg-blue-200 blur-[120px] opacity-30 rounded-full bottom-[-120px] left-[-120px]"></div>

      {/* NAVBAR */}
      <header className="flex justify-between items-center px-8 h-16 fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200">
        <h1 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
          ShopLite
        </h1>

        <div className="flex items-center gap-5 text-gray-500">
          <span className="material-symbols-outlined hover:text-blue-500 transition cursor-pointer">
            notifications
          </span>
          <span className="material-symbols-outlined hover:text-purple-500 transition cursor-pointer">
            chat
          </span>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white/30 backdrop-blur-2xl border-r border-white/30 flex flex-col justify-between py-6 px-4">

        <nav className="flex flex-col gap-3">

          {[
            { name: "Dashboard", icon: "dashboard", path: "/delivery/dashboard", color: "purple" },
            { name: "Completed", icon: "task_alt", path: "/delivery/completed", color: "green" },
            { name: "Profile", icon: "account_circle", path: "/delivery/profile", color: "blue" },
          ].map((item) => (
            <NavLink key={item.name} to={item.path}>
              {({ isActive }) => (
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all duration-300
      ${isActive
                      ? "bg-gradient-to-r from-indigo-200 to-purple-200 text-indigo-700 shadow-[0_4px_20px_rgba(99,102,241,0.25)]"
                      : "text-gray-500 hover:text-indigo-600 border border-transparent hover:border-indigo-300 hover:shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                    }`}
                >

                  {/* ICON */}
                  <span className={`material-symbols-outlined transition
        ${isActive ? "text-indigo-600" : "group-hover:text-indigo-500"}
      `}>
                    {item.icon}
                  </span>

                  {/* TEXT */}
                  <span>{item.name}</span>

                </div>
              )}
            </NavLink>
          ))}

        </nav>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="group flex items-center gap-3 p-3 rounded-xl text-red-500 hover:text-red-600 transition"
        >
          <span className="material-symbols-outlined 
            group-hover:drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]">
            logout
          </span>
          Logout
        </button>

      </aside>

      {/* CONTENT */}
      <main className="pt-24 pb-12 px-8 ml-64">
        {children}
      </main>

    </div>
  );
};

export default DeliveryLayout;