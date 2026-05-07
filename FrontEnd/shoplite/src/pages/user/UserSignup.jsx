import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

const UserSignup = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("signup");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      // REGISTER
      await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      // AUTO LOGIN
      const loginRes = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        loginRes.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(loginRes.data)
      );

      toast.success("Welcome to ShopLite ✨");

      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Signup failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#eef2ff] via-[#f8fafc] to-[#fdf2ff]">

      {/* SOFT GLOW */}
      <div className="absolute w-[400px] h-[400px] bg-purple-300/20 blur-[120px] top-[-100px] left-[-100px]"></div>

      <div className="absolute w-[350px] h-[350px] bg-pink-300/20 blur-[120px] bottom-[-100px] right-[-100px]"></div>

      <div className="absolute w-[500px] h-[500px] bg-violet-300/20 blur-[140px] rounded-full"></div>

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

      <div>

        {/* TITLE */}
        <h2 className="text-2xl font-extrabold text-gray-900 text-center">
          Create Account
        </h2>

        {/* SUBTITLE */}
        <p className="text-sm text-gray-500 mt-1">
          Start your shopping journey with{" "}
          <span className="font-semibold text-indigo-600">
            ShopLite
          </span>
        </p>

      </div>

      {/* SIGNUP CARD */}
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-xl hover:shadow-[0_30px_80px_rgba(80,90,255,0.25)] transition-all duration-300 p-8 rounded-2xl border border-white/20">

        {/* TOGGLE */}
        <div className="flex p-1 bg-gray-100 rounded-xl mb-8">

          <button
            onClick={() => {
              setActiveTab("login");
              navigate("/login");
            }}
            className={`flex-1 py-2.5 text-sm rounded-lg transition ${activeTab === "login"
              ? "bg-white shadow font-bold text-indigo-600"
              : "text-gray-500"
              }`}
          >
            Login
          </button>

          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-2.5 text-sm rounded-lg transition ${activeTab === "signup"
              ? "bg-white shadow font-bold text-indigo-600"
              : "text-gray-500"
              }`}
          >
            Sign Up
          </button>

        </div>



        {/* GOOGLE */}
        <div className="flex justify-center mb-8">

          <GoogleLogin
            text="signup_with"
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

                toast.error("Google signup failed");
              }
            }}
            onError={() => {
              toast.error("Google Signup Failed");
            }}
          />

        </div>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 mb-8">

          <div className="flex-1 h-[1px] bg-gray-200"></div>

          <span className="text-xs text-gray-400">
            OR REGISTER WITH EMAIL
          </span>

          <div className="flex-1 h-[1px] bg-gray-200"></div>

        </div>

        {/* FORM */}
        <form onSubmit={handleSignup} className="space-y-6">

          {/* ROW 1 */}
          <div className="grid md:grid-cols-2 gap-5">

            {/* NAME */}
            <div>

              <label className="text-sm text-gray-500">
                Full Name
              </label>

              <div className="relative mt-2">

                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                  person
                </span>

                <input
                  type="text"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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

          </div>

          {/* ROW 2 */}
          <div className="grid md:grid-cols-2 gap-5">

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

            {/* CONFIRM */}
            <div>

              <label className="text-sm text-gray-500">
                Confirm Password
              </label>

              <div className="relative mt-2">

                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                  verified_user
                </span>

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
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
              hover:scale-[1.01]
              active:scale-[0.98]
              transition-all duration-200
              flex items-center justify-center gap-2
            "
          >
            Create Account

            <span className="material-symbols-outlined text-lg">
              arrow_forward
            </span>

          </button>

        </form>

      </div>

      {/* FOOTER */}
      <div className="absolute bottom-0 left-0 w-full px-10 py-6 flex justify-between items-center text-sm text-gray-600">

        {/* LEFT */}
        <div className="text-lg font-bold tracking-wide">

          <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-pink-500 bg-clip-text text-transparent">
            ShopLite
          </span>

        </div>

        {/* CENTER */}
        <div className="text-sm text-gray-800 text-center hidden md:block font-medium">
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

export default UserSignup;