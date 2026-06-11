import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    axios.get(
      "http://localhost:8080/api/users/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });

  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user) {
    return (
      <div className="p-10 text-center">
        Loading profile...
      </div>
    );
  }

  const isDeliveryPartner =
    user.role === "DELIVERY";

  const handleBecomePartner = async () => {

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8080/api/delivery/apply",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      navigate("/delivery/verification");

    } catch (error) {

      console.error(error);

      alert("Unable to start delivery application");
    }
  };

  return (

    <div className="bg-[#f9f5ff] min-h-screen text-[#2b2a51]">

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl shadow px-8 h-16 flex justify-between items-center z-50">

        <div className="flex gap-6 items-center">

          {/* HOME */}
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <span className="material-symbols-outlined">
              home
            </span>
          </button>

          {/* CART */}
          <button
            onClick={() => navigate("/cart")}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <span className="material-symbols-outlined">
              shopping_cart
            </span>
          </button>

          {/* PROFILE */}
          <button className="text-blue-600 border-b-2 border-blue-600 p-2 rounded-lg">

            <span className="material-symbols-outlined">
              account_circle
            </span>

          </button>

        </div>

      </nav>

      <main className="pt-24 px-6 max-w-5xl mx-auto space-y-8">

        {/* PROFILE CARD */}
        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow flex flex-col md:flex-row items-center gap-6">

          <div className="flex-1 text-center md:text-left">

            <h2 className="text-2xl font-bold">
              {user.name}
            </h2>

            <p className="text-gray-500">
              {user.email}
            </p>

            <div className="flex gap-3 mt-3 justify-center md:justify-start">

              <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                {user.role}
              </span>

            </div>

          </div>

          <button className="px-5 py-2 bg-blue-600 text-white rounded-lg">
            Edit Profile
          </button>

        </div>

        {/* PERSONAL INFO */}
        <div>

          <h2 className="text-lg font-bold mb-4">
            Personal Information
          </h2>

          <div className="bg-white p-6 rounded-xl shadow grid md:grid-cols-2 gap-4">

            <input
              className="p-3 bg-gray-100 rounded-lg"
              value={user.name}
              readOnly
            />

            <input
              className="p-3 bg-gray-100 rounded-lg"
              value={user.email}
              readOnly
            />

            <input
              className="p-3 bg-gray-100 rounded-lg"
              placeholder="Phone"
            />

            <input
              className="p-3 bg-gray-100 rounded-lg"
              placeholder="Address"
            />

          </div>

        </div>

        {/* ORDER SECTION */}
        <div>

          <h2 className="text-lg font-bold mb-4">
            Order Activity
          </h2>

          <div className="space-y-3">

            <div
              onClick={() => navigate("/orders")}
              className="p-4 bg-white rounded-xl shadow cursor-pointer hover:bg-gray-50"
            >
              Order History →
            </div>

            <div
              onClick={() => navigate("/tickets")}
              className="p-4 bg-white rounded-xl shadow cursor-pointer hover:bg-gray-50"
            >
              Tickets →
            </div>

          </div>

        </div>

        {/* NORMAL USER */}
        {!isDeliveryPartner && (

          <div>

            <h2 className="text-lg font-bold mb-4">
              Delivery Partner
            </h2>

            <div
              className="relative overflow-hidden

              bg-gradient-to-br
              from-orange-50
              via-rose-50
              to-pink-50

              rounded-3xl

              p-8

              shadow-[0_10px_40px_rgba(244,114,182,0.10)]

              border border-white/40"
            >

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">

                {/* LEFT */}
                <div className="flex-1">

                  <div className="flex items-center gap-4 mb-4">

                    <div
                      className="w-16 h-16 rounded-2xl

                      bg-gradient-to-br
                      from-rose-400
                      to-orange-400

                      flex items-center justify-center

                      text-white shadow-lg"
                    >

                      <span className="material-symbols-outlined text-3xl">
                        local_shipping
                      </span>

                    </div>

                    <div>

                      <h3 className="text-2xl font-black text-gray-800">
                        Become a Delivery Partner
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Interested in joining the ShopLite delivery network?
                      </p>

                    </div>

                  </div>

                  <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-5 border border-white/50">

                    <p className="text-sm text-gray-600 leading-relaxed">

                      Submit your verification details and required documents.

                      Our admin team will review your application and approve your account.

                    </p>

                  </div>

                </div>

                {/* RIGHT */}
                <div className="flex flex-col sm:flex-row gap-4">

                  <button
                    onClick={() => navigate("/")}
                    className="px-6 py-3 rounded-2xl

                    bg-white

                    text-gray-700

                    font-semibold

                    border border-gray-200

                    hover:bg-gray-50

                    transition-all duration-300"
                  >
                    Continue Shopping
                  </button>

                  <button
                    onClick={handleBecomePartner}
                    className="px-8 py-3 rounded-2xl text-white font-semibold

                    bg-gradient-to-r
                    from-rose-400
                    via-pink-500
                    to-orange-400

                    hover:scale-105

                    active:scale-95

                    transition-all duration-300"
                  >
                    I&apos;m Interested
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* DELIVERY USER */}
        {isDeliveryPartner && (

          <div>

            <h2 className="text-lg font-bold mb-4">
              Delivery Dashboard
            </h2>

            <div
              className="bg-gradient-to-br

              from-indigo-50
              via-purple-50
              to-blue-50

              rounded-3xl

              p-8

              border border-white/40

              shadow-[0_10px_40px_rgba(99,102,241,0.12)]"
            >

              <div className="flex items-center justify-between flex-col md:flex-row gap-6">

                <div className="flex items-center gap-5">

                  <div
                    className="w-16 h-16 rounded-2xl

                    bg-gradient-to-br
                    from-indigo-500
                    to-purple-500

                    text-white

                    flex items-center justify-center"
                  >

                    <span className="material-symbols-outlined text-3xl">
                      local_shipping
                    </span>

                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">

                    <div className="bg-white/70 rounded-2xl p-4">
                      <p className="text-xs text-gray-400 mb-1">
                        Phone Number
                      </p>

                      <h4 className="font-bold text-gray-800">
                        {user.phone || "Not Added"}
                      </h4>
                    </div>

                    <div className="bg-white/70 rounded-2xl p-4">
                      <p className="text-xs text-gray-400 mb-1">
                        Total Deliveries
                      </p>

                      <h4 className="font-bold text-gray-800">
                        {user.totalDeliveries || 0}
                      </h4>
                    </div>

                    <div className="bg-white/70 rounded-2xl p-4">
                      <p className="text-xs text-gray-400 mb-1">
                        Rating
                      </p>

                      <h4 className="font-bold text-yellow-500">
                        ⭐ {user.deliveryRating || 0}
                      </h4>
                    </div>

                    <div className="bg-white/70 rounded-2xl p-4">
                      <p className="text-xs text-gray-400 mb-1">
                        Account Type
                      </p>

                      <h4 className="font-bold text-indigo-600">
                        Delivery Partner
                      </h4>
                    </div>

                  </div>

                </div>

                <button
                  onClick={() => navigate("/delivery/dashboard")}
                  className="px-8 py-3 rounded-2xl

                  text-white font-semibold

                  bg-gradient-to-r
                  from-indigo-500
                  to-purple-500

                  hover:scale-105

                  transition-all duration-300"
                >
                  Open Dashboard
                </button>

              </div>

            </div>

          </div>
        )}

        {/* SETTINGS */}
        <div>

          <div
            onClick={handleLogout}
            className="p-4 text-red-600 font-bold cursor-pointer hover:bg-red-50"
          >
            Logout
          </div>

        </div>

      </main >

    </div >
  );
};

export default Profile;