import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DeliverySignup = () => {

    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: ""
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

    const handleSignup = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {

            const response = await axios.post(
                "http://localhost:8080/api/delivery/register",
                {
                    name: form.name,
                    phone: form.phone,
                    email: form.email,
                    password: form.password
                }

            );
            sessionStorage.setItem(
                "deliveryToken",
                response.data.token
            );

            sessionStorage.setItem(
                "deliveryRole",
                response.data.role
            );
            setSuccess(true);

            setTimeout(() => {
                navigate("/delivery/verification");
            }, 2000);

        } catch (err) {

            console.error("FULL ERROR:", err);

            if (err.response) {
                console.log("STATUS:", err.response.status);
                console.log("DATA:", err.response.data);
            }

            alert(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#fff7ed] via-[#fdf2f8] to-[#fff1f2]">

            {/* BACKGROUND GLOW */}
            <div className="absolute w-[450px] h-[450px] bg-rose-300/20 blur-[140px] top-[-120px] left-[-120px]"></div>

            <div className="absolute w-[400px] h-[400px] bg-orange-200/20 blur-[120px] bottom-[-100px] right-[-100px]"></div>

            <div className="absolute w-[500px] h-[500px] bg-pink-200/20 blur-[160px] rounded-full"></div>

            {/* BRAND */}
            <div className="absolute top-6 left-8">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                    ShopLite
                </h1>
            </div>

            {/* CARD */}
            <div className="w-full max-w-3xl bg-white/80 backdrop-blur-xl hover:shadow-[0_20px_60px_rgba(244,114,182,0.20)] transition-all duration-300 p-8 rounded-2xl border border-white/20">

                <div className="text-center mb-6">

                    <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-rose-100 to-orange-100 flex items-center justify-center mb-4 shadow-sm">
                        <span className="material-symbols-outlined text-rose-500 text-3xl">
                            person_add
                        </span>
                    </div>

                    <h2 className="text-3xl font-extrabold">
                        Delivery Signup
                    </h2>

                    <p className="text-sm text-gray-500 mt-2">
                        Create your ShopLite delivery account
                    </p>

                </div>
                {/* SUCCESS MESSAGE */}
                {
                    success && (
                        <div
                            className="bg-green-50 border border-green-200 
            text-green-700 px-4 py-3 rounded-xl
            flex items-center gap-3 animate-pulse"
                        >
                            <span className="material-symbols-outlined">
                                check_circle
                            </span>

                            <span className="font-medium">
                                Account created successfully...
                            </span>
                        </div>
                    )
                }
                {/* FORM */}
                <form onSubmit={handleSignup} className="space-y-5">
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
                                placeholder="Enter Full Name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 border border-gray-200 focus:ring-2 focus:ring-rose-100 focus:border-rose-300 outline-none"
                            />

                        </div>
                    </div>
                    {/* PHONE + EMAIL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* PHONE */}
                        <div>
                            <label className="text-sm text-gray-500">
                                Phone Number
                            </label>

                            <div className="relative mt-2">

                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                                    call
                                </span>

                                <input
                                    type="text"
                                    placeholder="Enter Phone Number"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 border border-gray-200 focus:ring-2 focus:ring-rose-100 focus:border-rose-300 outline-none"
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
                                    placeholder="Delivery Email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 border border-gray-200 focus:ring-2 focus:ring-rose-100 focus:border-rose-300 outline-none"
                                />

                            </div>
                        </div>

                    </div>

                    {/* PASSWORDS SIDE BY SIDE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

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
                                    placeholder="Enter Password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 border border-gray-200 focus:ring-2 focus:ring-rose-100 focus:border-rose-300 outline-none"
                                />

                            </div>
                        </div>

                        {/* CONFIRM PASSWORD */}
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
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 border border-gray-200 focus:ring-2 focus:ring-rose-100 focus:border-rose-300 outline-none"
                                />

                            </div>
                        </div>

                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl text-white font-semibold bg-gradient-to-r from-rose-400 via-pink-500 to-orange-400 shadow-[0_10px_30px_rgba(244,114,182,0.35)] hover:shadow-[0_10px_30px_rgba(251,146,60,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        Create Account

                        <span className="material-symbols-outlined text-lg">
                            arrow_forward
                        </span>
                    </button>

                    {/* LOGIN TOGGLE */}
                    <div className="text-center text-sm text-gray-500">

                        Already have an account?{" "}

                        <span
                            onClick={() => navigate("/delivery")}
                            className="text-rose-500 font-semibold cursor-pointer hover:text-rose-600 transition"
                        >
                            Login
                        </span>

                    </div>

                </form>

            </div>

            {/* FOOTER */}
            <div className="absolute bottom-0 left-0 w-full px-10 py-6 flex items-center text-sm text-gray-600">

                <div className="w-1/3 text-left text-lg font-bold text-gray-900 tracking-wide">
                    ShopLite
                </div>

                <div className="w-1/3 text-center font-medium text-gray-800">
                    © ShopLite Delivery. Fast & reliable.
                </div>

                <div className="w-1/3 flex justify-end gap-6 text-gray-800 font-medium">

                    <span className="cursor-pointer hover:text-black transition">
                        Privacy
                    </span>

                    <span className="cursor-pointer hover:text-black transition">
                        Terms
                    </span>

                    <span className="cursor-pointer hover:text-black transition">
                        Support
                    </span>

                </div>

            </div>

        </div>
    );
};

export default DeliverySignup;