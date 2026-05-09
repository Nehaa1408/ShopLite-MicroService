import React from "react";
import { fetchProducts } from "../services/api";

const useProducts = (category, currentPage, searchTerm) => {
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [totalPages, setTotalPages] = React.useState(1);

    React.useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);

            try {
                const data = await fetchProducts({
                    category,
                    page: currentPage - 1
                });

                console.log("API RESPONSE:", data);


                const productList = data?.content || data || [];
                const pages = data?.totalPages || 1;

                setProducts(productList);
                setTotalPages(pages);

            } catch (err) {
                console.error("Product fetch error:", err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [category, currentPage]);

    const filteredProducts = React.useMemo(() => {
        return products
            .map((p) => ({
                id: p.id,
                name: p.name,
                desc: p.description,
                priceValue: p.price,
                image: p.imageUrl
                    ? (p.imageUrl.startsWith("http")
                        ? p.imageUrl
                        : `/products/${p.imageUrl}`)
                    : "/fallback.png"
            }))
            .filter((product) => {
                if (!searchTerm) return true;

                return (
                    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.desc?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
    }, [products, searchTerm]);

    return { filteredProducts, loading, totalPages };
};

export default useProducts;