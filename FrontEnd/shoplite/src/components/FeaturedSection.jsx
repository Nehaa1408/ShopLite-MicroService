import React from "react";

const FeaturedSection = () => {
    return (
        <section className="px-6 md:px-12 py-12 max-w-[1400px] mx-auto">

            <div className="grid grid-cols-12 gap-6 items-end">

                {/* LEFT BIG CARD */}
                <div className="col-span-12 lg:col-span-7 group">
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-5 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2">

                        <div className="overflow-hidden rounded-2xl mb-4">
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNyPHgSwZ0e5gAj3y6wUgBFHPh3pPEbjqhrh8c1s2Xh8_vd1FS4h_7POI0hBwrO-dW5oL4wu_rA6OOCFBYHBsFsZ9S2IykHklspLeXA--fMoqcfF079h0pBsqyy_2LSOX1-5GUN59DcYA78ukv8m7DJ6RgkBymL1vT8_buacCjAx_pBjnQ-6UJgQEOjCZ9vptWSSaYw4SpkPXBbuCafQJ_EpSRJ71Tl3qoy7bcZJi72jfokAjoODTI6cfuscVbPLKDuWDYGZmrHPQ"
                                alt="Watch"
                                className="w-full h-[300px] md:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>

                        <span className="text-xs tracking-[0.2em] uppercase text-indigo-500 font-semibold">
                            Limited Edition
                        </span>

                        <h2 className="text-2xl md:text-3xl font-bold mt-2">
                            The Alabaster Horizon
                        </h2>

                        <p className="text-gray-500 mt-1">
                            Sculpted from ceramic and starlight.
                        </p>

                    </div>
                </div>

                {/* RIGHT STACK */}
                <div className="col-span-12 lg:col-span-5 flex flex-col justify-center gap-6 min-h-full">

                    {[
                        {
                            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2JWiZeMh8cVVIbnhj9LiWPMJyAYY0ciXLOoYtM0dktesX9C9JNqZ7oczqOl9NDvirhu_s6Km8onOUw7btsSLtEYSS6HjXSXGXrriavUgq12FCxiXSm_9FMNdI8CgiMDMOnVCDReDovAnb3PnCewOvp1IOlAM4MtOHG9Lb9JgjEY6pxzQN-vczWA5knZWk-vLpxxRGZqc1NT6yoSaLbkdCnWBXcprWD5hL04B1BFw_nrl1nvXrPxMR1-AbVf3GUjN7A8MD_UkIQ94",
                            title: "Prism Cam",
                            desc: "Instant Camera."
                        },
                        {
                            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtYcnlUsAvG_mn_q7qU6d54VlnuffSO4d7Pkc4cgs7_cGXQuYalbDUSNSTRn0hlNvCW-xLjYkf9NP-F-C3Swy_3F0Ai53aKjPMaS6iNGjbsdwarhd35OdmaI0pR5XXzhpFqEhvOP11sFPHroL7ySEf0S4tHx2wDnlXlCKZedtHoFCjFWOJss8QLauPAT852hEAu2iTVY_sPXdur1gl-wCPTfT7CCb07_WnE4nMrSPdGdbCAQzzy2Rbf2-So2qpU_MA3J-V1ngbimY",
                            title: "Velocity Red",
                            desc: "Pulse of the city."
                        },
                        {
                            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7Wepo_tPukT-TyBQsDee_yMlk0Iks9-WYRI-WuUeUoBi5esmKPXTIIJod8391hydShU_hOQukoR8EZuIFbzquAtiXIaYx_X9EqwWE6igFaonZ4jpUJhdLkPZ9WmUtzs08ZQ1tv2NpY1VfffmAlyt0b0hVmnbjXYNVtSrG8O_9rM8fKWJSZVzU1mESjT7PU0jVR8jAUvWJ5z35GRHDRz8Xv2CI3YhRJDqabdVVwjFYOSYGqqdFrTDNIcV78UQCMOFKdLmrmh76kow",
                            title: "Nexus Tab Pro",
                            desc: "Boundless vision."
                        }
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="group bg-white/80 backdrop-blur-xl rounded-3xl p-4 flex items-center gap-4 
              shadow-md transition-all duration-500 ease-out hover:-translate-x-6"
                        >
                            <div className="w-20 h-20 rounded-xl overflow-hidden">
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                        </div>
                    ))}

                </div>

            </div>
        </section>
    );
};

export default FeaturedSection;