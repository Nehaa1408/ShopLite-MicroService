import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const DeliveryLayout = ({ children }) => {

  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("deliveryToken");
    sessionStorage.removeItem("deliveryRole");
    navigate("/delivery");
  };

  const navItems = [
    {
      name: "Dashboard",
      icon: "dashboard",
      path: "/delivery/dashboard",
      active:
        "from-indigo-500/15 via-indigo-400/10 to-blue-400/10 border-indigo-200/50 shadow-[0_0_25px_rgba(99,102,241,0.18)]",
      iconBg:
        "from-indigo-500 to-blue-500",
      text:
        "text-indigo-700",
      hover:
        "hover:shadow-[0_0_18px_rgba(99,102,241,0.12)] hover:border-indigo-200/40"
    },

    {
      name: "Completed",
      icon: "task_alt",
      path: "/delivery/completed",
      active:
        "from-emerald-500/15 via-green-400/10 to-teal-400/10 border-emerald-200/50 shadow-[0_0_25px_rgba(16,185,129,0.15)]",
      iconBg:
        "from-emerald-500 to-teal-500",
      text:
        "text-emerald-700",
      hover:
        "hover:shadow-[0_0_18px_rgba(16,185,129,0.12)] hover:border-emerald-200/40"
    },

    {
      name: "Profile",
      icon: "account_circle",
      path: "/delivery/profile",
      active:
        "from-cyan-500/15 via-sky-400/10 to-blue-400/10 border-cyan-200/50 shadow-[0_0_25px_rgba(6,182,212,0.15)]",
      iconBg:
        "from-cyan-500 to-blue-500",
      text:
        "text-cyan-700",
      hover:
        "hover:shadow-[0_0_18px_rgba(6,182,212,0.12)] hover:border-cyan-200/40"
    },
  ];

  return (

    <div className="min-h-screen overflow-hidden relative text-gray-800">

      {/* PREMIUM BACKGROUND */}
      <div className="absolute inset-0">

        {/* LUXURY BACKGROUND */}
        <div className="absolute inset-0 bg-[linear-gradient(115deg,#fdf8f2_0%,#fdf8f2_48%,#f8ecef_52%,#f8ecef_100%)]" />
        {/* SOFT CENTER BLEND */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent  via-white/10 to-transparent" />

      </div>



      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 
      h-16 px-8 flex items-center justify-between

      bg-white/10
      backdrop-blur-2xl
      border-b border-white/10">

        {/* LOGO */}
        <h1 className="text-3xl font-black tracking-tight 
        bg-gradient-to-r 
        from-indigo-600 
        via-purple-500 
        to-cyan-500
        bg-clip-text text-transparent">
          ShopLite
        </h1>

        {/* RIGHT */}
        <div className="flex items-center gap-5">

          <button className="w-10 h-10 rounded-xl 
          bg-white/30 backdrop-blur-md
          border border-white/30
          flex items-center justify-center
          hover:shadow-[0_0_15px_rgba(99,102,241,0.25)]
          transition-all duration-300">

            <span className="material-symbols-outlined text-gray-600">
              notifications
            </span>
          </button>

          <button className="w-10 h-10 rounded-xl 
          bg-white/30 backdrop-blur-md
          border border-white/30
          flex items-center justify-center
          hover:shadow-[0_0_15px_rgba(99,102,241,0.25)]
          transition-all duration-300">

            <span className="material-symbols-outlined text-gray-600">
              chat
            </span>
          </button>

        </div>

      </header>

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-16 bottom-0 w-64 
      bg-white/15 backdrop-blur-2xl
      border-r border-white/20

      flex flex-col justify-between
      px-5 py-8">

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-4">

          {navItems.map((item) => (

            <NavLink key={item.name} to={item.path}>

              {({ isActive }) => (

                <div
                  className={`
          group relative overflow-hidden

          flex items-center gap-4
          px-5 py-4 rounded-2xl

          border border-transparent
          backdrop-blur-xl

          transition-all duration-300 ease-out

          hover:-translate-y-[2px]

          ${isActive
                      ? `
              bg-white/20
              border-white/30

              shadow-[0_0_12px_rgba(255,255,255,0.04)]
            `
                      : `
              bg-white/10

              hover:bg-white/20

              ${item.name === "Dashboard"
                        ? "hover:border-indigo-200/40 hover:shadow-[0_0_15px_rgba(99,102,241,0.08)]"
                        : item.name === "Completed"
                          ? "hover:border-emerald-200/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.08)]"
                          : "hover:border-cyan-200/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.08)]"
                      }
            `
                    }
        `}
                >

                  {/* EDGE GLOW */}
                  <div
                    className={`
            absolute inset-0 rounded-2xl

            opacity-0
            transition-opacity duration-300

            ${isActive
                        ? "opacity-100"
                        : "group-hover:opacity-100"
                      }

            border

            ${item.name === "Dashboard"
                        ? "border-indigo-200/40"
                        : item.name === "Completed"
                          ? "border-emerald-200/40"
                          : "border-cyan-200/40"
                      }

            pointer-events-none
          `}
                  ></div>

                  {/* ICON */}
                  <div
                    className={`
            relative

            w-11 h-11 rounded-xl
            flex items-center justify-center

            border border-transparent

            transition-all duration-300

            ${isActive
                        ? `
                bg-white/25

                ${item.text}

                border-white/30

                shadow-[0_0_12px_rgba(255,255,255,0.04)]
              `
                        : `
                bg-white/30
                text-gray-600

                group-hover:border-white/40

                ${item.name === "Dashboard"
                          ? "group-hover:text-indigo-600"
                          : item.name === "Completed"
                            ? "group-hover:text-emerald-600"
                            : "group-hover:text-cyan-600"
                        }
              `
                      }
          `}
                  >

                    <span className="material-symbols-outlined text-[20px]">
                      {item.icon}
                    </span>

                  </div>

                  {/* TEXT */}
                  <div className="flex flex-col">

                    <p
                      className={`
              font-semibold text-sm tracking-wide
              transition-all duration-300

              ${isActive
                          ? item.text
                          : "text-gray-700"
                        }
            `}
                    >
                      {item.name}
                    </p>

                  </div>

                  {/* ACTIVE DOT */}
                  {isActive && (
                    <div
                      className={`
              absolute right-4 w-2 h-2 rounded-full

              ${item.name === "Dashboard"
                          ? "bg-indigo-400"
                          : item.name === "Completed"
                            ? "bg-emerald-400"
                            : "bg-cyan-400"
                        }

              shadow-sm
            `}
                    ></div>
                  )}

                </div>

              )}

            </NavLink>

          ))}

        </nav>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="group flex items-center gap-4 
          px-5 py-4 rounded-2xl

          bg-white/10
          border border-white/20

          hover:bg-red-50/70
          transition-all duration-300">

          <div className="w-11 h-11 rounded-xl 
          bg-red-100
          flex items-center justify-center">

            <span className="material-symbols-outlined text-red-500">
              logout
            </span>

          </div>

          <span className="font-medium text-red-500">
            Logout
          </span>

        </button>

      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-64 pt-24 px-10 pb-10 relative z-10">
        {children}
      </main>

    </div>
  );
};

export default DeliveryLayout;