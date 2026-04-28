import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Brands = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const brands = [
    { short: "AU", name: "AUREL", category: "Luxury Wear" },
    { short: "NO", name: "NOVAIRE", category: "Travel Gear" },
    { short: "LU", name: "LUMORA", category: "Skincare" },
    { short: "KY", name: "KYNEX", category: "Tech Accessories" },
  ];

  return (
    <div className="relative min-h-screen bg-[#f8f9ff] overflow-hidden">

      {/* PREMIUM GLOW BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-indigo-400/30 rounded-full blur-[140px] glow-1" />
        <div className="absolute top-[20%] right-[-100px] w-[500px] h-[500px] bg-purple-400/30 rounded-full blur-[140px] glow-2" />
        <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-400/20 rounded-full blur-[140px] glow-3" />
      </div>

      <div className="relative z-10">

        {/* NAVBAR */}
        <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/70 border-b border-white/40">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">

            <div
              onClick={() => navigate("/")}
              className="text-2xl font-black text-indigo-600 cursor-pointer"
            >
              ShopLite
            </div>

            <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-600">
              {[
                { name: "Home", path: "/" },
                { name: "Categories", path: "/categories" },
                { name: "Brands", path: "/brands" },
                { name: "Deals", path: "/top-deals" },
                { name: "Orders", path: "/orders" },
              ].map((item, i) => {
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={i}
                    onClick={() => navigate(item.path)}
                    className={`relative px-1 transition ${isActive ? "text-indigo-600" : "hover:text-indigo-600"
                      }`}
                  >
                    {item.name}

                    {isActive && (
                      <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-indigo-600 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            <button onClick={() => navigate("/cart")}>
              <span className="material-symbols-outlined">shopping_cart</span>
            </button>
          </div>
        </nav>

        {/* MAIN */}
        <main className="max-w-[1280px] mx-auto px-[64px] pb-[120px]">

          {/* HEADER */}
          <header className="pt-24 pb-16 text-center">
            <h1 className="text-[48px] font-bold mb-4">Brands</h1>
            <p className="text-[18px] opacity-80 max-w-2xl mx-auto">
              Explore our curated selection of top-tier designers and premium houses.
            </p>
          </header>

          {/* SEARCH */}
          <section className="mb-16">
            <div className="relative max-w-2xl mx-auto">
              <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                className="w-full pl-16 pr-8 py-5 rounded-[20px] bg-white/70 backdrop-blur-md border border-white/40 shadow-sm focus:ring-2 focus:ring-indigo-200 transition"
                placeholder="Search brands..."
              />
            </div>
          </section>

          {/* BRAND GRID */}
          <section>
            <h2 className="text-[32px] mb-12">All Designers</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

              {brands.map((brand, i) => (
                <div
                  key={i}
                  onClick={() => navigate(`/brand/${brand.name.toLowerCase()}`)}
                  className="text-center group cursor-pointer transition-all duration-300 hover:scale-[1.03]"
                >

                  <div className="aspect-square rounded-[24px] flex flex-col items-center justify-center 
                    bg-white/70 backdrop-blur-md border border-white/40
                    shadow-[0_10px_40px_rgba(0,0,0,0.06)]
                    group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500">

                    <div className="text-3xl font-semibold text-indigo-600 mb-2">
                      {brand.short}
                    </div>

                    <p className="text-[10px] tracking-widest text-gray-400 uppercase">
                      {brand.category}
                    </p>
                  </div>

                  <h4 className="mt-5 font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                    {brand.name}
                  </h4>

                </div>
              ))}

            </div>
          </section>

        </main>

        {/* FOOTER */}
        <footer className="w-full mt-24 border-t border-white/20 bg-white/60 backdrop-blur-md">
          <div className="max-w-[1400px] mx-auto px-6 py-10 text-center text-gray-400 text-sm">
            © 2026 ShopLite. All rights reserved.
          </div>
        </footer>

      </div>
    </div>
  );
};

export default Brands;