import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import adminAxios from "../../api/adminAxios";
const AdminTickets = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await adminAxios.get("/tickets/admin");
        setTickets(res.data);
      } catch (err) {
        console.error("Tickets fetch error:", err);
      }
    };

    fetchTickets();
  }, []);


  const filteredTickets = tickets.filter((t) => {
    return (
      (statusFilter === "All" || t.status === statusFilter) &&
      (priorityFilter === "All" || t.priority === priorityFilter)
    );
  });


  const getStatusStyle = (status) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      case "Resolved":
        return "bg-green-100 text-green-700";
      default:
        return "";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-600";
      case "Medium":
        return "bg-purple-100 text-purple-600";
      case "Low":
        return "bg-gray-200 text-gray-600";
      default:
        return "";
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f9f5ff] text-[#2b2a51]">

      {/* SIDEBAR */}
      <aside className="w-64 p-4 hidden md:flex flex-col border-r bg-white">

        {/* BRAND */}
        <div className="mb-8 px-2">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined">storefront</span>
            </div>

            <div>
              <p className="font-bold text-blue-600 text-sm">
                ShopLite Admin
              </p>
              <p className="text-[10px] text-gray-400 uppercase font-bold">
                MANAGEMENT CONSOLE
              </p>
            </div>
          </div>
        </div>

        {/* NAV */}
        <nav className="flex-1 space-y-1">

          {/* Dashboard */}
          <div
            onClick={() => navigate("/admin")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer ${isActive("/admin")
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-100"
              }`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </div>

          {/* Products */}
          <div
            onClick={() => navigate("/admin/products")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer ${isActive("/admin/products")
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-100"
              }`}
          >
            <span className="material-symbols-outlined">inventory_2</span>
            Manage Products
          </div>

          {/* Add Product */}
          <div
            onClick={() => navigate("/admin/add-product")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <span className="material-symbols-outlined">add_box</span>
            Add Product
          </div>

          {/* Orders */}
          <div
            onClick={() => navigate("/manage-orders")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            Manage Orders
          </div>

          {/* ✅ Tickets */}
          <div
            onClick={() => navigate("/admin/tickets")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer ${isActive("/admin/tickets")
              ? "bg-blue-600 text-white shadow"
              : "hover:bg-gray-100"
              }`}
          >
            <span className="material-symbols-outlined">
              confirmation_number
            </span>
            Tickets
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-black">Ticket Management</h1>
          <p className="text-gray-500">
            Resolution center and customer support queue.
          </p>
        </div>

        {/* FILTERS */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          {/* STATUS */}
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-xs font-bold mb-2">STATUS</p>
            <div className="flex gap-2 flex-wrap">
              {["All", "Open", "In Progress", "Resolved"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded ${statusFilter === s
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* PRIORITY */}
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-xs font-bold mb-2">PRIORITY</p>
            <div className="flex gap-2 flex-wrap">
              {["All", "High", "Medium", "Low"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-3 py-1 rounded ${priorityFilter === p
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* STATS */}
          <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="text-xs text-blue-600 font-bold">Queue</p>
              <h2 className="text-2xl font-black">{tickets.length}</h2>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition">
              Create
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-500">
              <tr>
                <th className="p-4 text-left">ID</th>
                <th>User</th>
                <th>Subject</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((t, i) => (
                <tr
                  key={i}
                  onClick={() => navigate(`/admin/ticket/${t.id}`)}
                  className="border-t cursor-pointer hover:bg-gray-50 transition-all hover:scale-[1.01]"
                >
                  <td className="p-4 font-bold text-blue-600">
                    #{t.id}
                  </td>
                  <td>{t.user?.name || "User"}</td>
                  <td>{t.subject}</td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${getPriorityStyle(
                        t.priority
                      )}`}
                    >
                      {t.priority}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${getStatusStyle(
                        t.status
                      )}`}
                    >
                      {t.status}
                    </span>
                  </td>

                  <td>{new Date().toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EMPTY STATE */}
        {tickets.length === 0 && (
          <p className="text-center mt-10 text-gray-400">
            No tickets found
          </p>
        )}
      </main>
    </div>
  );
};

export default AdminTickets;