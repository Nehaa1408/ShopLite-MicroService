import React from "react";

const Hero = () => {
    return (
        <section className="pt-10 md:pt-14 pb-6 md:pb-10 pl-8 md:pl-16 pr-4 md:pr-8 max-w-[1400px] mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">

                {/* LEFT */}
                <div className="space-y-6">

                    <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide">
                        NEW COLLECTIONS
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                        Elevate Your <br />
                        <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                            Shopping Experience
                        </span>
                    </h1>

                    <p className="text-gray-600 text-lg max-w-lg">
                        Discover a curated sanctuary of minimalist design and high-end technical refinement. Experience luxury redefined through ethereal aesthetics.
                    </p>

                </div>

                {/* RIGHT */}
                <div className="relative flex justify-center">

                    {/* GLOW */}
                    <div className="absolute w-[380px] h-[380px] bg-purple-400/40 blur-[120px] rounded-full"></div>

                    {/* PRODUCT */}
                    <div className="relative bg-black rounded-[32px] p-6 shadow-[0_60px_140px_rgba(0,0,0,0.45)] animate-[floatY_4s_ease-in-out_infinite]">

                        <img
                            src="/products/p1.webp"
                            alt="Product"
                            className="w-[320px] md:w-[380px] object-contain drop-shadow-2xl"
                        />

                        {/* FLOAT CARD */}
                        <div className="absolute -bottom-6 -right-6 bg-white/80 backdrop-blur-xl px-4 py-3 rounded-xl shadow-xl animate-[floatY_5s_ease-in-out_infinite]">
                            <p className="text-xs text-purple-500 font-semibold">
                                BEST SELLER
                            </p>
                            <p className="text-sm font-medium text-gray-700">
                                Ethereal Series 01
                            </p>
                            <p className="text-lg font-bold text-purple-600">
                                $400.00
                            </p>
                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
};

export default Hero;