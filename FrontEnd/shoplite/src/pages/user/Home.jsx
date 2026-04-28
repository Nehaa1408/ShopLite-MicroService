import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MdHome, MdCategory, MdLocalOffer, MdStars, MdReceipt, MdConfirmationNumber, MdSearch, MdShoppingCart, MdAccountCircle, MdChevronLeft, MdChevronRight, MdAddShoppingCart
} from "react-icons/md";
import axios from "axios";
const Home = () => {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const category = query.get("category");
  const [categories, setCategories] = React.useState([]);
  const categoryIcons = {
    electronics: <MdCategory size={18} />,
    fashion: <MdStars size={18} />,
    footwear: <MdLocalOffer size={18} />,
    home: <MdHome size={18} />,
    accessories: <MdShoppingCart size={18} />
  };

  const handleProfileClick = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };
  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = category
          ? `http://localhost:8080/api/products?category=${category}&page=${currentPage - 1}&size=4`
          : `http://localhost:8080/api/products?page=${currentPage - 1}&size=4`;

        const res = await axios.get(url);
        setProducts(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, category]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8080/categories");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  const productsPerPage = 6;


  const backendProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    desc: p.description,
    price: `$${p.price}`,
    priceValue: p.price,
    image: p.imageUrl.startsWith("http")
      ? p.imageUrl
      : `/products/${p.imageUrl}`
  }));
  const allProducts = backendProducts;

  const filteredProducts = allProducts.filter((product) => {
    if (!searchTerm) return true;

    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  const currentProducts = filteredProducts;

  const [totalPages, setTotalPages] = React.useState(1);
  const [showLoginPopup, setShowLoginPopup] = React.useState(false);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      setShowLoginPopup(true);
      return;
    }

    addToCart(product);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#eef2ff] text-on-background flex flex-col">
      {/*  FIXED BACKGROUND */}
      <div className="fixed inset-0 -z-20
  bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/60" />

      {/*  FIXED GLOW */}
      <div className="fixed inset-0 -z-10 pointer-events-none">

        {/* LEFT SOFT */}
        <div className="absolute top-[-80px] left-[-100px] w-[500px] h-[500px]
    bg-indigo-500/50 blur-[160px] rounded-full" />

        {/* RIGHT SOFT */}
        <div className="absolute bottom-[-80px] right-[-100px] w-[500px] h-[500px]
    bg-purple-600/50 blur-[160px] rounded-full" />

      </div>

      <div className="absolute top-[35%] left-1/2 -translate-x-1/2
  w-[700px] h-[300px]
  bg-indigo-500/50 blur-[140px] rounded-full" />

      {/* CONTENT WRAPPER */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Navbar */}

        <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/70 border-b border-white/40">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">

            {/* LEFT — LOGO */}
            <div
              onClick={() => navigate("/")}
              className="text-2xl font-black tracking-tight text-indigo-600 cursor-pointer"
            >
              ShopLite
            </div>

            {/* CENTER — NAV ITEMS */}
            <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-600">

              {[
                { name: "Home", path: "/" },
                { name: "Categories", path: "/categories" },
                { name: "Brands", path: "/brands" },
                { name: "Deals", path: "/top-deals" },
                { name: "Orders", path: "/orders" },
                { name: "Tickets", path: "/tickets", secondary: true }
              ].map((item, i) => {
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={i}
                    onClick={() => navigate(item.path)}
                    className={`relative transition ${isActive
                      ? "text-indigo-600"
                      : item.secondary
                        ? "text-gray-400 hover:text-indigo-500"
                        : "text-gray-600 hover:text-indigo-600"
                      }`}
                  >
                    {item.name}

                    {/* underline animation */}
                    <span
                      className={`absolute left-0 -bottom-1 h-[2px] bg-indigo-500 transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4">

              {/* SEARCH (COMPACT) */}
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
                onClick={() => navigate("/cart")}
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

        {/* Main */}
        <main className="flex-grow pt-32 md:pt-36 w-full">

          {/* RIGHT SIDE CONTENT */}
          <div className="flex-1 ">

            {/* HERO SECTION */}
            <section className="pt-10 md:pt-14 pb-6 md:pb-10 pl-8 md:pl-16 pr-4 md:pr-8 max-w-[1400px] mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">

                {/* LEFT CONTENT */}
                <div className="space-y-6">

                  {/* BADGE */}
                  <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide">
                    NEW COLLECTIONS
                  </div>

                  {/* HEADING */}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                    Elevate Your <br />
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                      Shopping Experience
                    </span>
                  </h1>

                  {/* DESCRIPTION */}
                  <p className="text-gray-600 text-lg max-w-lg">
                    Discover a curated sanctuary of minimalist design and high-end technical refinement. Experience luxury redefined through ethereal aesthetics.
                  </p>

                  {/* BUTTONS */}
                  <div className="flex gap-4 pt-4">
                    <button className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-105 transition">
                      Shop Collection →
                    </button>

                    <button className="px-6 py-3 rounded-full 
bg-white text-gray-700 font-semibold 
shadow-[0_8px_25px_rgba(0,0,0,0.08)] 
hover:shadow-[0_12px_35px_rgba(99,102,241,0.25)]
hover:text-indigo-600
transition-all duration-300 ease-out
hover:-translate-y-1 active:scale-95">
                      View Lookbook
                    </button>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="relative flex justify-center">

                  {/* GLOW BACKGROUND */}
                  <div className="absolute w-[380px] h-[380px] bg-purple-400/40 blur-[120px] rounded-full"></div>

                  {/* PRODUCT CARD */}
                  <div className="relative bg-black rounded-[32px] p-6 shadow-[0_60px_140px_rgba(0,0,0,0.45)] animate-[floatY_4s_ease-in-out_infinite]">

                    <img
                      src={`${import.meta.env.BASE_URL}products/p1.webp`}
                      alt="Product"
                      className="w-[320px] md:w-[380px] object-contain drop-shadow-2xl"
                    />

                    {/* FLOATING PRICE CARD */}
                    <div className="absolute -bottom-6 -right-6 bg-white/80 backdrop-blur-xl px-4 py-3 rounded-xl shadow-xl animate-[floatY_5s_ease-in-out_infinite]">
                      <p className="text-xs text-purple-500 font-semibold">
                        BEST SELLER
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        Ethereal Series 01
                      </p>
                      <p className="text-lg font-bold text-purple-600">
                        $400.00
                      </p>
                    </div>

                  </div>
                </div>

              </div>
            </section>
            <div className="max-w-[1400px] mx-auto mt-10">

              <div className="flex items-center justify-between w-full px-6 md:px-12 py-6">

                {categories.map((cat) => {
                  const isActive = category === cat.name;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        navigate(`/?category=${cat.name}`);
                        document.getElementById("products")?.scrollIntoView({
                          behavior: "smooth"
                        });
                      }}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 ${isActive
                        ? "bg-white shadow-md border border-indigo-200 text-indigo-600"
                        : "bg-gray-100 text-gray-600 hover:bg-white hover:shadow-sm"
                        }`}
                    >

                      {/* ICON */}
                      <span className={`${isActive ? "text-indigo-600" : "text-gray-500"}`}>
                        {categoryIcons[cat.name]}
                      </span>

                      {/* TEXT */}
                      <span className="text-sm font-medium capitalize">
                        {cat.name}
                      </span>

                    </button>
                  );
                })}

              </div>
            </div>

            {/* Product Section */}
            <section id="products" className="px-6 md:px-12 py-12 max-w-[1400px] mx-auto">

              {/* HEADER */}
              <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-black mb-2">
                  Featured Collection
                </h1>
                <p className="text-gray-500">
                  Curated products for your modern lifestyle.
                </p>
              </div>

              {/* GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">

                {loading ? (
                  [...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="h-[220px] bg-gray-200 animate-pulse rounded-2xl"
                    />
                  ))
                ) : (
                  currentProducts.map((product) => (

                    <div
                      key={product.id}
                      onClick={(e) => {
                        if (e.target.closest("button")) return;
                        navigate(`/product/${product.id}`);
                      }}
                      className="group cursor-pointer"
                    >

                      <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

                        {/* IMAGE BOX */}
                        <div className="relative bg-gray-100 rounded-xl flex items-center justify-center h-[180px] overflow-hidden">

                          <img
                            src={product.image}
                            alt={product.name}
                            onError={(e) => {
                              e.target.src = "/products/p1.webp";
                            }}
                            className="max-h-[140px] object-contain transition-transform duration-500 group-hover:scale-110"
                          />

                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="absolute bottom-3 right-3 
  opacity-0 translate-y-3 scale-90 
  group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
  transition-all duration-300 ease-out
  bg-indigo-600 text-white p-2 rounded-full shadow-lg 
  hover:scale-110 hover:bg-indigo-700 active:scale-95"
                          >
                            <MdAddShoppingCart size={16} />
                          </button>

                        </div>

                        {/* TEXT */}
                        <div className="mt-4 space-y-1">

                          <p className="text-xs text-gray-400 uppercase tracking-wide">
                            {product.category || "Category"}
                          </p>

                          <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
                            {product.name}
                          </h3>

                          <p className="text-indigo-600 font-bold text-sm">
                            {product.price}
                          </p>

                        </div>

                      </div>

                    </div>

                  ))
                )}

              </div>

            </section>

            {/* Pagination */}
            <section>
              <div className="mt-20 flex justify-center items-center gap-4">
                <button
                  aria-label="Previous page"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="p-2 rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low transition-colors"
                >
                  <MdChevronLeft size={20} />
                </button>
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${currentPage === i + 1
                        ? "bg-primary/10 text-blue-600"
                        : "text-on-surface-variant hover:bg-surface-container-high"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  aria-label="Next page"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className="p-2 rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low transition-colors"
                >
                  <MdChevronRight size={20} />
                </button>
              </div>
            </section>
          </div>
          {/* PREMIUM BANNER */}
          <section className="px-6 md:px-12 py-20">
            <div className="max-w-[1200px] mx-auto">

              <div className="relative overflow-hidden rounded-[40px] p-12 md:p-16 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white shadow-[0_40px_120px_rgba(0,0,0,0.4)]">

                {/* GLOW BACKGROUND */}
                <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-purple-500/30 blur-[120px] rounded-full"></div>
                <div className="absolute -bottom-20 -right-20 w-[300px] h-[300px] bg-indigo-500/30 blur-[120px] rounded-full"></div>

                {/* CONTENT */}
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">

                  {/* TEXT */}
                  <div className="max-w-xl space-y-4">
                    <h2 className="text-3xl md:text-4xl font-black leading-tight">
                      Join the Future of Shopping
                    </h2>

                    <p className="text-gray-300">
                      Unlock exclusive deals, early product access, and a seamless premium experience tailored just for you.
                    </p>
                  </div>

                  {/* BUTTON */}
                  <button className="px-8 py-4 rounded-full bg-white text-indigo-700 font-semibold shadow-lg hover:scale-105 transition">
                    Get Started →
                  </button>

                </div>

              </div>
            </div>
          </section>
        </main >

        {/* Footer */}

        <footer className="w-full mt-16 border-t border-gray-200 bg-[#f8f9ff]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">

            {/* TOP GRID */}
            <div className="grid md:grid-cols-4 gap-10">

              {/* BRAND */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800">ShopLite</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Ethereal commerce for the modern minimalist. High-end products designed for lifetime value.
                </p>

                {/* SOCIAL */}
                <div className="flex gap-3 pt-2">
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:scale-105 transition cursor-pointer">🌐</div>
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:scale-105 transition cursor-pointer">💬</div>
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:scale-105 transition cursor-pointer">@</div>
                </div>
              </div>

              {/* SHOP */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 tracking-wide">SHOP</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="hover:text-indigo-600 cursor-pointer">Collection</li>
                  <li className="hover:text-indigo-600 cursor-pointer">New Arrivals</li>
                  <li className="hover:text-indigo-600 cursor-pointer">Best Sellers</li>
                </ul>
              </div>

              {/* COMPANY */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 tracking-wide">COMPANY</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="hover:text-indigo-600 cursor-pointer">Sustainability</li>
                  <li className="hover:text-indigo-600 cursor-pointer">Care</li>
                  <li className="hover:text-indigo-600 cursor-pointer">Privacy</li>
                </ul>
              </div>

              {/* NEWSLETTER */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 tracking-wide">NEWSLETTER</h3>

                <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm border">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="flex-1 text-sm outline-none bg-transparent"
                  />
                  <button className="ml-2 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:scale-105 transition">
                    →
                  </button>
                </div>
              </div>

            </div>

            {/* BOTTOM BAR */}
            <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
              <p>© 2024 ShopLite. Ethereal Commerce.</p>

              <div className="flex gap-6">
                <span className="hover:text-indigo-600 cursor-pointer">Instagram</span>
                <span className="hover:text-indigo-600 cursor-pointer">Pinterest</span>
                <span className="hover:text-indigo-600 cursor-pointer">Twitter</span>
              </div>
            </div>

          </div>
        </footer>

        {showLoginPopup && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">

            {/* CARD */}
            <div className="bg-white rounded-2xl p-8 w-[90%] max-w-sm shadow-[0_20px_60px_rgba(0,0,0,0.2)] text-center animate-[fadeIn_0.3s_ease]">

              {/* ICON */}
              <div className="text-4xl mb-4">🔒</div>

              {/* TITLE */}
              <h2 className="text-xl font-bold mb-2">
                Login Required
              </h2>

              {/* TEXT */}
              <p className="text-gray-500 mb-6 text-sm">
                Please login to continue adding items to your cart.
              </p>

              {/* BUTTONS */}
              <div className="flex gap-3 justify-center">

                <button
                  onClick={() => {
                    setShowLoginPopup(false);
                    navigate("/login");
                  }}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:scale-105 transition"
                >
                  Login
                </button>

                <button
                  onClick={() => setShowLoginPopup(false)}
                  className="px-5 py-2.5 border rounded-lg font-medium hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

              </div>

            </div>
          </div>
        )}

      </div >
    </div>
  );
};

export default Home;
