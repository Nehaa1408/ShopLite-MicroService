import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart } = useCart();

  const orderId = "SL-" + Math.floor(100000 + Math.random() * 900000);
  const orderDate = new Date().toLocaleDateString();
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const tax = subtotal * 0.04;
  const total = subtotal + tax;
  const [payment, setPayment] = useState("card");
  const orderData = [...cart];

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-[#f9f5ff]/80 backdrop-blur-xl shadow-[0px_12px_32px_rgba(43,42,81,0.06)]">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <h1
            onClick={() => navigate("/")}
            className="text-2xl font-black text-[#0846ed] cursor-pointer"
          >
            ShopLite
          </h1>

          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest hover:text-primary"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Cart
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="pt-28 pb-20 px-6 glow-bg flex-grow">
        <div className="max-w-7xl mx-auto">
          {/* TITLE */}
          <div className="mb-12">
            <h1 className="text-5xl font-extrabold mb-2">Secure Checkout </h1>
            <p className="text-on-surface-variant max-w-xl">
              Complete your order by providing delivery and payment information.
              <br></br>
              Your connection is encrypted and secure.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10">
            {/* LEFT */}
            <div className="lg:col-span-8 space-y-8">
              {/* DELIVERY ADDRESS */}
              <section className="bg-white/80 backdrop-blur-xl p-8 rounded-xl shadow ring-1 ring-[#aba9d7]/20">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-lg bg-[#e9e5ff] flex items-center justify-center text-[#0846ed]">
                    <span className="material-symbols-outlined">
                      local_shipping
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold">Delivery Address</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-[#585781] mb-2 block">
                      Full Name
                    </label>
                    <input
                      placeholder="Johnathan Doe"
                      className="w-full p-4 rounded-lg bg-[#e2dfff]/40 focus:ring-2 focus:ring-[#0846ed]/30 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-[#585781] mb-2 block">
                      Street Address
                    </label>
                    <input
                      placeholder="123 Luxury Lane, Suite 400"
                      className="w-full p-4 rounded-lg bg-[#e2dfff]/40 focus:ring-2 focus:ring-[#0846ed]/30 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#585781] mb-2 block">
                      City
                    </label>
                    <input
                      placeholder="San Francisco"
                      className="w-full p-4 rounded-lg bg-[#e2dfff]/40"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-[#585781] mb-2 block">
                        State
                      </label>
                      <input
                        placeholder="CA"
                        className="w-full p-4 rounded-lg bg-[#e2dfff]/40"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-[#585781] mb-2 block">
                        ZIP Code
                      </label>
                      <input
                        placeholder="94103"
                        className="w-full p-4 rounded-lg bg-[#e2dfff]/40"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-[#585781] mb-2 block">
                      Phone Number
                    </label>
                    <input
                      placeholder="+1 (555) 000-0000"
                      className="w-full p-4 rounded-lg bg-[#e2dfff]/40"
                    />
                  </div>
                </div>
              </section>

              {/* PAYMENT METHOD */}
              <section className="bg-white/80 backdrop-blur-xl p-8 rounded-xl shadow ring-1 ring-[#aba9d7]/20">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-lg bg-[#e9e5ff] flex items-center justify-center text-[#0846ed]">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  <h2 className="text-2xl font-bold">Payment Method</h2>
                </div>

                <div className="space-y-4">
                  {/* CARD */}
                  <div
                    onClick={() => setPayment("card")}
                    className={`p-6 rounded-xl border cursor-pointer transition ${payment === "card"
                      ? "border-[#0846ed] bg-[#f2efff] ring-2 ring-[#0846ed]/30"
                      : "border-[#aba9d7]/20 bg-[#f2efff]"
                      }`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-[#0846ed]">
                          credit_card
                        </span>
                        <span className="font-bold">Credit / Debit Card</span>
                      </div>

                      <div
                        className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${payment === "card"
                          ? "border-[#0846ed]"
                          : "border-[#aba9d7]"
                          }`}
                      >
                        {payment === "card" && (
                          <div className="w-2.5 h-2.5 bg-[#0846ed] rounded-full"></div>
                        )}
                      </div>
                    </div>

                    {payment === "card" && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          placeholder="Card Number"
                          className="col-span-2 p-3 rounded-lg bg-[#e2dfff]/40"
                        />
                        <input
                          placeholder="MM / YY"
                          className="p-3 rounded-lg bg-[#e2dfff]/40"
                        />
                        <input
                          placeholder="CVV"
                          className="p-3 rounded-lg bg-[#e2dfff]/40"
                        />
                      </div>
                    )}
                  </div>

                  {/* UPI */}
                  <div
                    onClick={() => setPayment("upi")}
                    className={`p-6 rounded-xl border cursor-pointer flex justify-between items-center ${payment === "upi"
                      ? "border-[#0846ed] bg-[#f2efff] ring-2 ring-[#0846ed]/30"
                      : "border-[#aba9d7]/20 bg-[#f2efff]"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-[#0846ed]">
                        account_balance_wallet
                      </span>
                      <span className="font-bold">UPI Transfer</span>
                    </div>

                    <div
                      className={`w-5 h-5 border-2 rounded-full ${payment === "upi"
                        ? "border-[#0846ed]"
                        : "border-[#aba9d7]"
                        }`}
                    >
                      {payment === "upi" && (
                        <div className="w-2.5 h-2.5 bg-[#0846ed] rounded-full m-auto mt-[3px]"></div>
                      )}
                    </div>
                  </div>

                  {/* COD */}
                  <div
                    onClick={() => setPayment("cod")}
                    className={`p-6 rounded-xl border cursor-pointer flex justify-between items-center ${payment === "cod"
                      ? "border-[#0846ed] bg-[#f2efff] ring-2 ring-[#0846ed]/30"
                      : "border-[#aba9d7]/20 bg-[#f2efff]"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-[#0846ed]">
                        handshake
                      </span>
                      <span className="font-bold">Cash on Delivery</span>
                    </div>

                    <div
                      className={`w-5 h-5 border-2 rounded-full ${payment === "cod"
                        ? "border-[#0846ed]"
                        : "border-[#aba9d7]"
                        }`}
                    >
                      {payment === "cod" && (
                        <div className="w-2.5 h-2.5 bg-[#0846ed] rounded-full m-auto mt-[3px]"></div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 bg-white p-8 rounded-xl shadow">
                <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                {/* ITEMS */}
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex gap-4">
                      <img
                        src={
                          item.imageUrl?.startsWith("http")
                            ? item.imageUrl
                            : `/products/${item.imageUrl}`
                        }
                        className="w-16 h-16 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="font-bold text-primary text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* TOTAL */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-primary">FREE</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between pt-4 border-t">
                    <span className="font-bold">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");

                      const res = await axios.post(
                        "http://localhost:8080/orders/place",
                        {},
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );

                      navigate("/order-success", {
                        state: res.data,
                      });

                    } catch (err) {
                      console.error("Order failed:", err);
                    }
                  }}
                  className="w-full mt-10 py-5 bg-gradient-to-br from-primary to-primary-container rounded-lg text-white font-bold text-lg"
                >
                  Place Order ⚡
                </button>

                <p className="text-xs text-center mt-4 text-gray-500">
                  🔒 Secure SSL Checkout
                </p>
              </div>

              {/* PERKS */}
              <div className="mt-6 p-6 bg-purple-50 rounded-xl flex gap-4">
                <span className="material-symbols-outlined text-purple-500">
                  loyalty
                </span>

                <div>
                  <p className="font-bold">Join ShopLite+ Perks</p>
                  <p className="text-sm text-gray-500">
                    Earn points on this purchase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full py-10 border-t border-[#aba9d7]/15 bg-[#f9f5ff]">
        <div className="lg:ml-64 px-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="font-['Manrope'] font-bold text-[#0846ed] text-lg">
            ShopLite
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <a className="text-xs uppercase tracking-wide text-[#2b2a51]/60 hover:text-[#0846ed] underline underline-offset-4 transition">
              Privacy Policy
            </a>
            <a className="text-xs uppercase tracking-wide text-[#2b2a51]/60 hover:text-[#0846ed] underline underline-offset-4 transition">
              Terms of Service
            </a>
            <a className="text-xs uppercase tracking-wide text-[#2b2a51]/60 hover:text-[#0846ed] underline underline-offset-4 transition">
              Support
            </a>
          </div>

          <div className="text-xs uppercase tracking-wide text-[#2b2a51]/60 text-center md:text-right">
            © 2024 ShopLite Luminous Editorial. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
