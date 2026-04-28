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
        "http://localhost:8080/api/auth/login",
        form
      );


      sessionStorage.setItem("adminToken", res.data.token);
      sessionStorage.setItem("adminRole", res.data.role);

      navigate("/admin");

    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#f9f5ff] to-[#ece8ff] relative overflow-hidden">
      {/* HEADER */}
      <div className="absolute top-0 w-full flex justify-between px-8 py-6">
        <h1 className="text-2xl font-black text-primary">ShopLite Admin</h1>
        <span className="text-sm cursor-pointer hover:text-primary">Help</span>
      </div>

      {/* LOGIN CARD */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-xl shadow-[0px_12px_32px_rgba(43,42,81,0.06)] border border-white/40">
        {/* ICON */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-4">
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
            <label className="text-sm text-on-surface-variant">
              Email Address
            </label>
            <div className="relative mt-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                mail
              </span>
              <input
                type="email"
                placeholder="admin@shoplite.com"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-surface-container-highest/40 rounded-lg outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-on-surface-variant">Password</label>
            <div className="relative mt-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                lock
              </span>
              <input
                type="password"
                placeholder="••••••••"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-surface-container-highest/40 rounded-lg outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* OPTIONS */}
          <div className="flex justify-between items-center text-xs">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Keep me logged in
            </label>

            <span className="text-primary cursor-pointer font-semibold">
              Forgot Password?
            </span>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full py-4 rounded-lg text-white font-bold bg-gradient-to-r from-primary to-primary-container shadow-lg hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
          >
            Login
            <span className="material-symbols-outlined text-lg">
              arrow_forward
            </span>
          </button>
          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-[1px] bg-gray-200"></div>
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-[1px] bg-gray-200"></div>
          </div>

          {/* SOCIAL LOGIN */}
          <div className="flex gap-4">
            {/* GOOGLE */}
            <button type="button" className="flex-1 py-3 rounded-lg border border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50 transition">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5 h-5"
              />
              <span className="text-sm font-medium">Google</span>
            </button>

            {/* iOS */}
            <button type="button" className="flex-1 py-3 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">
              <span className="text-sm font-medium">iOS</span>
            </button>
          </div>
          {/* SIGN UP BUTTON */}
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={() => navigate("/admin/signup")}
              className="text-sm font-bold text-primary hover:underline"
            >
              Sign Up
            </button>
          </div>
        </form>

        {/* FOOTER */}
        <div className="mt-8 pt-6 border-t text-center text-xs text-gray-500">
          🔒 Protected by 256-bit encryption
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
