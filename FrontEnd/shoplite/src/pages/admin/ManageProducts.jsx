import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import adminAxios from "../../api/adminAxios";

import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";


const ManageProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [products, setProducts] = useState([]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminRole");
    navigate("/admin");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await adminAxios.get("/products?page=0&size=100");
        setProducts(res.data.content);

      } catch (err) {
        console.error("Products fetch error:", err);
      }
    };

    fetchProducts();
  }, []);
  const handleDelete = async (id) => {
    console.log("Deleting:", id);

    try {
      await adminAxios.delete(`/products/${id}`);

      // remove from UI immediately
      setProducts(prev => prev.filter(p => p.id !== id));

    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
    }
  };
  console.log("ADMIN TOKEN:", sessionStorage.getItem("adminToken"));
  return (
    <div className="min-h-screen text-gray-800 relative overflow-hidden">

      <div className="fixed inset-0 -z-10 
bg-gradient-to-br from-[#fdfcfb] via-[#f7f1ec] to-[#f3e8ff]" />

      <div className="fixed top-[-120px] left-[-120px] w-[420px] h-[420px]
bg-[#f5d0c5]/40 rounded-full blur-[140px] -z-10" />

      <div className="fixed bottom-[-140px] right-[-120px] w-[420px] h-[420px]
bg-[#e9d5ff]/40 rounded-full blur-[140px] -z-10" />


      <div className="relative z-10">
        <AdminHeader />

        {/* SIDEBAR */}
        <AdminSidebar handleLogout={handleLogout} />

        {/* MAIN */}
        <main className="md:ml-64 pt-24 px-6">
          {/* TITLE */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-extrabold">Manage Products</h1>
              <p className="text-sm text-on-surface-variant">
                Review, update, and organize your product inventory.
              </p>
            </div>

          </div>
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {/* TOTAL PRODUCTS */}
            <div className="bg-white p-6 rounded-2xl 
shadow-[0px_10px_30px_rgba(0,0,0,0.06)] 
transition-all duration-300 
hover:shadow-[0px_20px_50px_rgba(99,102,241,0.25)] 
hover:-translate-y-1 
hover:ring-1 hover:ring-indigo-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">inventory</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-medium">
                  Total Products
                </p>
                <p className="text-xl font-bold">{products.length}</p>
              </div>
            </div>

            {/* CATEGORIES */}
            <div className="bg-white p-6 rounded-2xl 
shadow-[0px_10px_30px_rgba(0,0,0,0.06)] 
transition-all duration-300 
hover:shadow-[0px_20px_50px_rgba(99,102,241,0.25)] 
hover:-translate-y-1 
hover:ring-1 hover:ring-indigo-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined">category</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-medium">
                  Categories
                </p>
                <p className="text-xl font-bold">24 Active</p>
              </div>
            </div>

            {/* STOCK */}
            <div className="bg-white p-6 rounded-2xl 
shadow-[0px_10px_30px_rgba(0,0,0,0.06)] 
transition-all duration-300 
hover:shadow-[0px_20px_50px_rgba(99,102,241,0.25)] 
hover:-translate-y-1 
hover:ring-1 hover:ring-indigo-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                <span className="material-symbols-outlined">check_circle</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-medium">
                  In Stock
                </p>
                <p className="text-xl font-bold">92% Availability</p>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl 
shadow-[0px_20px_50px_rgba(0,0,0,0.08)] 
border border-white/40 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-white/60 backdrop-blur-md text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="p-4 text-xs">IMAGE</th>
                  <th className="p-4 text-xs">PRODUCT</th>
                  <th className="p-4 text-xs">CATEGORY</th>
                  <th className="p-4 text-xs">PRICE</th>
                  <th className="p-4 text-xs text-right">ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-white/30 
  transition-all duration-300 cursor-pointer
  hover:bg-white/60 
  hover:shadow-[0px_10px_30px_rgba(99,102,241,0.15)] 
  hover:-translate-y-[2px]"
                  >
                    <td className="p-4">
                      <img
                        src={
                          p.imageUrl.startsWith("http")
                            ? p.imageUrl
                            : `/products/${p.imageUrl}`
                        }
                        className="w-12 h-12 rounded-lg"
                      />
                    </td>

                    <td className="p-4">
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-xs text-gray-500">
                        Quantity: {p.quantity}
                      </p>
                    </td>

                    <td className="p-4">
                      <span className="px-3 py-1 bg-surface-container-high rounded-full text-xs">
                        {p.category?.name || p.category || "No Category"}
                      </span>
                    </td>

                    <td className="p-4 text-primary font-bold">${p.price}</td>

                    <td className="p-4 text-right">
                      <span
                        onClick={() => navigate("/admin/add-product", { state: p })}
                        className="material-symbols-outlined cursor-pointer mr-2"
                      >
                        edit
                      </span>
                      <span
                        onClick={() => handleDelete(p.id)}
                        className="material-symbols-outlined cursor-pointer text-red-500"
                      >
                        delete
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageProducts;
