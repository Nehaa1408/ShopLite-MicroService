import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const DeliveryLogin = () => {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });


    useEffect(() => {
        const token = sessionStorage.getItem("deliveryToken");
        const role = sessionStorage.getItem("deliveryRole");

        if (token && role === "DELIVERY") {
            navigate("/delivery/dashboard");
        }
    }, [navigate]);

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
                {
                    email: form.email,
                    password: form.password
                }
            );


            if (res.data.role !== "DELIVERY") {
                alert("This is not a delivery account");
                return;
            }


            sessionStorage.setItem("deliveryToken", res.data.token);
            sessionStorage.setItem("deliveryRole", res.data.role);

            navigate("/delivery/dashboard");

        } catch (err) {
            console.error("FULL ERROR:", err);

            if (err.response) {
                console.log("STATUS:", err.response.status);
                console.log("DATA:", err.response.data);
            }

            alert(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#fff7ed] via-[#fdf2f8] to-[#fff1f2]">

            {/* SOFT BACKGROUND GLOW */}
            <div className="absolute w-[450px] h-[450px] bg-rose-300/20 blur-[140px] top-[-120px] left-[-120px]"></div>
            <div className="absolute w-[400px] h-[400px] bg-orange-200/20 blur-[120px] bottom-[-100px] right-[-100px]"></div>
            <div className="absolute w-[500px] h-[500px] bg-pink-200/20 blur-[160px] rounded-full"></div>
            {/* TOP LEFT BRAND */}
            <div className="absolute top-6 left-8">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                    ShopLite
                </h1>
            </div>
            {/* LOGIN CARD */}
            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl hover:shadow-[0_20px_60px_rgba(244,114,182,0.20)] transition-all duration-300 p-10 rounded-2xl border border-white/20">
                <div className="text-center mb-8">

                    <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-rose-100 to-orange-100 flex items-center justify-center mb-4 shadow-sm">
                        <span className="material-symbols-outlined text-rose-500 text-3xl">
                            local_shipping
                        </span>
                    </div>

                    <h2 className="text-3xl font-extrabold">Delivery Login</h2>
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
                                placeholder="Delivery Email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 hover:bg-white transition border border-gray-200  focus:ring-2 focus:ring-rose-100 focus:border-rose-300 outline-none "
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
                        className="w-full py-3.5 rounded-xl text-white font-semibold bg-gradient-to-r from-rose-400 via-pink-500 to-orange-400 shadow-[0_10px_30px_rgba(244,114,182,0.35)]hover:shadow-[0_10px_30px_rgba(251,146,60,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        Login
                        <span className="material-symbols-outlined text-lg">
                            arrow_forward
                        </span>
                    </button>
                </form>

            </div >
            {/* FOOTER */}
            <div className="absolute bottom-0 left-0 w-full px-10 py-6 flex items-center text-sm text-gray-600">

                {/* LEFT */}
                <div className="w-1/3 text-left text-lg font-bold text-gray-900 tracking-wide">
                    ShopLite
                </div>

                {/* CENTER */}
                <div className="w-1/3 text-center font-medium text-gray-800">
                    © ShopLite Delivery. Fast & reliable.
                </div>

                {/* RIGHT */}
                <div className="w-1/3 flex justify-end gap-6 text-gray-800 font-medium">
                    <span className="cursor-pointer hover:text-black transition">Privacy</span>
                    <span className="cursor-pointer hover:text-black transition">Terms</span>
                    <span className="cursor-pointer hover:text-black transition">Support</span>
                </div>

            </div>
        </div >
    );
};

export default DeliveryLogin;
