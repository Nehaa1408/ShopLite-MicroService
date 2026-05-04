import userAxios from "../api/userAxios";

// ================= PRODUCTS =================
export const fetchProducts = async ({ category, page }) => {
    try {
        const url = category
            ? `/products?category=${category}&page=${page}&size=6`
            : `/products?page=${page}&size=6`;

        const res = await userAxios.get(url);
        return res.data;
    } catch (err) {
        console.error("Product fetch error:", err);
        throw err;
    }
};

// ================= CATEGORIES =================
export const fetchCategories = async () => {
    try {
        const res = await userAxios.get("/categories");
        return res.data;
    } catch (err) {
        console.error("Category fetch error:", err);
        throw err;
    }
};