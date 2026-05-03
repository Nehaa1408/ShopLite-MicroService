import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
    const navigate = useNavigate();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 
    h-20 px-8 flex items-center justify-between
    bg-gradient-to-r from-white/40 to-white/20 
    backdrop-blur-xl border-b border-white/20">

            {/* LEFT */}
            <div className="flex items-center gap-5">

                <div className="w-10 h-10 rounded-xl 
        bg-gradient-to-br from-[#60a5fa] to-[#a78bfa] 
        flex items-center justify-center text-white shadow-md">
                    <span className="material-symbols-outlined text-lg">
                        shopping_bag
                    </span>
                </div>

                <div>
                    <h1 className="text-lg font-bold text-blue-600 leading-none">
                        ShopLite
                    </h1>
                    <p className="text-[10px] tracking-widest text-gray-400 font-semibold">
                        MANAGEMENT SUITE
                    </p>
                </div>

                <p className="hidden md:block text-sm text-gray-500 ml-6">
                    Welcome back, <span className="font-semibold text-blue-600">Admin</span>
                </p>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">

                <div className="hidden md:flex items-center 
        bg-white/30 border border-white/20 backdrop-blur-md 
        px-5 py-2.5 rounded-full shadow-sm w-64">
                    <span className="material-symbols-outlined text-gray-400 text-sm mr-2">
                        search
                    </span>
                    <input
                        placeholder="Search insights..."
                        className="bg-transparent outline-none text-sm w-full"
                    />
                </div>

                <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full 
          bg-white/40 backdrop-blur-md border border-white/40
          flex items-center justify-center shadow-sm cursor-pointer">
                        <span className="material-symbols-outlined text-gray-600">
                            notifications
                        </span>
                    </div>

                    <div className="w-10 h-10 rounded-full 
          bg-white/40 backdrop-blur-md border border-white/40
          flex items-center justify-center shadow-sm cursor-pointer">
                        <span className="material-symbols-outlined text-gray-600">
                            settings
                        </span>
                    </div>

                </div>

                <div className="hidden md:block w-px h-6 bg-gray-300/50"></div>

                

                <div
                    onClick={() => navigate("/admin/profile")}
                    className="w-10 h-10 rounded-full 
          bg-gradient-to-br from-blue-100 to-purple-100 
          flex items-center justify-center cursor-pointer"
                >
                    <span className="material-symbols-outlined text-blue-600">
                        account_circle
                    </span>
                </div>

            </div>
        </header>
    );
}