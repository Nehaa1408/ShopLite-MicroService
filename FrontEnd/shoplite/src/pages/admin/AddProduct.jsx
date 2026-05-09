import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import adminAxios from "../../api/adminAxios";
import AdminHeader from "../../components/AdminHeader";
import AdminSidebar from "../../components/AdminSidebar";
const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editProduct = location.state;
  const isActive = (path) => location.pathname.startsWith(path);
  const [form, setForm] = useState({
    name: "",
    price: "",
    imageUrl: "",
    quantity: "",
    description: "",
    category: ""
  });
  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name || "",
        price: editProduct.price || "",
        imageUrl: editProduct.imageUrl || "",
        quantity: editProduct.quantity || "",
        description: editProduct.description || "",
        category: editProduct.category?.id || ""
      });
    }
  }, [editProduct]);
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async () => {
    try {
      let errors = [];

      if (!form.name.trim()) errors.push("Product Name");
      if (!form.category || form.category === "Select Category") errors.push("Category");
      if (!form.price) errors.push("Price");
      if (!form.quantity) errors.push("Quantity");
      if (!form.imageUrl.trim()) errors.push("Image URL");

      if (errors.length > 0) {
        alert("Please fill: " + errors.join(", "));
        return;
      }

      const payload = {
        name: form.name,
        price: parseFloat(form.price) || 0,
        quantity: parseInt(form.quantity) || 0,
        imageUrl: form.imageUrl,
        description: form.description,
        category: {
          id: parseInt(form.category)
        }
      };

      if (editProduct) {

        await adminAxios.put(`/products/${editProduct.id}`, payload);
      } else {
        await adminAxios.post("/products", payload);
      }

      navigate("/admin/products");

    }
    catch (err) {
      console.error(err);
      alert("Something went wrong while saving product");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminRole");
    navigate("/admin");
  };

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
        <main className="md:ml-64 pt-24 px-6 pb-12 max-w-6xl">

          {/* TITLE */}
          <h1 className="text-4xl font-extrabold mb-2">Add New Product</h1>
          <p className="text-on-surface-variant mb-8">
            Fill in the details to add a new product to your inventory.
          </p>

          {/* GRID */}
          <div className="flex flex-col gap-8">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">
              {/* BASIC INFO */}
              <div className="bg-surface-container-lowest rounded-xl p-8 shadow border border-outline-variant/10">
                <h3 className="font-bold mb-6 flex gap-2 items-center">
                  <span className="material-symbols-outlined text-primary">
                    description
                  </span>
                  Basic Information
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Product Name */}
                    <div>
                      <label className="text-sm font-semibold text-on-surface-variant mb-2 block">
                        Product Name
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Premium Wireless Headphones"
                        className="w-full bg-surface-container-highest/40 px-4 py-3 rounded-lg outline-none"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-sm font-semibold text-on-surface-variant mb-2 block">
                      Category
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full bg-surface-container-highest/40 px-4 py-3 rounded-lg outline-none"
                    >
                      <option value="">Select Category</option>
                      <option value="1">electronics</option>
                      <option value="2">accessories</option>
                      <option value="3">fashion</option>
                      <option value="4">home</option>
                      <option value="5">footwear</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="text-sm font-semibold text-on-surface-variant mb-2 block">
                      Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-on-surface-variant">
                        $
                      </span>
                      <input
                        name="price"
                        value={form.price}
                        placeholder="0.00"
                        onChange={handleChange}
                        className="w-full pl-8 pr-4 py-3 bg-surface-container-highest/40 rounded-lg outline-none"
                      />
                    </div>
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="text-sm font-semibold text-on-surface-variant mb-2 block">
                      Quantity
                    </label>
                    <input
                      name="quantity"
                      value={form.quantity}
                      onChange={handleChange}
                      placeholder="Enter stock quantity"
                      className="w-full bg-surface-container-highest/40 px-4 py-3 rounded-lg outline-none"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-on-surface-variant mb-2 block">
                      Product Description
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Provide a detailed description..."
                      className="w-full bg-surface-container-highest/40 px-4 py-3 rounded-lg outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              {/* IMAGE */}
              <div className="bg-surface-container-lowest rounded-xl p-8 shadow border border-outline-variant/10">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    image
                  </span>
                  Product Image
                </h3>

                {/* Upload Box */}
                <div className="border-2 border-dashed border-outline-variant/20 rounded-xl p-8 text-center bg-surface-container-low/30">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-primary text-3xl">
                      cloud_upload
                    </span>
                  </div>

                  <p className="font-semibold">Drag and drop image here</p>
                  <p className="text-xs text-on-surface-variant">
                    Support JPG, PNG and SVG (Max 5MB)
                  </p>
                  <input
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    placeholder="Paste image URL"
                    className="w-full mt-4 bg-surface-container-highest/40 px-4 py-3 rounded-lg outline-none"
                  />
                  <button className="text-primary font-bold mt-4">
                    Browse Files
                  </button>
                </div>

                {/* Preview Card */}
                <div className="mt-6 flex items-center gap-4 p-4 bg-surface-container-low rounded-lg">
                  {form.imageUrl ? (
                    <img
                      src={
                        form.imageUrl.startsWith("http")
                          ? form.imageUrl
                          : `/products/${form.imageUrl}`
                      }
                      className="w-30 h-30 object-cover rounded-xl shadow"
                      onError={(e) => {
                        e.target.src = "/products/p1.webp";
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded"></div>
                  )}

                  <div className="flex-1">
                    <p className="text-xs font-bold">preview_image.jpg</p>
                    <p className="text-[10px] text-on-surface-variant">
                      1.2 MB • Done
                    </p>
                  </div>

                  <span className="material-symbols-outlined text-red-500 cursor-pointer">
                    delete
                  </span>
                </div>
              </div>
              {/* VISIBILITY */}
              <div className="bg-surface-container-lowest rounded-xl p-8 shadow border border-outline-variant/10">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    visibility
                  </span>
                  Visibility
                </h3>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold">Storefront Visibility</p>
                    <p className="text-xs text-on-surface-variant">
                      Publish product immediately
                    </p>
                  </div>

                  {/* Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center gap-6 mt-12">

            {/* CANCEL */}
            <button
              onClick={() => navigate("/admin/products")}
              className="px-6 py-3 rounded-xl 
    bg-white/60 backdrop-blur-md 
    border border-white/40 
    text-gray-600 font-medium
    shadow-sm
    transition-all duration-300
    hover:bg-white/80 
    hover:shadow-md 
    hover:-translate-y-0.5"
            >
              Cancel
            </button>

            {/* PRIMARY BUTTON */}
            <button
              onClick={handleSubmit}
              className="px-8 py-3 rounded-xl font-semibold text-white
    bg-gradient-to-r from-[#6366f1] to-[#a855f7]
    shadow-[0px_10px_25px_rgba(99,102,241,0.3)]
    transition-all duration-300
    hover:shadow-[0px_20px_40px_rgba(168,85,247,0.4)]
    hover:-translate-y-0.5
    active:scale-[0.97]"
            >
              {editProduct ? "Update Product" : "Add Product"}
            </button>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AddProduct;
