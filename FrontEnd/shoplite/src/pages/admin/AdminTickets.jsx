import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import adminAxios from "../../api/adminAxios";
import AdminHeader from "../../components/AdminHeader";
import AdminSidebar from "../../components/AdminSidebar";
const AdminTickets = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await adminAxios.get("/tickets/admin");
        console.log("RAW TICKETS:", res.data);
        if (Array.isArray(res.data)) {
          setTickets(res.data);
        } else if (Array.isArray(res.data.tickets)) {
          setTickets(res.data.tickets);
        } else {
          setTickets([]);
        }
      } catch (err) {
        console.error("Tickets fetch error:", err);
      }
    };

    fetchTickets();
  }, []);


  const filteredTickets = Array.isArray(tickets)
    ? tickets.filter((t) => {
      return (
        (statusFilter === "All" || t.status === statusFilter)
      );
    })
    : [];


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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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


        {/* MAIN CONTENT */}
        <main className="md:ml-64 pt-24 p-6">

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-black">Ticket Management</h1>
            <p className="text-gray-500">
              Resolution center and customer support queue.
            </p>
          </div>



          {/* TABLE */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl 
shadow-[0px_20px_50px_rgba(0,0,0,0.08)] 
border border-white/40 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-500">
                <tr>
                  <th className="p-4 text-left">ID</th>
                  <th>User</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredTickets.map((t, i) => (
                  <tr
                    key={i}
                    onClick={() => navigate(`/admin/ticket/${t.id}`)}
                    className="border-t border-white/30 
transition-all duration-300
hover:bg-white/60 
hover:shadow-[0px_10px_30px_rgba(168,85,247,0.15)]
hover:-translate-y-[2px]"
                  >
                    <td className="p-4 font-bold text-blue-600">
                      #{t.id}
                    </td>
                    <td>{t.userName || "User"}</td>
                    <td>{t.subject}</td>

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
    </div>
  );
};

export default AdminTickets;