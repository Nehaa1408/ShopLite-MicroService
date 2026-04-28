import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = sessionStorage.getItem("adminToken");
  const role = sessionStorage.getItem("adminRole");

  if (!token || role !== "ADMIN") {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default AdminRoute;