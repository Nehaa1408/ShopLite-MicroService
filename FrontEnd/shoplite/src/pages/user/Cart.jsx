import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Cart = () => {
  const { cart, removeFromCart, increaseQty, decreaseQty, clearCart } = useCart();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.04;
  const total = subtotal + tax;
  const navigate = useNavigate();

  return (
    <div className="bg-background text-on-surface min-h-screen glow-bg px-6 py-12 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-2">Your Shopping Bag</h1>
        <p className="text-on-surface-variant max-w-2xl">
          Refine your selection and proceed to secure checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT */}
        <div className="lg:col-span-8 space-y-6">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="glass-panel rounded-xl p-6 flex flex-col md:flex-row gap-6 shadow"
            >
              <div className="w-full md:w-40 h-40 rounded-lg overflow-hidden">
                <img

                  src={
                    item.imageUrl?.startsWith("http")
                      ? item.imageUrl
                      : `/products/${item.imageUrl}`
                  }
                  alt={item.productName}
                  className="w-full h-full object-cover"

                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                {/* TOP */}
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{item.productName}</h3>
                    <p className="text-sm text-on-surface-variant">

                    </p>
                  </div>

                  <span className="text-xl font-bold text-primary">
                    ${item.price}
                  </span>
                </div>

                {/* BOTTOM */}
                <div className="flex justify-between items-end mt-4">
                  {/* QTY */}
                  <div className="flex items-center bg-surface-container-low rounded p-1">
                    <button
                      onClick={() => decreaseQty(item.productId, item.quantity)}
                      className="w-8 h-8 flex items-center justify-center"
                    >
                      -
                    </button>

                    <span className="px-4 font-semibold">{item.quantity}</span>

                    <button
                      onClick={() => increaseQty(item.productId, item.quantity)}
                      className="w-8 h-8 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-error text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-white rounded-xl p-8 shadow">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-primary">FREE</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between border-t pt-4 mb-6">
              <span className="font-bold">Total</span>
              <span className="text-2xl font-bold text-primary">
                ${total.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-primary text-white py-3 rounded-xl"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full mt-4 border border-primary text-primary py-3 rounded-xl font-semibold hover:bg-primary/10 transition"
            >
              Continue Shopping
            </button>
            <div className="mt-6 space-y-3">
              {/* Secure Payment */}
              <div className="flex items-center gap-3 bg-[#f2f1ff] p-3 rounded-lg">
                <span className="material-symbols-outlined text-primary">
                  verified
                </span>
                <p className="text-sm font-medium">
                  Secure SSL Encrypted Payment
                </p>
              </div>

              {/* Free Shipping */}
              <div className="flex items-center gap-3 bg-[#f2f1ff] p-3 rounded-lg">
                <span className="material-symbols-outlined text-primary">
                  local_shipping
                </span>
                <p className="text-sm font-medium">
                  Free Express Shipping on this order
                </p>
              </div>

              {/* Terms */}
              <p className="text-xs text-center text-on-surface-variant mt-2">
                By proceeding, you agree to ShopLite's{" "}
                <span className="underline cursor-pointer">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="underline cursor-pointer">Privacy Policy</span>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
