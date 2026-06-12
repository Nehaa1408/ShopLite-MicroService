import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart } = useCart();


  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [paymentScreenshot, setPaymentScreenshot] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);


  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const UPI_QR =
    "https://res.cloudinary.com/djjmdoy5c/image/upload/v1778479403/AccountQRCodeState_Bank_of_India_-_1929_DARK_THEME_aaeoon.png";

  const tax = subtotal * 0.04;
  const total = subtotal + tax;


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
                      placeholder="Enter Name"
                      className="w-full p-4 rounded-lg bg-[#e2dfff]/40 focus:ring-2 focus:ring-[#0846ed]/30 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-[#585781] mb-2 block">
                      Street Address
                    </label>
                    <input
                      placeholder="Enter House Address"
                      className="w-full p-4 rounded-lg bg-[#e2dfff]/40 focus:ring-2 focus:ring-[#0846ed]/30 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#585781] mb-2 block">
                      City
                    </label>
                    <input
                      placeholder="Enter City"
                      className="w-full p-4 rounded-lg bg-[#e2dfff]/40"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-[#585781] mb-2 block">
                        State
                      </label>
                      <input
                        placeholder="Enter State"
                        className="w-full p-4 rounded-lg bg-[#e2dfff]/40"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-[#585781] mb-2 block">
                        ZIP Code
                      </label>
                      <input
                        placeholder="Enter Zip Code"
                        className="w-full p-4 rounded-lg bg-[#e2dfff]/40"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-[#585781] mb-2 block">
                      Phone Number
                    </label>
                    <input
                      placeholder="Enter Phone Number"
                      className="w-full p-4 rounded-lg bg-[#e2dfff]/40"
                    />
                  </div>
                </div>
              </section>

              {/* PAYMENT METHOD */}
              <section className="bg-white/80 backdrop-blur-xl p-8 rounded-xl shadow ring-1 ring-[#aba9d7]/20">

                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-lg bg-[#e9e5ff] flex items-center justify-center text-[#0846ed]">
                    <span className="material-symbols-outlined">
                      payments
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold">
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-4">

                  {/* CARD */}
                  <div
                    onClick={() => setPaymentMethod("CARD")}
                    className={`p-6 rounded-xl border cursor-pointer transition ${paymentMethod === "CARD"
                      ? "border-[#0846ed] bg-[#f2efff] ring-2 ring-[#0846ed]/30"
                      : "border-[#aba9d7]/20 bg-[#f2efff]"
                      }`}
                  >

                    <div className="flex justify-between items-center mb-6">

                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-[#0846ed]">
                          credit_card
                        </span>

                        <span className="font-bold">
                          Credit / Debit Card
                        </span>
                      </div>

                      <div
                        className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${paymentMethod === "CARD"
                          ? "border-[#0846ed]"
                          : "border-[#aba9d7]"
                          }`}
                      >
                        {paymentMethod === "CARD" && (
                          <div className="w-2.5 h-2.5 bg-[#0846ed] rounded-full"></div>
                        )}
                      </div>

                    </div>

                    {paymentMethod === "CARD" && (
                      <div className="grid md:grid-cols-2 gap-4">

                        <input
                          placeholder="Card Number"
                          className="col-span-2 p-3 rounded-lg bg-[#e2dfff]/40 outline-none focus:ring-2 focus:ring-[#0846ed]/20"
                        />

                        <input
                          placeholder="MM / YY"
                          className="p-3 rounded-lg bg-[#e2dfff]/40 outline-none focus:ring-2 focus:ring-[#0846ed]/20"
                        />

                        <input
                          placeholder="CVV"
                          className="p-3 rounded-lg bg-[#e2dfff]/40 outline-none focus:ring-2 focus:ring-[#0846ed]/20"
                        />

                        <div className="md:col-span-2 mt-2 flex items-start gap-2 text-sm text-[#585781]">
                          <span className="material-symbols-outlined text-base">
                            verified_user
                          </span>

                          <p>
                            Your payment is securely encrypted and protected.
                          </p>
                        </div>

                      </div>
                    )}

                  </div>

                  {/* UPI */}
                  <div
                    onClick={() => setPaymentMethod("UPI")}
                    className={`p-6 rounded-xl border cursor-pointer transition ${paymentMethod === "UPI"
                      ? "border-[#0846ed] bg-[#f2efff] ring-2 ring-[#0846ed]/30"
                      : "border-[#aba9d7]/20 bg-[#f2efff]"
                      }`}
                  >

                    <div className="flex justify-between items-center">

                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-[#0846ed]">
                          account_balance_wallet
                        </span>

                        <span className="font-bold">
                          UPI Transfer
                        </span>
                      </div>

                      <div
                        className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${paymentMethod === "UPI"
                          ? "border-[#0846ed]"
                          : "border-[#aba9d7]"
                          }`}
                      >
                        {paymentMethod === "UPI" && (
                          <div className="w-2.5 h-2.5 bg-[#0846ed] rounded-full"></div>
                        )}
                      </div>

                    </div>

                    {paymentMethod === "UPI" && (
                      <div className="mt-6 border-t pt-6">

                        <div className="mb-5">
                          <p className="font-semibold text-[#2b2a51] mb-2">
                            Scan & Pay
                          </p>

                          <div className="bg-white p-4 rounded-xl inline-block border">
                            <img
                              src={UPI_QR}
                              alt="UPI QR"
                              className=" w-56 h-56 object-contain rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
                            />
                          </div>

                          <p className="text-sm text-[#585781] mt-3">
                            Pay securely using any UPI app.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2 text-[#585781]">
                            Upload Payment Screenshot
                          </label>

                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {

                              try {

                                const file = e.target.files[0];

                                if (!file) return;

                                const formData = new FormData();

                                formData.append("file", file);

                                const res = await axios.post(
                                  `${import.meta.env.VITE_API_URL}/api/upload/payment-screenshot`,
                                  formData,
                                  {
                                    headers: {
                                      "Content-Type": "multipart/form-data",
                                    },
                                  }
                                );

                                setPreviewImage(res.data);

                                setPaymentScreenshot(res.data);

                              } catch (err) {

                                console.error("Upload failed:", err);

                                alert("Failed to upload screenshot");
                              }
                            }}
                            className="w-full p-3 rounded-lg bg-[#e2dfff]/40"
                          />

                          {previewImage && (
                            <div className="mt-6">

                              <p className="text-sm font-semibold text-[#6d5c67] mb-3">
                                Uploaded Screenshot
                              </p>

                              <div className="
      relative
      inline-block
      rounded-2xl
      overflow-hidden
      border
      border-[#ead7d8]
      bg-white
      shadow-[0_10px_30px_rgba(0,0,0,0.06)]
    ">

                                <img
                                  src={previewImage}
                                  alt="Uploaded Screenshot"
                                  className="
          w-56
          object-cover
        "
                                />

                                <div className="
        absolute
        top-3
        right-3
        bg-white/90
        backdrop-blur-md
        rounded-full
        p-1
        shadow-md
      ">
                                  <span className="material-symbols-outlined text-green-500 text-[18px]">
                                    check_circle
                                  </span>
                                </div>

                              </div>

                            </div>
                          )}
                        </div>

                      </div>
                    )}

                  </div>

                  {/* COD */}
                  <div
                    onClick={() => setPaymentMethod("COD")}
                    className={`p-6 rounded-xl border cursor-pointer transition ${paymentMethod === "COD"
                      ? "border-[#0846ed] bg-[#f2efff] ring-2 ring-[#0846ed]/30"
                      : "border-[#aba9d7]/20 bg-[#f2efff]"
                      }`}
                  >

                    <div className="flex justify-between items-center">

                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-[#0846ed]">
                          handshake
                        </span>

                        <span className="font-bold">
                          Cash on Delivery
                        </span>
                      </div>

                      <div
                        className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${paymentMethod === "COD"
                          ? "border-[#0846ed]"
                          : "border-[#aba9d7]"
                          }`}
                      >
                        {paymentMethod === "COD" && (
                          <div className="w-2.5 h-2.5 bg-[#0846ed] rounded-full"></div>
                        )}
                      </div>

                    </div>

                    {paymentMethod === "COD" && (
                      <div className="mt-4 flex items-start gap-2 text-sm text-[#585781]">
                        <span className="material-symbols-outlined text-base">
                          local_shipping
                        </span>

                        <p>
                          Pay with cash when your order arrives.
                        </p>
                      </div>
                    )}

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

                      if (
                        paymentMethod === "UPI" &&
                        !paymentScreenshot
                      ) {
                        alert("Please upload payment screenshot");
                        return;
                      }

                      setPlacingOrder(true);

                      const token = localStorage.getItem("token");

                      const payload = {
                        paymentMethod,
                        paymentScreenshot,
                      };

                      const res = await axios.post(
                        `${import.meta.env.VITE_API_URL}/api/orders`,
                        payload,
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

                      console.error(err);

                      alert(
                        "Something went wrong while placing your order. Please try again."
                      );

                    } finally {

                      setPlacingOrder(false);
                    }
                  }}
                  disabled={placingOrder}
                  className="
    group
    relative
    overflow-hidden
    w-full
    mt-10
    py-5
    rounded-[22px]

    text-[#5b435d]
    font-bold
    text-lg
    tracking-wide

    transition-all
    duration-500

    active:scale-[0.985]
    hover:-translate-y-0.5

    hover:shadow-[0_22px_55px_rgba(232,180,184,0.32)]

    disabled:opacity-60
    disabled:cursor-not-allowed

    border
    border-white/40

    bg-gradient-to-br
    from-[#fff6ee]
    via-[#ffe8e3]
    to-[#f7d7d9]

    backdrop-blur-xl
  "
                >

                  {/* SOFT GLOW */}
                  <div className="
    absolute
    inset-0
    opacity-0
    group-hover:opacity-100
    transition-opacity
    duration-700

    bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_60%)]
  "></div>

                  {/* LUXURY SHIMMER */}
                  <div className="
    absolute
    top-0
    -left-[140%]
    h-full
    w-[50%]
    rotate-12

    bg-white/40
    blur-3xl

    group-hover:left-[150%]

    transition-all
    duration-[1600ms]
  "></div>

                  {/* INNER SHINE */}
                  <div className="
    absolute
    inset-[1px]
    rounded-[21px]

    bg-gradient-to-br
    from-white/60
    via-white/10
    to-transparent
  "></div>

                  {/* CONTENT */}
                  <div className="relative z-10 flex items-center justify-center gap-3">

                    {placingOrder ? (
                      <>
                        <div className="
          w-5
          h-5
          border-2
          border-[#9f7f87]/30
          border-t-[#7f5d67]
          rounded-full
          animate-spin
        "></div>

                        <span>
                          Processing Order...
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[22px]">
                          lock
                        </span>

                        <span>
                          Complete Secure Order
                        </span>

                        <span className="
          material-symbols-outlined
          transition-transform
          duration-300
          group-hover:translate-x-1
        ">
                          arrow_forward
                        </span>
                      </>
                    )}

                  </div>

                </button>

                <p className="
  text-xs
  text-center
  mt-5
  text-[#8a6f78]
  flex
  items-center
  justify-center
  gap-2
">
                  <span className="material-symbols-outlined text-sm">
                    verified_user
                  </span>

                  SSL encrypted & protected checkout
                </p>

                {/* PERKS */}
                <div className="
  mt-6
  p-6
  rounded-2xl
  border
  border-purple-200/40
  bg-gradient-to-br
  from-purple-50
  via-white
  to-indigo-50
  shadow-[0_10px_30px_rgba(124,58,237,0.08)]
  flex
  gap-4
  hover:scale-[1.01]
  transition-all
  duration-300
">

                  <div className="
    w-12
    h-12
    rounded-2xl
    bg-gradient-to-br
    from-purple-500
    to-indigo-500
    flex
    items-center
    justify-center
    shadow-lg
  ">
                    <span className="material-symbols-outlined text-white">
                      loyalty
                    </span>
                  </div>

                  <div>
                    <p className="font-bold text-[#2b2a51]">
                      Join ShopLite+ Perks
                    </p>

                    <p className="text-sm text-[#6b6a8f] mt-1 leading-relaxed">
                      Earn reward points, unlock exclusive deals,
                      and get priority delivery benefits.
                    </p>
                  </div>

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
            © ShopLite Luminous Editorial. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
