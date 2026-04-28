import React from "react";
import { useParams, useNavigate } from "react-router-dom";
const BrandDetails = () => {
    const { brandName } = useParams();
    const navigate = useNavigate();
    const brandData = {
        aurel: {
            title: "AUREL",
            tagline: "Crafted for Timeless Luxury",
            description:
                "AUREL represents the synthesis of traditional European craftsmanship and futuristic textile engineering.",
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCsieYH0qA2HwjVuNVerN36DjHqTDfrXfM2rg8XPGJx3xyQhOcOJX2oX-6Y_ExSIV3wLCXKhStwzfnB8F8KfaowMbRkdbgwqYVUfgjOoIWBBpLvANhzay6xfFOnKqB6Nby026pus-cUPoUmtqNdL2siOoHGrPWda7UIqvOLY_Vcu1l9kOfWkNOodUpk5BGiNv5teVUU-YWng8KHyHqEI1e2noztmQEnTw2PWX52dr-hD71EfvvwC31FB6l1lQ2ovAqObYMejzU4jzE",
        },

        novaire: {
            title: "NOVAIRE",
            tagline: "Designed for Modern Travel",
            description:
                "NOVAIRE blends innovation with mobility, creating gear built for explorers of the modern world.",
            image:
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        },

        lumora: {
            title: "LUMORA",
            tagline: "Glow Beyond Skin",
            description:
                "LUMORA redefines skincare with science-driven formulas and radiant minimalism.",
            image:
                "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
        },

        kynex: {
            title: "KYNEX",
            tagline: "Future Tech Essentials",
            description:
                "KYNEX engineers cutting-edge accessories for a seamless digital lifestyle.",
            image:
                "https://images.unsplash.com/photo-1518770660439-4636190af475",
        },
    };
    const brand = brandData[brandName] || brandData["aurel"];
    console.log(brandName);

    return (
        <div className="relative min-h-screen">

            {/*  FIXED BACKGROUND */}
            <div className="fixed inset-0 -z-20
  bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/60" />

            {/*  FIXED GLOW */}
            <div className="fixed inset-0 -z-10 pointer-events-none">

                {/* LEFT SOFT */}
                <div className="absolute top-[-80px] left-[-100px] w-[500px] h-[500px]
    bg-indigo-500/30 blur-[160px] rounded-full" />

                {/* RIGHT SOFT */}
                <div className="absolute bottom-[-80px] right-[-100px] w-[500px] h-[500px]
    bg-purple-600/30 blur-[160px] rounded-full" />

            </div>

            <div className="absolute top-[35%] left-1/2 -translate-x-1/2
  w-[700px] h-[300px]
  bg-indigo-600/30 blur-[140px] rounded-full" />


            {/* NAVBAR */}
            <nav className="fixed top-0 w-full z-50 bg-white/20 backdrop-blur-xl border-b border-white/20 shadow-[0_8px_32px_rgba(99,102,241,0.05)]">
                <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
                    <div
                        onClick={() => navigate("/")}
                        className="text-2xl font-black tracking-tighter text-slate-900 font-display-xl cursor-pointer hover:opacity-80 transition"
                    >
                        ShopLite
                    </div>

                    <div className="hidden md:flex gap-x-8 items-center uppercase tracking-widest text-sm font-semibold">
                        <a className="text-indigo-600 font-bold hover:opacity-80" href="#">Collection</a>
                        <a className="text-slate-500 hover:opacity-80" href="#">Archive</a>
                        <a className="text-slate-500 hover:opacity-80" href="#">Atelier</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center bg-surface-container rounded-full px-4 py-1.5 border border-outline-variant/30">
                            <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
                            <span className="ml-2 text-xs text-slate-400">Search...</span>
                        </div>

                        <button className="p-2 hover:opacity-80">
                            <span className="material-symbols-outlined">favorite</span>
                        </button>

                        <button className="p-2 relative hover:opacity-80">
                            <span className="material-symbols-outlined">shopping_bag</span>
                            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="relative z-10">


                {/* HERO */}
                <section className="pt-24 px-6 md:px-12">

                    <div className="relative max-w-[1200px] mx-auto rounded-[32px] overflow-hidden
  border border-white/20
  shadow-[0_30px_80px_rgba(0,0,0,0.25)]">

                        <img
                            src={brand.image}
                            alt={brand.title}
                            className="w-full h-[500px] object-cover"
                        />

                        <div className="absolute inset-0 bg-black/50" />

                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">

                            <h1 className="text-white text-[72px] font-bold mb-4">
                                {brand.title}
                            </h1>

                            <p className="text-white/80 mb-8">
                                {brand.tagline}
                            </p>

                            <button className="flex items-center gap-2 px-8 py-4 rounded-full
        bg-gradient-to-r from-indigo-500 to-violet-600
        text-white shadow-[0_10px_40px_rgba(99,102,241,0.6)]">

                                Explore Collection
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>

                        </div>
                    </div>

                </section>

                <section className="pt-20 pb-6 px-6 md:px-12 bg-transparent">

                    <div className="max-w-4xl mx-auto text-center">

                        <h2 className="text-[40px] md:text-[48px] font-semibold text-gray-800 mb-6">
                            Defined by Silhouettes
                        </h2>

                        <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
                            {brand.description}
                        </p>

                    </div>

                </section>


                {/* PRODUCTS  */}
                <section className="relative pt-20 pb-6 px-6 md:px-12 bg-transparent">


                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-10 max-w-[1200px] mx-auto px-2">

                        <div>
                            <p className="text-indigo-500 text-sm tracking-widest uppercase mb-2">
                                Curation
                            </p>
                            <h2 className="text-[36px] font-semibold">
                                Seasonal Highlights
                            </h2>
                        </div>

                        {/* ARROWS */}
                        <div className="flex gap-3">
                            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-white transition">
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>

                            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-white transition">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>

                    </div>

                    {/* CARDS */}
                    <div className="flex gap-8 justify-center overflow-x-auto pb-6 snap-x max-w-[1200px] mx-auto no-scrollbar">

                        {/* CARD */}
                        {[
                            {
                                name: "Atelier Trench",
                                price: "$2,450",
                                category: "Signature Series",
                                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpKop8PcN0I24xCa_UYgweSpS9934EC_ZvuZoKEReQ_tJ92qhjRRrvQjP7V2ri-2MvwcBY6tzGrx3stXV6tz9DScCKW6a_Wt2Wjei3LUM4HqYx57g03Qs1m9qSXbYo3guJ9NRZGge5VK_d_tgwwNzM0upuwzIwpc7ihDkN2qAsNCKZOqTbmUs0Ae__XwxBY7WJy2Y1zRi9OkMApbni1E1zpaCqCh30KzXyJzPa_lri93fY9-00q_oQa_LB1V972WrysW4k1suEb8s"
                            },
                            {
                                name: "Orbital Sneaker",
                                price: "$890",
                                category: "Footwear",
                                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtI-vksbJa5xp3LEekwuXudrgyMkFpIyUw6LO9oOvRNWiPlod_L9_Qno_fYfW7oAvFaWLVR045sxdl9BN62SiL9XKhRyUB2pZMV56WLmVyybd3E-s3BcJ2bwfAbxvVP4zEREbvkuoxUuVtGeWfaNOvfXc5wVVq9WF3ZPWSVVS-Si6At-WRRpXfHDLcR7plB7aKDG9OgYTavTvdtTxCN-MEVGm-W-uZeCYxmc-WrD9eo7JWmK4OWllhmyVoktt5Mlf2w3jgvgtcsnE"
                            },
                            {
                                name: "Prism Gown",
                                price: "$3,100",
                                category: "Evening Wear",
                                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDz4iuZpRycqWx9WwG74h6wwRCBEm4dQCzUwm0LQsFYTYphcF0yUtSe9tBGJhYHB6FOGpPDfqlcierDVzq_HaBgK9__uqBdC5e7wuwJsbwuqqq5WMy6Dt2hzCziBcWOlEKhxjEnrtZPGfMn4tT-ff0prBXLa4Y4cKchzfJ8TwrQZse4T6aZkfskuyw_TtQI3P8MtUmDY1fuxehqXc0EB6w3TYfT_u_JxCe_rWs-YVyBaDButjewpiF3VlWVeNqjVfAc17zIawJL5-s"
                            }
                        ].map((item, i) => (

                            <div key={i} className="min-w-[320px] snap-start group">

                                <div className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] rounded-[24px] p-4">

                                    {/* IMAGE */}
                                    <div className="h-[320px] rounded-[20px] overflow-hidden mb-4 relative">

                                        <img
                                            src={item.image}
                                            className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                                            alt=""
                                        />

                                        {/* 🔥 BOTTOM CART OVERLAY */}
                                        <div className="absolute bottom-0 left-0 w-full p-3
        bg-gradient-to-t from-black/50 to-transparent
        opacity-0 group-hover:opacity-100 transition duration-300">

                                            <button className="w-full py-2 rounded-full bg-white text-gray-800
          flex items-center justify-center gap-2 shadow-md">

                                                <span className="material-symbols-outlined text-sm">
                                                    shopping_cart
                                                </span>
                                                Add to Cart
                                            </button>

                                        </div>

                                    </div>

                                    {/* INFO */}
                                    <div className="flex justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-800">{item.name}</h4>
                                            <p className="text-sm text-gray-400">{item.category}</p>
                                        </div>

                                        <span className="text-indigo-500 font-medium">
                                            {item.price}
                                        </span>
                                    </div>

                                </div>
                            </div>
                        ))}

                    </div>
                </section>

                <section className="relative pt-6 pb-24 px-6 md:px-12 overflow-hidden">



                    {/* FILTER BAR */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-16">

                        {/* ACTIVE */}
                        <button className="px-6 py-2 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
                            All Objects
                        </button>

                        {/* NORMAL */}
                        {["Luxury Wear", "Accessories", "New Arrival"].map((item, i) => (
                            <button
                                key={i}
                                className="px-6 py-2 rounded-full bg-white/60 backdrop-blur-md text-gray-600 hover:bg-white transition"
                            >
                                {item}
                            </button>
                        ))}

                        {/* SORT */}
                        <div className="flex items-center gap-2 ml-4 text-gray-500 text-sm">
                            Sort by: Featured
                            <span className="material-symbols-outlined text-sm">expand_more</span>
                        </div>

                    </div>

                    {/* PRODUCT GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1200px] mx-auto">

                        {[
                            {
                                name: "Luna Clutch",
                                price: "$1,200",
                                tag: "Handcrafted Leather",
                                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHDP_-Ac0IGnxWQbTkQqiqmVdoV7MnGItEdAWyUdzDD_ZQ7adcbnNIS0by019bt7xCtq0aDeUKkraj5x0j2Og5OcKGh1cCOy6Sq-75aL0ZckqcS-gl7PE5bboHtonXwYTA1geL51zPUmtRGU0xtf26_DGCq4mvD_5OaDOsf2m_yBKwoWzzTxvIxet72IgVw13ZTDuSE5fWve4nDpV13NyKV6D_XdnTEtCca_sQRBcJ0bBZv8aX7ZW4uyEX5BndNw3aEBj3ujDFooI"
                            },
                            {
                                name: "Serene Blazer",
                                price: "$1,850",
                                tag: "Italian Wool",
                                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-AWV2KqihbRg4Wnxrlxdf39NiFKGC0t6y7MB2sZ8EX5QhLQqTUQ9kBJrT0TLSXygvYuytTl9_Bs2hAlmnHLXuzMTWBwPPPYgGycCDSUj4q3fu13gbj5VWeMmuQwcI4QwOvypH3GtwUnTlcr_vSSly8fZDexSg6Mex2wBpd-ypF2l2EkLRn7lXKDUG46kcICsYySgguAEZGaJqGs9K7Mh-ES-ryg-V4DzK-9zJPG-BFCkFDeY7eK0VrOjeuDpeFcYWbZq77I2PkR8"
                            },
                            {
                                name: "Solaris V1",
                                price: "$450",
                                tag: "Eyewear",
                                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ3eDIqGqzt5XzwtAqz3tMl1Mxqd5CQXaYQVGzdU_Ek5jdNLCB_cYV2WMoHbRBAzTZB7i74fG2JM8-H4eHS24lLVJqesE5wKlKtAz6K7-JD45zq1b6r0CuItAF30qbcYrWCO3wgcBwbLfruCD7JDNx0AsI-vtG9ndB7wg0Mxdj8Ebty5i9M04hQygTaXFgQ7PiQB-gaeeABevg8-HOihn4hodI_wIzeROgdGujtcJ19d9awSWTZZuMV8Tednc2hm22h6oF7KGglcU"
                            },
                            {
                                name: "Elysian Scarf",
                                price: "$320",
                                tag: "100% Mulberry Silk",
                                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQrir7juTAV02p9AMEG58D2MCY3OcCy3omD9ffLsu4L9mJECAy54XPmRY2hby_-sH2CU0VTfqb4t-dynLVPTv-4aBSlCTZAC8Mkdtl4CppM6SHA4mji9xNteV8ICaFEB8FU7FG7B_X8nQqN1nUzANcQe7tWa5EKdkLPp-b0qJ_RT9AiumrG9_ZrRelzEWok98zwLp1ww9ZYWx4f2nZxmPpe4tOLi_c3u7HvfST-1ol1OnaAoiDyuZ_BRhP9k1wp3owpRhEWA0Bznw"
                            }
                        ].map((item, i) => (

                            <div key={i} className="group cursor-pointer">

                                {/* FULL CARD */}
                                <div className="rounded-[24px] p-3 bg-white border border-gray-100
    shadow-[0_10px_40px_rgba(0,0,0,0.06)]
    hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]
    transition-all duration-300">

                                    {/* IMAGE */}
                                    <div className="aspect-[3/4] rounded-[20px] overflow-hidden relative mb-4">
                                        <img
                                            src={item.image}
                                            className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                                            alt=""
                                        />

                                        {/* CART POP */}
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[85%]
        opacity-0 group-hover:opacity-100
        transition duration-300">

                                            <button className="w-full py-3 rounded-full 
          bg-white/90 backdrop-blur-md
          text-gray-800 flex items-center justify-center gap-2
          shadow-lg text-sm">

                                                <span className="material-symbols-outlined text-sm">
                                                    shopping_cart
                                                </span>
                                                Add to Cart
                                            </button>

                                        </div>
                                    </div>


                                    <div className="px-2">
                                        <div className="flex justify-between mb-1">
                                            <h5 className="text-sm font-medium text-gray-800">
                                                {item.name}
                                            </h5>
                                            <span className="text-indigo-500 text-sm">
                                                {item.price}
                                            </span>
                                        </div>

                                        <p className="text-[10px] uppercase text-gray-400 tracking-widest">
                                            {item.tag}
                                        </p>
                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>
                </section>

                {/* CTA */}
                <section className="relative py-24 px-6 md:px-12 overflow-hidden">

                    {/*  GLASS CARD */}
                    <div className="max-w-[1100px] mx-auto rounded-[32px] p-12 md:p-16 text-center
     bg-white border border-gray-100
      shadow-[0_30px_80px_rgba(0,0,0,0.12)]">

                        {/* TITLE */}
                        <h2 className="text-[36px] md:text-[44px] font-semibold text-gray-800 mb-6">
                            Elevate Your Style with {brand.title}
                        </h2>

                        {/* SUBTEXT */}
                        <p className="text-gray-500 max-w-2xl mx-auto mb-10">
                            Join our inner circle for exclusive access to bespoke drops and private atelier sessions.
                        </p>

                        {/* BUTTONS */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4">

                            {/* PRIMARY */}
                            <button className="px-8 py-4 rounded-full text-white
        bg-gradient-to-r from-indigo-500 to-violet-600
        shadow-[0_10px_40px_rgba(99,102,241,0.5)]
        hover:scale-105 transition-all">

                                Join the Inner Circle
                            </button>

                            {/* SECONDARY */}
                            <button className="px-8 py-4 rounded-full border border-gray-300 text-gray-700
        hover:bg-white transition">

                                The Manifesto
                            </button>

                        </div>

                    </div>
                </section>

                {/* FOOTER */}
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

                        {/* BOTTOM BAR */}
                        <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                            <p>© 2024 ShopLite. Ethereal Commerce.</p>

                            <div className="flex gap-6">
                                <span className="hover:text-indigo-600 cursor-pointer">Instagram</span>
                                <span className="hover:text-indigo-600 cursor-pointer">Pinterest</span>
                                <span className="hover:text-indigo-600 cursor-pointer">Twitter</span>
                            </div>
                        </div>

                    </div>
                </footer>

            </main>
        </div >
    );
};

export default BrandDetails;