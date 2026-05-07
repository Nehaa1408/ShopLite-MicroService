import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext";

const UserLogin = () => {
  const navigate = useNavigate();
  const { mergeGuestCartAfterLogin } = useCart();

  const [activeTab, setActiveTab] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);

      await mergeGuestCartAfterLogin();
      localStorage.setItem(
        "user",
        JSON.stringify(res.data)
      );

      toast.success("Welcome to ShopLite ✨");

      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (err) {
      console.error(err);

      if (err.response) {
        const message = err.response.data?.message;

        if (message?.includes("User not found")) {
          toast.error("User not registered");
        } else if (message?.includes("Invalid password")) {
          toast.error("Wrong password");
        } else {
          toast.error("Invalid credentials");
        }
      } else {
        toast.error("Server error");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#eef2ff] via-[#f8fafc] to-[#fdf2ff]">

      {/* SOFT BACKGROUND GLOW */}
      <div className="absolute w-[400px] h-[400px] bg-purple-300/20 blur-[120px] top-[-100px] left-[-100px]"></div>

      <div className="absolute w-[350px] h-[350px] bg-pink-300/20 blur-[120px] bottom-[-100px] right-[-100px]"></div>

      <div className="absolute w-[500px] h-[500px] bg-violet-300/20 blur-[140px] rounded-full"></div>

      {/* TOP LEFT BRAND */}
      <div className="absolute top-6 left-8">

        <h1
          onClick={() => navigate("/")}
          className="text-2xl md:text-3xl font-extrabold tracking-tight cursor-pointer"
        >
          <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-pink-500 bg-clip-text text-transparent">
            ShopLite
          </span>
        </h1>

      </div>

      {/* LOGIN CARD */}
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-xl hover:shadow-[0_30px_80px_rgba(80,90,255,0.25)] transition-all duration-300 p-8 rounded-2xl border border-white/20">

        {/* TOGGLE */}
        <div className="flex p-1 bg-gray-100 rounded-xl mb-8">

          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-2.5 text-sm rounded-lg transition ${activeTab === "login"
              ? "bg-white shadow font-bold text-indigo-600"
              : "text-gray-500"
              }`}
          >
            Login
          </button>

          <button
            onClick={() => {
              setActiveTab("signup");
              navigate("/signup");
            }}
            className={`flex-1 py-2.5 text-sm rounded-lg transition ${activeTab === "signup"
              ? "bg-white shadow font-bold text-indigo-600"
              : "text-gray-500"
              }`}
          >
            Sign Up
          </button>

        </div>

        {/* TITLE */}
        <div className="text-center mb-8">

          <div className="w-14 h-14 mx-auto rounded-lg bg-gradient-to-br from-pink-100 to-indigo-100 flex items-center justify-center mb-4">

            <span className="material-symbols-outlined text-indigo-600 text-3xl">
              shopping_bag
            </span>

          </div>

          <h2 className="text-3xl font-extrabold text-gray-900">
            User Login
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Continue your shopping journey with{" "}
            <span className="font-semibold text-indigo-600">
              ShopLite
            </span>
          </p>

        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-6">

          <div className="grid md:grid-cols-2 gap-5">

            {/* EMAIL */}
            <div>

              <label className="text-sm text-gray-500">
                Email Address
              </label>

              <div className="relative mt-2">

                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                  mail
                </span>

                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
          w-full
          pl-10
          pr-4
          py-3
          rounded-xl
          bg-white/80
          hover:bg-white
          transition
          border border-gray-200
          focus:border-pink-300
          focus:ring-2
          focus:ring-pink-100
          outline-none
        "
                />

              </div>
            </div>

            {/* PASSWORD */}
            <div>

              <label className="text-sm text-gray-500">
                Password
              </label>

              <div className="relative mt-2">

                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                  lock
                </span>

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
          w-full
          pl-10
          pr-4
          py-3
          rounded-xl
          bg-white/60
          border border-gray-200
          focus:border-pink-300
          focus:ring-2
          focus:ring-pink-100
          outline-none
          transition
        "
                />

              </div>
            </div>

          </div>
          {/* OPTIONS */}
          <div className="flex justify-between items-center text-xs">

            <label className="flex items-center gap-2 text-gray-500">
              <input type="checkbox" />
              Keep me logged in
            </label>

            <span className="cursor-pointer text-gray-400 hover:text-pink-400 transition">
              Forgot Password?
            </span>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="
              w-full
              py-3.5
              rounded-xl
              text-white
              font-semibold
              bg-gradient-to-r
              from-[#6366f1]
              via-[#7c3aed]
              to-[#ec4899]
              shadow-[0_10px_30px_rgba(124,58,237,0.45)]
              hover:shadow-[0_10px_30px_rgba(236,72,153,0.35)]
              hover:scale-[1.02]
              active:scale-[0.98]
              transition-all duration-200
              flex items-center justify-center gap-2
            "
          >
            Login

            <span className="material-symbols-outlined text-lg">
              arrow_forward
            </span>

          </button>

        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 my-8">

          <div className="flex-1 h-[1px] bg-gray-200"></div>

          <span className="text-xs text-gray-400">
            OR CONTINUE WITH
          </span>

          <div className="flex-1 h-[1px] bg-gray-200"></div>

        </div>

        {/* GOOGLE LOGIN */}
        <div className="flex justify-center">

          <GoogleLogin
            text="signin_with"
            size="large"
            theme="outline"
            onSuccess={async (credentialResponse) => {
              try {
                const res = await axios.post(
                  "http://localhost:8080/api/auth/google",
                  {
                    token: credentialResponse.credential,
                  }
                );

                localStorage.setItem(
                  "token",
                  res.data.token
                );

                await mergeGuestCartAfterLogin();

                localStorage.setItem(
                  "user",
                  JSON.stringify(res.data)
                );

                toast.success("Welcome to ShopLite ✨");

                setTimeout(() => {
                  navigate("/");
                }, 1000);

              } catch (err) {
                console.error(err);

                toast.error("Google login failed");
              }
            }}
            onError={() => {
              toast.error("Google Login Failed");
            }}
          />

        </div>

      </div>

      {/* FOOTER */}
      <div className="absolute bottom-0 left-0 w-full px-10 py-6 flex justify-between items-center text-sm text-gray-600">

        {/* LEFT */}
        <div className="text-sm  text-gray-800 text-center hidden md:block font-medium">
          © ShopLite Shopping. Crafted for seamless buying.

        </div>



        {/* RIGHT */}
        <div className="flex gap-6 text-gray-800 font-medium">

          <span className="cursor-pointer hover:text-pink-500 transition">
            Privacy
          </span>

          <span className="cursor-pointer hover:text-pink-500 transition">
            Terms
          </span>

          <span className="cursor-pointer hover:text-pink-500 transition">
            Support
          </span>

        </div>

      </div>

    </div>
  );
};

export default UserLogin;