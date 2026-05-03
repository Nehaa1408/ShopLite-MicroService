import React from "react";

const Footer = () => {
    return (
        <footer className="w-full mt-16 border-t border-gray-200 bg-[#f8f9ff]">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">

                {/* TOP GRID */}
                <div className="grid md:grid-cols-4 gap-10">

                    {/* BRAND */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800">ShopLite</h2>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Ethereal commerce for the modern minimalist. High-end products designed for lifetime value.
                        </p>

                        {/* SOCIAL */}
                        <div className="flex gap-3 pt-2">
                            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:scale-105 transition cursor-pointer">🌐</div>
                            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:scale-105 transition cursor-pointer">💬</div>
                            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:scale-105 transition cursor-pointer">@</div>
                        </div>
                    </div>

                    {/* SHOP */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-700 tracking-wide">SHOP</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li className="hover:text-indigo-600 cursor-pointer">Collection</li>
                            <li className="hover:text-indigo-600 cursor-pointer">New Arrivals</li>
                            <li className="hover:text-indigo-600 cursor-pointer">Best Sellers</li>
                        </ul>
                    </div>

                    {/* COMPANY */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-700 tracking-wide">COMPANY</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li className="hover:text-indigo-600 cursor-pointer">Sustainability</li>
                            <li className="hover:text-indigo-600 cursor-pointer">Care</li>
                            <li className="hover:text-indigo-600 cursor-pointer">Privacy</li>
                        </ul>
                    </div>

                    {/* NEWSLETTER */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700 tracking-wide">NEWSLETTER</h3>

                        <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm border">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="flex-1 text-sm outline-none bg-transparent"
                            />
                            <button className="ml-2 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:scale-105 transition">
                                →
                            </button>
                        </div>
                    </div>

                </div>

                {/* BOTTOM */}
                <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                    <p>© ShopLite. Ethereal Commerce.</p>

                    <div className="flex gap-6">
                        <span className="hover:text-indigo-600 cursor-pointer">Instagram</span>
                        <span className="hover:text-indigo-600 cursor-pointer">Pinterest</span>
                        <span className="hover:text-indigo-600 cursor-pointer">Twitter</span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;