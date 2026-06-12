import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    const role = sessionStorage.getItem("adminRole");

    if (token && role === "ADMIN") {
      navigate("/admin");
    }
  }, []);
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email: form.email,
          password: form.password,
          role: "ADMIN",
          provider: "LOCAL"
        }
      );
      sessionStorage.setItem("adminToken", res.data.token);
      sessionStorage.setItem("adminRole", res.data.role);

      navigate("/admin");

    } catch (err) {
      console.error("FULL ERROR:", err);

      if (err.response) {
        console.log("STATUS:", err.response.status);
        console.log("DATA:", err.response.data);   
      }

      alert(err.response?.data || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#eef2ff] via-[#f8fafc] to-[#fdf2ff]">

      {/* SOFT BACKGROUND GLOW */}
      <div className="absolute w-[400px] h-[400px] bg-purple-300/20 blur-[120px] top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[350px] h-[350px] bg-blue-300/20 blur-[120px] bottom-[-100px] right-[-100px]"></div>
      <div className="absolute w-[500px] h-[500px] bg-purple-400/20 blur-[140px] rounded-full"></div>
      {/* TOP LEFT BRAND */}
      <div className="absolute top-6 left-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          ShopLite
        </h1>
      </div>
      {/* LOGIN CARD */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl hover:shadow-[0_30px_80px_rgba(80,90,255,0.25)] transition-all duration-300 p-10 rounded-2xl border border-white/20">
        <div className="text-center mb-8">

          <div className="w-14 h-14 mx-auto rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">
              shield_person
            </span>
          </div>

          <h2 className="text-3xl font-extrabold">Admin Login</h2>
          <p className="text-sm text-on-surface-variant">
            Secure access to the ShopLite portal
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-500">Email Address</label>
            <div className="relative mt-2">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                mail
              </span>
              <input
                type="email"
                placeholder="Administrator Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 hover:bg-white transition border border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none "
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-500">Password</label>
            <div className="relative mt-2">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                lock
              </span>
              <input
                type="password"
                placeholder="••••••••"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/60 border border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none transition"
              />
            </div>
          </div>

          {/* OPTIONS */}
          <div className="flex justify-between items-center text-xs">
            <label className="flex items-center gap-2 text-gray-500">
              <input type="checkbox" />
              Keep me logged in
            </label>

            <span className="cursor-pointer text-gray-400 hover:text-purple-400 transition">
              Forgot Password?
            </span>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-white font-semibold 
    bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#a855f7] shadow-[0_10px_30px_rgba(124,58,237,0.45)]
    
    hover:shadow-[0_10px_30px_rgba(123,140,255,0.45)] 
    hover:scale-[1.02] active:scale-[0.98] 
    transition-all duration-200 
    flex items-center justify-center gap-2"
          >
            Login
            <span className="material-symbols-outlined text-lg">
              arrow_forward
            </span>
          </button>
        </form>

      </div >
      {/* FOOTER */}
      <div className="absolute bottom-0 left-0 w-full px-10 py-6 flex justify-between items-center text-sm text-gray-600">

        {/* LEFT */}
        <div className="text-lg font-bold text-gray-900 tracking-wide">
          ShopLite
        </div>

        {/* CENTER */}
        {/* CENTER */}
        <div className="text-sm text-gray-800 text-center hidden md:block font-medium">
          © ShopLite Admin. Designed for calm productivity.
        </div>

        {/* RIGHT */}
        <div className="flex gap-6 text-gray-800 font-medium">
          <span className="cursor-pointer hover:text-black transition">Privacy</span>
          <span className="cursor-pointer hover:text-black transition">Terms</span>
          <span className="cursor-pointer hover:text-black transition">Support</span>
        </div>

      </div>
    </div >
  );
};

export default AdminLogin;
