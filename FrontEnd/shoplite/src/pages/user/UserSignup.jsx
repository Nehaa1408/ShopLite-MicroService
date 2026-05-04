import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

const UserSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      console.log("DATA:", { name, email, password });
      await axios.post("http://localhost:8080/api/auth/register", {
        name,
        email,
        password,
      });
      const loginRes = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email,
          password,
        }
      );


      localStorage.setItem("token", loginRes.data.token);
      localStorage.setItem("user", JSON.stringify(loginRes.data));

      navigate("/");
    } catch (err) {
      console.error(err);

      if (err.response && err.response.data) {
        alert(err.response.data.message);
      } else {
        alert("Signup failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f5ff] via-[#ece8ff] to-[#859aff] relative overflow-x-hidden font-body text-on-surface">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full backdrop-blur-xl bg-white/60">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <h1 className="text-2xl font-black text-blue-700">ShopLite</h1>

          <div className="hidden md:flex gap-8 items-center">
            <span className="cursor-pointer text-gray-500 hover:text-blue-500">
              Shop
            </span>
            <span className="cursor-pointer text-gray-500 hover:text-blue-500">
              Categories
            </span>
            <span className="cursor-pointer text-gray-500 hover:text-blue-500">
              About
            </span>

            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* GLOW EFFECT */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200 rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-pink-200 rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-200 rounded-full blur-[120px] opacity-40"></div>

      {/* MAIN */}
      <main className="pt-32 pb-20 px-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          {/* TITLE */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold mb-2">Create an Account</h1>
            <p className="text-gray-500">
              Start your simplified shopping experience today.
            </p>
          </div>

          {/* CARD */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-xl shadow">
            {/* SOCIAL */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* GOOGLE */}
              <GoogleLogin
                text="signup_with"
                onSuccess={async (credentialResponse) => {
                  try {
                    const res = await axios.post(
                      "http://localhost:8080/api/auth/google",
                      {
                        token: credentialResponse.credential,
                      }
                    );

                    localStorage.setItem("token", res.data.token);
                    localStorage.setItem("user", JSON.stringify(res.data));

                    toast.success("Welcome back ShopLite 🚀");

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

              {/* iOS */}
              <button className="flex items-center justify-center py-3 bg-gray-100 rounded-lg hover:bg-gray-200">
                <span className="text-sm font-medium">iOS</span>
              </button>
            </div>

            {/* DIVIDER */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-[1px] bg-gray-200"></div>
              <span className="text-xs text-gray-400">
                OR REGISTER WITH EMAIL
              </span>
              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSignup} className="space-y-4">
              {/* NAME */}
              <div>
                <label className="text-xs text-gray-500">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  className="w-full p-3 rounded-lg bg-gray-100 mt-1 outline-none"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-xs text-gray-500">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full p-3 rounded-lg bg-gray-100 mt-1 outline-none"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* PASSWORDS */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="password"
                  placeholder="Password"
                  className="p-3 rounded-lg bg-gray-100 outline-none"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Confirm"
                  className="p-3 rounded-lg bg-gray-100 outline-none"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-400 text-white font-bold rounded-lg shadow hover:opacity-90"
              >
                Create & Continue →
              </button>

              {/* TERMS */}
              <p className="text-[10px] text-center text-gray-400">
                By creating an account, you agree to Terms of Service and
                Privacy Policy.
              </p>
            </form>
          </div>

          {/* LOGIN LINK */}
          <p className="text-center mt-6 text-sm text-gray-500">
            Already have an account?
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 font-bold ml-1 cursor-pointer"
            >
              Login
            </span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default UserSignup;
