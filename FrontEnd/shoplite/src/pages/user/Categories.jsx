import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
const Categories = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const category = query.get("category");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = category
          ? `http://localhost:8080/api/products?category=${category}`
          : `http://localhost:8080/api/products`;

        const res = await axios.get(url);
        setProducts(res.data.content);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, [category]);

  return (

    <div className="bg-surface min-h-screen text-on-surface relative overflow-hidden">

      {/* PREMIUM BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-blue-500/25 rounded-full blur-[120px]"></div>
        <div className="absolute top-10 right-[-120px] w-[350px] h-[350px] bg-sky-400/25 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[140px]"></div>
        <div className="absolute top-[30%] left-[30%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/*  NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/70 border-b border-white/40">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">

          {/* LOGO */}
          <div
            onClick={() => navigate("/")}
            className="text-2xl font-black tracking-tight text-indigo-600 cursor-pointer"
          >
            ShopLite
          </div>

          {/* NAV ITEMS */}
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
                  className={`relative transition ${isActive ? "text-indigo-600" : "hover:text-indigo-600"
                    }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {/* CART */}
            <button onClick={() => navigate("/cart")}>
              <span className="material-symbols-outlined">shopping_cart</span>
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-16">
          <p className="text-xs font-bold text-primary mb-4">
            COLLECTIONS 2024
          </p>

          <h1 className="text-5xl md:text-6xl font-black mb-6">
            Explore Our <span className="text-primary italic">Categories</span>
          </h1>

          <p className="text-on-surface-variant max-w-xl">
            Discover a curated selection of premium essentials designed for
            modern life.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* ELECTRONICS */}
          <div
            onClick={() => navigate("/?category=electronics")}
            className="md:col-span-8 h-[450px] rounded-3xl overflow-hidden relative cursor-pointer group shadow-[0px_12px_32px_rgba(43,42,81,0.06)]"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfNVy_J8tEdJg0futRabHkld9mYtdSqgWJNw-Yz8zzbaKfhGG4Wxjn_5o3YmvhR5osNBEJMyuRJ7r3xZk2n3Dw-t5RQysWtbUx3cQQIPxsW2_rGxLWjX11X2xQt9sbL6VM8esdaH-zWkHGFFekqC8juBfNq5N5beDpVSCaIk4BF0tzYEhIwqn7uuLgCd8MZI_xZV5dCE2n4sUZTmVLR55_Vw0omZ91zGeO_wyTDhRS7nwyVkOB-wLxAIS2Et9dDreVuEo5lJXy6ug"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            {/* TEXT */}
            <div className="absolute bottom-0 left-0 p-10 text-white">
              <h2 className="text-3xl font-bold mb-2">Electronics</h2>
              <p className="text-sm mb-4 opacity-80">
                Next-gen tech for digital lifestyle
              </p>

              <button className="bg-gradient-to-r from-primary to-primary-container px-6 py-3 rounded-xl flex items-center gap-2">
                Shop Now
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          {/* ACCESSORIES */}
          <div
            onClick={() => navigate("/?category=accessories")}
            className="md:col-span-4 h-[450px] rounded-3xl overflow-hidden relative cursor-pointer group shadow-[0px_12px_32px_rgba(43,42,81,0.06)]"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsGaLHCSy0god6QLDZV5Ii_AFi0pnBFJIeddJjd5uhTen9jJjr9_jOXV1J3P4seBqD9A1iDnZwAI_6NBZwkUMNl7IHBON_Z60lByvXvi2PocG0RSHMNfr2_0V-Or881KyVwXKvV5-rKTv-UfikQEFYE6MavJZ9MNPprK04kSHC-JzCsX2vtmHOBTSIuhDkXQAaJQAOrH0knmnov6J2T6BaL0HKilopuM2remr3ZH88Mlbv-QUOndx_pm2UOvpfRGsT1XzvY6mbv1g"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

            <div className="absolute bottom-0 p-8 text-white">
              <h2 className="text-2xl font-bold mb-2">Accessories</h2>

              <p className="flex items-center gap-1 text-sm">
                Discover more
                <span className="material-symbols-outlined">east</span>
              </p>
            </div>
          </div>

          {/* FASHION */}
          <div
            onClick={() => navigate("/?category=fashion")}
            className="md:col-span-4 h-[350px] rounded-3xl overflow-hidden relative cursor-pointer group shadow hover:-translate-y-1 transition-all duration-500"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYux5xIi40JTb4wFwRJSPsGQTHMv3iwqGJTDkkTZwmLPVWbf011TrV0YDrgli70NapgYo0XjIRsGo3FZUC5jhcWbTcAPc7YGvA2eqc6voHRonH1Bw4RpRrkZOprMLChVq9qNuVtoq1ovAHSPwW8pcCN5lnK4tuIU8Q29DG6_GLd9MRw3UTuG93jZHXHsPhQbDAM5N5WfJxFV3Odfn-iIFdIbstkH29zWQ67H07c1GbYC8-rQUoDxUJK91UpZCVZLFKjUxW1L--hKc"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h2 className="text-xl font-bold mb-2">Fashion</h2>

              <button className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-lg text-sm">
                View Lookbook
              </button>
            </div>
          </div>

          {/* HOME DECOR */}
          <div
            onClick={() => navigate("/?category=home")}
            className="md:col-span-4 h-[350px] rounded-3xl overflow-hidden relative cursor-pointer group shadow hover:-translate-y-1 transition-all duration-500"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFf-P1PTyCD4XqXph_15kNqdRLFipUH3xizRuzQaiEPgUNJlq2sEu1TZ3UZaU6G9zxKDwj2XLgRFmcZ91hZFDT7-fhgzWKfLE9bsC04feJqMthfNi8Aa63BXPOrGypeOm_kssZkG9RfUGqm0af7G_uvvDmfhw5vm3l_ZsTPDjf7qdr0-k-LEY6zWr_yqK0xkZIiV2UCvsAf4ACCQMllvP2GrIskEYRCJhU3TuSnSKgiIiGWDqqY6kM2M74cQiaXUXwHbFwCqTXFiA"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h2 className="text-xl font-bold mb-1">Home Decor</h2>

              <p className="text-sm opacity-80 mb-2">Curate your space →</p>
            </div>
          </div>

          {/* FOOTWEAR */}
          <div
            onClick={() => navigate("/?category=footwear")}
            className="md:col-span-4 h-[350px] rounded-3xl overflow-hidden relative cursor-pointer group shadow hover:-translate-y-1 transition-all duration-500"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSW0s9DB8w93evQ6PVB8BZaGoWELC5OcvtRUfOYVqQazUDgap_ID2RCktcPiFtg03uarWdbU8cSBKq82cErCIG7wGXTyRg83og8S6CQBTF1GxJzxaQtuZ7_LymBZeJtWI2dnnvkhh-DZpM-PginhNopsAFJ3fa4iB0sVM9bCPflwVLGLsBAmXckRmlNTCuqV0LvWHkU52Ac8TpVoAFemYB98LGF-r3PSwOiXduGqtxzPm8aA6LLxjg8eG38ruKKjR7QmZthsZ8ylA"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h2 className="text-xl font-bold mb-2">Footwear</h2>

              <button className="bg-primary text-white px-4 py-1 rounded-lg text-sm">
                Shop Shoes
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Categories;
