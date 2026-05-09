import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";


const ProductDetails = () => {
  const images = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDoyvMf5KGbTJRwCtYfS3zHtoHeZ19DNn_AKFKJQqALmlHJj0fEJRV5yVNEOmZ794K2s5jba68Ef_shx47ZyCveOO-Dygb2RlOL8HC6OCDEXc3qF2uosCO-hjWTc_uBRQZnttWfoihss7H_ccrk-JcUza7b-Ej_opiAaPVrfrG23ZTFtkPv45agjCF4X0l6AzDoWWtvtwgYG1KvgOHt0NCJ78sVJWOwrj8ZnhVIfrtNJBA0yHWvDZH9MS89jzFQS7zg2mLWH0Gof9s",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBkHkMg0W24KsTvOV_e6iKx8CgknzalmDXSO6Ra9vyIKc4gLY42PBPmRds_1UKAnViFpn8SZAFwrOgLHewPfA545qX7wdyU78PVXC0QlKey0qqJwjCxeSe9_ZEYADAQO_1LuLRC1i0OC3o52iGR6lrhWMlY-HPJBA9j__XHgxn_DaXTrDMZmg-VlqHqQnsViZGcUMM3ryrFRLbFrsZoL5xwu-7XdcewjIyQPgjLU6iJpme_jl61HQsv91n5hDfaMEXRE4VOoUQSgPM",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBCZvZeyVTOdzk1xDdYt9FEJwfiVpMRvmkRUCYPw9pPYgWMR4-JoXvT8JML7jjeisHQcuh51wZZIN--ZYrbVSS0EDNDEwsFWmEFvPF_q9zXdRw2RQ3ZSYVRarzw0IIorAdLq2YtGhN2qNlIUG_5maL55gwTqc6Rq23LhWWY42ASU-v98y-R_G91PkUoZ49cVO5fv25rV0qBEvQv9EjTFgEz5N6rtvvWwIk_2qNSOBx_kKo3afGhbTrhJmjge8tzuBufSOrm8RAdnoA",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDEvZuvfv4dfo_j7YcjEBzfQtImUR3EeAHkhQ4GSXEtwDaTQZB3gwtHP20K3SaAc6gD1uiquSUnBg2JlhGmkW-kGo9qLdHxWwSs9YS-h9t9dHx4x8Y9i0CflDbBp9GfKJfDtrhz80OKsmkmlMxYwIjMldyex8bzoePnZd94bD3M3oqtDlNhFZZxIZmHW0__WtbhR0XderyJCszk1_rXqI-oQv5ZEsRi3MgAk-H9kLqfXuJhrT78ylekqjUklEBUqWNBO4Y6vcimyyI",
  ];
  const [product, setProduct] = React.useState(null);
  const [mainImage, setMainImage] = useState(images[0]);
  const [qty, setQty] = useState(1);
  const displayProduct = {
    id: 1,
    name: "Aura-9 Wireless Noise-Cancelling Headphones",
    price: "$400.00",
    priceValue: 400,
    image: mainImage,
    quantity: qty,
  };
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();

  return (
    <div className="bg-surface text-on-background min-h-screen">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-surface-container/80 backdrop-blur-xl shadow-md">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <h1 className="text-2xl font-extrabold text-primary font-['Manrope']">
            ShopLite
          </h1>

          <div className="hidden md:flex flex-1 max-w-md mx-10">
            <input
              className="w-full px-4 py-2 rounded-xl bg-surface-container-highest/40 focus:outline-none"
              placeholder="Search for premium products..."
            />
          </div>

          <div className="flex gap-4">
            {/* CART */}
            <button onClick={() => navigate("/cart")} className="relative">
              <span className="material-symbols-outlined">shopping_cart</span>

              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
            {/* PROFILE */}
            <button onClick={() => navigate("/profile")}>
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto glow-bg">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* LEFT */}
          <div>
            <div className="aspect-square rounded-xl overflow-hidden glass-card shadow-xl group">
              <img
                src={mainImage}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-4 mt-5">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition
                  ${mainImage === img
                      ? "border-primary"
                      : "border-transparent hover:border-gray-300"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-8 pt-2">
            <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase">
              PREMIUM AUDIO • STUDIO EDITION
            </div>

            <h1 className="text-5xl font-extrabold font-['Manrope'] leading-tight">
              Aura-9 Wireless Noise-
              <br />
              Cancelling Headphones
            </h1>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">$400.00</span>
              <span className="text-lg text-gray-400 line-through">
                $720.00
              </span>
            </div>

            <p className="text-on-surface-variant leading-relaxed max-w-lg">
              Experience pure sound with the Aura-9. Featuring industry-leading
              active noise cancellation, 40-hour battery life, and spatial
              audio.
            </p>

            {/* Quantity */}
            <div>
              <p className="text-xs font-bold uppercase text-gray-500 mb-2">
                Select Quantity
              </p>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white rounded-xl border px-2 py-1 shadow-sm">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10"
                  >
                    -
                  </button>
                  <span className="w-10 text-center">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-10 h-10">
                    +
                  </button>
                </div>

                <span className="text-sm text-primary">In stock: 12 units</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-2">
              <button
                onClick={async () => {

                  addToCart({
                    id: displayProduct.id,
                    name: displayProduct.name,
                    priceValue: displayProduct.priceValue,
                    image: displayProduct.image,
                    quantity: qty,
                  });


                  try {
                    const token = localStorage.getItem("token");

                    if (!token) return;

                    await axios.post(
                      "http://localhost:8080/cart/add",
                      null,
                      {
                        params: {
                          productId: displayProduct.id,
                          quantity: qty,
                        },
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );

                    console.log("Saved to backend cart");
                  } catch (err) {
                    console.error("Backend cart error:", err);
                  }
                }}
                className="flex-1 py-5 rounded-xl text-white font-bold
  bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg hover:scale-[0.98] transition"
              >
                Add to Cart
              </button>

              <button className="flex-1 py-5 rounded-xl border border-gray-300 font-bold hover:bg-gray-100">
                Buy Now
              </button>
            </div>

            {/* Shipping */}
            <div className="flex gap-6 text-sm text-gray-500">
              <span>🚚 Free 2-Day Shipping</span>
              <span>🛡️ 2-Year Warranty</span>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="mt-24 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl font-extrabold">
              Audio perfection, <br />
              <span className="text-primary">redefined for the elite.</span>
            </h2>

            <p className="text-on-surface-variant">
              The Aura-9 isn't just about sound; it's about the space between.
              Our proprietary chipset analyzes noise 50,000 times per second.
            </p>

            <ul className="list-disc pl-5 space-y-2 marker:text-primary">
              <li>Adaptive Spatial Audio</li>
              <li>Triple-mic crystal clear calls</li>
              <li>Fast charging (10 mins = 5 hours)</li>
            </ul>
          </div>

          <div className="lg:col-span-7 h-[400px] rounded-3xl overflow-hidden shadow-xl">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8sxv62MdPcXo-rMnnoE3Mb8mBcEDPz3HGyTM5iRtKAQT6ZWHZIgJN4VerV74H17aqD4_Obcd1oHTHdVYjt_jQhoxsJIaD7iStSyGjYAC1m2AuxqJp5zPRSV4rcGI7mbwvzrSwUl71TsOi49PFhJlZXIfnuS3ADDICWYJ1swwcKaumfkoHHXZojw4PC3Q0juQ-cZ4drbt85VFF5Niw-X68bI3sHpLm2ROnzrwSL6sWQtJ90ZeLH7PooftfOkQj3aCdGk_auSk0yrE"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/*  SPECIFICATIONS */}
        <section className="mt-24 text-center">
          <h3 className="text-xs text-primary uppercase tracking-widest">
            Technical Details
          </h3>
          <h2 className="text-4xl font-extrabold mb-10">Specifications</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "battery_charging_full", title: "Battery Life" },
              { icon: "bluetooth", title: "Connectivity" },
              { icon: "equalizer", title: "Drivers" },
              { icon: "weight", title: "Weight" },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-surface-container-low shadow-md hover:shadow-xl transition"
              >
                <span className="material-symbols-outlined text-primary text-3xl mb-3">
                  {item.icon}
                </span>
                <h4 className="font-bold">{item.title}</h4>
                
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetails;
