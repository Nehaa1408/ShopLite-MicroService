import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import adminAxios from "../../api/adminAxios";
const ManageProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await adminAxios.get("/api/products?page=0&size=100");
        setProducts(res.data.content);

      } catch (err) {
        console.error("Products fetch error:", err);
      }
    };

    fetchProducts();
  }, []);
  const handleDelete = async (id) => {
    try {
      await adminAxios.delete(`/api/products/${id}`);

      // refresh UI
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* HEADER */}
      <header className="fixed top-0 w-full h-16 flex justify-between items-center px-6 bg-surface/80 backdrop-blur-xl shadow z-50">
        <h1 className="text-xl font-bold text-primary">ShopLite Admin</h1>

        <div className="flex items-center gap-4">
          <input
            placeholder="Search products..."
            className="hidden md:block px-4 py-2 rounded-lg bg-surface-container-low"
          />
          <span className="material-symbols-outlined">notifications</span>
          <span className="material-symbols-outlined">settings</span>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-16 w-64 h-full bg-surface border-r hidden md:flex flex-col p-4">
        <div className="mb-6">
          <h2 className="font-bold text-primary">ShopLite</h2>
          <p className="text-xs text-on-surface-variant">ADMIN CONSOLE</p>
        </div>

        <div className="space-y-2">
          <div className="p-3 hover:bg-surface-container rounded-lg cursor-pointer">
            <div
              onClick={() => navigate("/admin")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition
               ${isActive("/admin")
                  ? "bg-gradient-to-r from-primary to-primary-container text-white shadow-lg"
                  : "hover:bg-surface-container"
                }`}
            >
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </div>
          </div>

          <div className="p-3 bg-blue-50 text-primary font-bold border-r-4 border-primary rounded-l-lg">
            Manage Products
          </div>

          <div
            onClick={() => navigate("/admin/add-product")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-surface-container"
          >
            <span className="material-symbols-outlined">add_box</span>
            Add Product
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-surface-container">
            <span className="material-symbols-outlined">shopping_cart</span>
            Manage Orders
          </div>
          {/* Tickets */}
          <div
            onClick={() => navigate("/admin/tickets")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition
  ${isActive("/admin/tickets")
                ? "bg-gradient-to-r from-primary to-primary-container text-white shadow-lg"
                : "hover:bg-surface-container"
              }`}
          >
            <span className="material-symbols-outlined">
              confirmation_number
            </span>
            Tickets
          </div>
          <div className="border-t border-outline-variant/10 pt-4">
            <div className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer">
              <span className="material-symbols-outlined">logout</span>
              Logout
            </div>
          </div>
        </div>
      </aside>

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

          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl">
            <span className="material-symbols-outlined">add</span>
            Add New Product
          </button>
        </div>
        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* TOTAL PRODUCTS */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(43,42,81,0.06)] flex items-center gap-4">
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
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(43,42,81,0.06)] flex items-center gap-4">
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
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(43,42,81,0.06)] flex items-center gap-4">
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
        <div className="bg-surface-container-lowest rounded-2xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low">
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
                  className="border-t hover:bg-surface-container-low"
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
                    <p className="text-xs text-gray-500">SKU: {p.sku}</p>
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
  );
};

export default ManageProducts;
