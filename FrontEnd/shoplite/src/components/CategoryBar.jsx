import React from "react";

const CategoryBar = ({ categories, activeCategory, categoryIcons, onSelect }) => {
    return (
        <div className="max-w-[1400px] mx-auto mt-10">
            <div className="flex items-center justify-between w-full px-6 md:px-12 py-6">

                {categories.map((cat) => {
                    const isActive = activeCategory === cat.name;

                    return (
                        <button
                            key={cat.id}
                            onClick={() => onSelect(cat.name)}
                            className={`group flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap
              backdrop-blur-xl border transition-all duration-300
              ${isActive
                                    ? "bg-white/80 border-indigo-200 text-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.25)]"
                                    : "bg-white/40 border-white/30 text-gray-600 hover:bg-white/70 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                                }`}
                        >

                            {/* ICON */}
                            <span
                                className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-indigo-600" : "text-indigo-400"
                                    }`}
                            >
                                {categoryIcons[cat.name]}
                            </span>

                            {/* TEXT */}
                            <span className="text-sm font-medium capitalize">
                                {cat.name}
                            </span>

                        </button>
                    );
                })}

            </div>
        </div>
    );
};

export default CategoryBar;