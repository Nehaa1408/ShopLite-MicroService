import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log("STEP 1 TOKEN:", token);

    if (!token) {
      console.log("NO TOKEN → redirect");
      navigate("/login");
      return;
    }

    axios.get("http://localhost:8080/api/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log("PROFILE SUCCESS:", res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.log("PROFILE ERROR:", err);
        localStorage.removeItem("token");
        navigate("/login");
      });

  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  if (!user) return <div className="p-10 text-center">Loading profile...</div>;
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
            <span className="material-symbols-outlined">home</span>
          </button>

          {/* CART */}
          <button
            onClick={() => navigate("/cart")}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
          </button>

          {/* PROFILE (ACTIVE) */}
          <button className="text-blue-600 border-b-2 border-blue-600 p-2 rounded-lg">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </nav>

      <main className="pt-24 px-6 max-w-5xl mx-auto space-y-8">
        {/* PROFILE CARD */}
        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>

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
          <h2 className="text-lg font-bold mb-4">Personal Information</h2>

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

            <input className="p-3 bg-gray-100 rounded-lg" placeholder="Phone" />

            <input
              className="p-3 bg-gray-100 rounded-lg"
              placeholder="Address"
            />
          </div>
        </div>

        {/* ORDER SECTION */}
        <div>
          <h2 className="text-lg font-bold mb-4">Order Activity</h2>

          <div className="space-y-3">
            <div
              onClick={() => navigate("/orders")}
              className="p-4 bg-white rounded-xl shadow cursor-pointer hover:bg-gray-50"
            >
              Track Orders →
            </div>

            <div
              onClick={() => navigate("/orders")}
              className="p-4 bg-white rounded-xl shadow cursor-pointer hover:bg-gray-50"
            >
              Order History →
            </div>
          </div>
        </div>

        {/* SETTINGS */}
        <div>
          <h2 className="text-lg font-bold mb-4">Account Settings</h2>

          <div className="bg-white rounded-xl shadow divide-y">
            <div className="p-4 cursor-pointer hover:bg-gray-50">
              Change Password
            </div>

            <div className="p-4 cursor-pointer hover:bg-gray-50">
              Notifications
            </div>

            <div
              onClick={handleLogout}
              className="p-4 text-red-600 font-bold cursor-pointer hover:bg-red-50"
            >
              Logout
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
