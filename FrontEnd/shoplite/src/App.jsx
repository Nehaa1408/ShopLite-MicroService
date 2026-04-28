import React, { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Home = React.lazy(() => import("./pages/user/Home"));
const ProductDetails = React.lazy(() => import("./pages/user/ProductDetails"));
const Cart = React.lazy(() => import("./pages/user/Cart"));
const Checkout = React.lazy(() => import("./pages/user/Checkout"));
const Profile = React.lazy(() => import("./pages/user/Profile"));
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));


import UserLogin from "./pages/user/UserLogin";
import UserSignup from "./pages/user/UserSignup";
import Categories from "./pages/user/Categories";
import Brands from "./pages/user/Brands";
import TopDeals from "./pages/user/TopDeals";
import OrderConfirmation from "./pages/user/OrderConfirmation";
import OrderTracking from "./pages/user/OrderTracking";
import OrderHistory from "./pages/user/OrderHistory";
import TicketManagement from "./pages/user/TicketManagement";

import AdminRoute from "./pages/admin/AdminRoute";
import ManageProducts from "./pages/admin/ManageProducts";
import AddProduct from "./pages/admin/AddProduct";
import ManageOrders from "./pages/admin/ManageOrders";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminTicketDetails from "./pages/admin/AdminTicketDetails";
import AdminProfile from "./pages/admin/AdminProfile";
import BrandDetails from "./pages/user/BrandDetails";

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      }>
        {window.location.pathname !== "/" && (
          <ToastContainer position="top-right" autoClose={2000} />
        )}
        <Routes>
          {/* USER */}
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/brand/:brandName" element={<BrandDetails />} />
          <Route path="/top-deals" element={<TopDeals />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderConfirmation />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/tickets" element={<TicketManagement />} />


          {/* ADMIN */}
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <ManageProducts />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/add-product"
            element={
              <AdminRoute>
                <AddProduct />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/tickets"
            element={
              <AdminRoute>
                <AdminTickets />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/ticket/:id"
            element={
              <AdminRoute>
                <AdminTicketDetails />
              </AdminRoute>
            }
          />
          <Route
            path="/manage-orders"
            element={
              <AdminRoute>
                <ManageOrders />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/order/:id"
            element={
              <AdminRoute>
                <ManageOrders />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <AdminRoute>
                <AdminProfile />
              </AdminRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;