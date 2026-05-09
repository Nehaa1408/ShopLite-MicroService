import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";


import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import FeaturedSection from "../../components/FeaturedSection";
import ProductGrid from "../../components/ProductGrid";
import CategoryBar from "../../components/CategoryBar";
import Footer from "../../components/Footer";
import useProducts from "../../hooks/useProducts";


import {
  MdHome,
  MdCategory,
  MdLocalOffer,
  MdStars,
  MdShoppingCart
} from "react-icons/md";
import { fetchCategories } from "../../services/api";

const Home = () => {

  // STATE
  const [categories, setCategories] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showLoginPopup, setShowLoginPopup] = React.useState(false);
  // ROUTER
  const navigate = useNavigate();
  const location = useLocation();

  // CONTEXT 
  const { addToCart, cart } = useCart();

  const category = React.useMemo(() => {
    return new URLSearchParams(location.search).get("category");
  }, [location.search]);

  const { filteredProducts, loading, totalPages } =
    useProducts(category, currentPage, searchTerm);

  const categoryIcons = {
    electronics: <MdCategory size={18} />,
    fashion: <MdStars size={18} />,
    footwear: <MdLocalOffer size={18} />,
    home: <MdHome size={18} />,
    accessories: <MdShoppingCart size={18} />
  };
  // HANDLERS
  const handleProfileClick = () => {
    const token = localStorage.getItem("token");
    navigate(token ? "/profile" : "/login");
  };

  const handleAddToCart = async (e, product) => {
  e.stopPropagation();

  try {
    await addToCart(product);
  } catch (err) {
    console.error(err);
  }
};

  // Reset page when category changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  // ================= FETCH CATEGORIES =================
  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error("Category fetch error:", err);
      }
    };

    loadCategories();
  }, []);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [smoothPos, setSmoothPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePos({
      x: e.clientX,
      y: e.clientY,
    });
  };

  useEffect(() => {
    let animationFrame;

    const smoothFollow = () => {
      setSmoothPos((prev) => ({
        x: prev.x + (mousePos.x - prev.x) * 0.08,
        y: prev.y + (mousePos.y - prev.y) * 0.08,
      }));

      animationFrame = requestAnimationFrame(smoothFollow);
    };

    smoothFollow();

    return () => cancelAnimationFrame(animationFrame);
  }, [mousePos]);

  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };


  return (
    <div
      className="relative min-h-screen overflow-hidden"
      onMouseMove={handleMouseMove}
    >

      {/*  BASE GRADIENT */}
      <div className="fixed inset-0 -z-10 
bg-gradient-to-br from-[#fdfcfb] via-[#f7f1ec] to-[#f3e8ff]" />

      <div className="fixed top-[-120px] left-[-120px] w-[420px] h-[420px]
bg-[#f5d0c5]/40 rounded-full blur-[140px] -z-10" />

      <div className="fixed bottom-[-140px] right-[-120px] w-[420px] h-[420px]
bg-[#e9d5ff]/40 rounded-full blur-[140px] -z-10" />

      {/* ✨ FADE ILLUSION */}
      <div className="fixed inset-0 -z-10 pointer-events-none
  bg-gradient-to-b from-white/40 via-transparent to-white/50" />

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Navbar */}

        <Navbar
          onNavigate={navigate}
          location={location}
          cart={cart}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setCurrentPage={setCurrentPage}
          handleProfileClick={handleProfileClick}
          onCartClick={() => navigate("/cart")}
        />
        {/*  MOUSE TRACKING GLOW */}
        <div
          className="fixed inset-0 -z-[15] pointer-events-none"
          style={{
            background: `
      radial-gradient(
        260px at ${mousePos.x}px ${mousePos.y}px,
        rgba(255, 215, 170, 0.28),
        transparent 60%
      ),
      radial-gradient(
        420px at ${mousePos.x}px ${mousePos.y}px,
        rgba(255, 255, 255, 0.18),
        transparent 75%
      )
    `,
          }}
        />

        {/* Main */}
        <main className="flex-grow pt-32 md:pt-36 w-full">

          {/* RIGHT SIDE CONTENT */}
          <div className="flex-1 ">

            {/* HERO SECTION */}

            <Hero />

            <CategoryBar
              categories={categories}
              activeCategory={category}
              categoryIcons={categoryIcons}
              onSelect={(catName) => {
                navigate(`/?category=${catName}`);
                document.getElementById("products")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            />

            {/* ===== FEATURED BENTO SECTION ===== */}
            <FeaturedSection />

            {/* Product Section */}
            <section id="products" className="px-6 md:px-12 py-14 max-w-[1400px] mx-auto">

              {/* HEADER */}
              <div className="mb-12 flex justify-between items-center">
                <h1 className="text-3xl md:text-4xl font-black">
                  Trending Now
                </h1>

                {/* arrows (optional UI) */}
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className="w-10 h-10 rounded-full border border-indigo-200 text-indigo-500 hover:bg-white transition"
                  >
                    ‹
                  </button>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className="w-10 h-10 rounded-full border border-indigo-200 text-indigo-500 hover:bg-white transition"
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* GRID */}
              <ProductGrid
                products={filteredProducts}
                loading={loading}
                onAddToCart={handleAddToCart}
                onView={(id) => navigate(`/product/${id}`)}
              />


            </section>
          </div>

        </main >

        {/* Footer */}

        <Footer />

        
      </div >
    </div >
  );
};

export default Home;
