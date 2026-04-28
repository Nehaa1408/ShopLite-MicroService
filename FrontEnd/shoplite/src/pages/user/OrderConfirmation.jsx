import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state;
  if (!order) {
    return <p>No order found</p>;
  }
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.04;
  const total = subtotal + tax;

  console.log("ORDER ITEMS:", order.items);
  return (
    <div className="bg-surface text-on-surface min-h-screen glow-bg pb-24 md:pb-0">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#f9f5ff]/80 backdrop-blur-xl shadow-[0px_12px_32px_rgba(43,42,81,0.06)]">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <span
              onClick={() => navigate("/")}
              className="text-2xl font-black tracking-tight text-primary cursor-pointer"
            >
              ShopLite
            </span>

            <div className="hidden md:flex gap-6">
              <button
                onClick={() => navigate("/")}
                className="hover:text-primary"
              >
                Shop
              </button>
              <button className="text-primary font-bold border-b-2 border-primary">
                Orders
              </button>
              <button className="hover:text-primary">Support</button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined cursor-pointer">
              notifications
            </span>

            <div className="h-10 w-10 rounded-full overflow-hidden bg-surface-container-high">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgcj9i-xOULjXbKX_gAzqP3OP_0GxiEBwAFPjURfiNHeiove_rW5LSqbTrLaXOika9GUOCug1BZDM4pjJcvgJpgo8VE0bUDHJ9Dt_Y4R3S1TSi0TYN7TlG1NcXEuq9uf3Tl5IBPZgZqD5ggbaqv6PNT9ZYyVBk4TdE4BnjEu7WExWjF3uUBPvu2Iux7I2JMHX1JdziVvAtvFh4QYmhYEdxx1Vw7E1AK6f5T5ielO_yR6BfQN0ZMpAV14dYZGKBl_iDL-juLNgde-c"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="pt-32 pb-16 px-6 max-w-6xl mx-auto">
        {/* SUCCESS */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 mb-6 shadow-sm">
            <span className="material-symbols-outlined text-4xl">
              check_circle
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">
            Order Placed Successfully
          </h1>

          <p className="text-on-surface-variant mb-4">
            Thank you for shopping with us. Your items are being prepared.
          </p>

          <div className="inline-block px-4 py-2 bg-surface-container-low rounded-xl">
            <span className="text-sm mr-2">Order ID</span>
            <span className="font-bold text-primary text-lg">#{order.orderId}</span>
          </div>
        </section>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT - PRODUCTS */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-xl font-bold">Order Details</h2>

            {order.items.map((item, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-xl shadow flex gap-4 items-center hover:scale-[1.01] transition"
              >
                <div className="w-24 h-24 rounded-lg overflow-hidden">
                  <img
                    src={
                      item.image?.startsWith("http")
                        ? item.image
                        : `/products/${item.image}`
                    }
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{item.productName}</h3>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <span className="font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT - SUMMARY */}
          <div className="lg:col-span-4">
            <div className="bg-surface-container-low p-8 rounded-xl sticky top-32">
              <h2 className="text-lg font-bold mb-4">Payment Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
              </div>

              <div className="border-t mt-6 pt-6 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="text-2xl font-bold text-primary">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* BUTTONS */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => {
                    navigate("/order-tracking", {
                      state: order,
                    });
                  }}
                  className="w-full py-4 rounded-xl text-white font-bold bg-gradient-to-r from-blue-600 to-blue-400"
                >
                  Track Order
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="w-full py-4 border rounded-xl text-primary font-bold"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmation;
