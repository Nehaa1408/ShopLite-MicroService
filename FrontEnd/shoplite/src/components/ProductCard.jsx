import React from "react";

const ProductCard = ({ product, onAddToCart, onView }) => {
    return (
        <div
            onClick={(e) => {
                if (e.target.closest("button")) return;
                onView(product.id);
            }}
            className="group cursor-pointer"
        >
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6
      shadow-[0_10px_30px_rgba(0,0,0,0.05)]
      hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)]
      transition-all duration-300 hover:-translate-y-1">

                {/* IMAGE */}
                <div className="relative rounded-2xl overflow-hidden 
        bg-gradient-to-br from-gray-100 to-gray-200 
        flex items-center justify-center 
        h-[300px] md:h-[340px]">

                    <img
                        src={
                            product.imageUrl ||
                            product.image ||
                            product.imagePath
                        }
                        alt={product.name}
                        onError={(e) => {
                            e.target.src = "/products/p1.webp";
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* ADD BUTTON */}
                    <button
                        onClick={(e) => onAddToCart(e, product)}
                        className="
              absolute bottom-4 left-1/2 -translate-x-1/2
              opacity-0 translate-y-6
              group-hover:opacity-100 group-hover:translate-y-0
              flex items-center gap-2 px-4 py-2 rounded-full
              bg-indigo-600 text-white text-sm font-medium
              shadow-lg hover:bg-indigo-700 hover:scale-105
              transition-all duration-300 ease-out
            "
                    >
                        <span className="material-symbols-outlined text-base">
                            shopping_bag
                        </span>
                        Add to Bag
                    </button>

                </div>

                {/* TEXT */}
                <div className="mt-5 space-y-2">
                    <div className="flex justify-between items-center">
                        <h3 className="text-base md:text-lg font-semibold text-gray-800">
                            {product.name}
                        </h3>

                        <span className="text-indigo-600 font-bold text-base md:text-lg">
                            ${product.priceValue || product.price}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductCard;