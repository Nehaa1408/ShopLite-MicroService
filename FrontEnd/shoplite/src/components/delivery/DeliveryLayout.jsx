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
      path: "/delivery/dashboard"
    },

    {
      name: "Completed Deliveries",
      icon: "local_shipping",
      path: "/delivery/completed-deliveries"
    },

    {
      name: "Completed Pickups",
      icon: "inventory_2",
      path: "/delivery/completed-pickups"
    }
  ];

  return (

    <div className="min-h-screen relative overflow-hidden bg-[#f8f8fc] text-gray-800">

      {/* LUXURY BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">

        {/* CHAMPAGNE BASE */}
        <div
          className="absolute inset-0

    bg-[#f7f3ee]"
        />

        {/* LEFT ROSE WAVE */}
        <div
          className="absolute left-[-180px] top-[120px]

    w-[700px] h-[700px]

    rounded-full

    bg-gradient-to-br
    from-rose-100/50
    via-orange-50/30
    to-transparent

    blur-3xl"
        />

        {/* RIGHT CHAMPAGNE WAVE */}
        <div
          className="absolute right-[-220px] bottom-[40px]

    w-[750px] h-[750px]

    rounded-full

    bg-gradient-to-bl
    from-amber-100/45
    via-pink-50/20
    to-transparent

    blur-3xl"
        />

        {/* CENTER MERGE GLOW */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2

    w-[500px] h-[500px]

    rounded-full

    bg-white/30

    blur-3xl"
        />

      </div>

      {/* TOPBAR */}
      <header
        className="fixed top-0 left-0 right-0 z-50

        h-[78px]

        px-8

        flex items-center justify-between

        bg-white/70

        backdrop-blur-xl

        border-b border-white/60"
      >

        {/* LEFT */}
        <div className="flex items-center gap-3">

          {/* LOGO */}
          <div
            className="w-11 h-11 rounded-2xl

    bg-indigo-600

    flex items-center justify-center

    shadow-[0_10px_30px_rgba(79,70,229,0.18)]"
          >

            <span className="material-symbols-outlined text-white text-[20px]">
              local_shipping
            </span>

          </div>

          <div>

            <h1 className="text-[22px] font-bold tracking-tight text-gray-900">
              ShopLite
            </h1>

            <p className="text-[11px] text-gray-400 font-medium">
              Delivery Operations
            </p>

          </div>

        </div>

        {/* CENTER NAVIGATION */}
        <div className="absolute left-1/2 -translate-x-1/2">

          <nav
            className="hidden lg:flex items-center gap-3

  px-2 py-1.5

    rounded-[24px]

    bg-white/60

    border border-white/60

    backdrop-blur-xl

    shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
          >

            {navItems.map((item) => (

              <NavLink key={item.name} to={item.path}>

                {({ isActive }) => (

                  <div
                    className={`
              group

              flex items-center gap-2.5

              px-4 h-11

              rounded-2xl

              transition-all duration-300

              hover:-translate-y-[1px]

              ${isActive
                        ? `
                  bg-white

                  shadow-[0_8px_20px_rgba(99,102,241,0.08)]
                `
                        : `
                  hover:bg-white/70
                `
                      }
            `}
                  >

                    {/* ICON */}
                    <div
                      className={`
                w-8 h-8 rounded-xl

                flex items-center justify-center

                transition-all duration-300

                ${isActive
                          ? `
                    bg-indigo-50

                    text-indigo-600
                  `
                          : `
                    text-gray-500

                    group-hover:text-indigo-600
                  `
                        }
              `}
                    >

                      <span className="material-symbols-outlined text-[18px]">
                        {item.icon}
                      </span>

                    </div>

                    {/* TEXT */}
                    <span
                      className={`
                text-sm font-semibold

                transition-all duration-300

                ${isActive
                          ? "text-indigo-700"
                          : "text-gray-700"
                        }
              `}
                    >
                      {item.name}
                    </span>

                  </div>

                )}

              </NavLink>

            ))}

          </nav>

        </div>


        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* NOTIFICATION */}
          <button
            className="w-11 h-11 rounded-2xl

            bg-white/80

            border border-white/60

            flex items-center justify-center

            hover:border-indigo-200

            hover:shadow-[0_8px_24px_rgba(99,102,241,0.10)]

            transition-all duration-300"
          >

            <span className="material-symbols-outlined text-gray-600">
              notifications
            </span>

          </button>

          {/* PROFILE */}
          <div
            className="flex items-center gap-3

            px-3 h-11

            rounded-2xl

            bg-white/80

            border border-white/60"
          >

            {/* ICON */}
            <div
              className="w-8 h-8 rounded-xl

              bg-indigo-100

              flex items-center justify-center"
            >

              <span className="material-symbols-outlined text-indigo-600 text-[18px]">
                person
              </span>

            </div>

            {/* TEXT */}
            <div
              onClick={() => navigate("/delivery/profile")}
              className="hidden md:block cursor-pointer"
            >

              <p
                className="text-sm font-semibold text-gray-800

                hover:text-indigo-600

                transition-colors duration-300"
              >
                Delivery Partner
              </p>

              <p className="text-[11px] text-gray-400">
                Active
              </p>

            </div>

          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="group w-11 h-11 rounded-2xl

            bg-white/80

            border border-red-100

            flex items-center justify-center

            hover:bg-red-50

            hover:border-red-200

            transition-all duration-300"
          >

            <span
              className="material-symbols-outlined

              text-red-500 text-[20px]

              group-hover:scale-110

              transition-transform duration-300"
            >
              logout
            </span>

          </button>

        </div>

      </header>

      {/* MAIN */}
      <main
        className="pt-[135px]

        px-8 pb-8

        relative z-10"
      >
        {children}
      </main>

    </div>
  );
};

export default DeliveryLayout;