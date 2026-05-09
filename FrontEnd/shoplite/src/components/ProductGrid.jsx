import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, loading, onAddToCart, onView }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {loading ? (
                [...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="h-[320px] bg-gray-200 animate-pulse rounded-3xl"
                    />
                ))
            ) : (
                products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={onAddToCart}
                        onView={onView}
                    />
                ))
            )}

        </div>
    );
};

export default ProductGrid;