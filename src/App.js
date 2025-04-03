import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import ClientLayout from "./layouts/ClientLayout";
import AdminLayout from "./layouts/AdminLayout";

// Client Pages
import Home from "./pages/Home";

import Blog from "./pages/Blog";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import Shop from "./pages/shop";
import About from "./pages/about";
import Contact from "./pages/contact";
import Services from "./pages/services";
import Cartt from "./pages/cartt";
import Checkout from "./pages/checkout";
import ProductDetail from "./pages/productdetail";
import History from "./pages/history"

// Admin Pages
import AdminDashboard from "./admin/Dashboard";
import ManageUsers from "./admin/ManageUsers";
import ManageProducts from "./admin/ManageProducts";
import Add from "./pages/product/Add";
import Edit from "./pages/product/Edit";
import LoginAdmin from "./admin/LoginAdmin";

import ManageCategories from "./admin/ManageCategories";
import AddCategory from "./pages/category/Add-Category";
import EditCategory from "./pages/category/Edit-Category";
import ManagePost from "./admin/ManagePosts";
import "./assets/style.css";
import ProtectedRoute from "./admin/ProtectedRoute";
import AddPost from "./pages/post/Add-Post";
import EditPost from "./pages/post/Edit-Post"
import ManageOrder from "./admin/ManageOrder";
import PaymentCallback from "./components/PaymentCallback";
import BlogDetail from "./pages/Blogdetail";
function App() {
  return (
    <Router>
      <Routes>
        {/* Client Routes */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route path="blog" element={<Blog />} />
          <Route path="blogdetail/:id" element={<BlogDetail />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="contact" element={<Contact />} />
          <Route path="shop" element={<Shop />} />
          <Route path="productdetail/:id" element={<ProductDetail />} />
          <Route path="cart/:id" element={<Cartt />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="history/:id" element={<History />} />
          <Route path="/payment-success" component={PaymentCallback} />
        <Route path="/payment-failure" component={PaymentCallback} />

          {/* <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} /> */}
        </Route>

        {/* Admin Routes (Được bảo vệ bởi ProtectedRoute) */}
        <Route path="/admin/*" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="products" element={<ManageProducts />} />

            <Route path="add-product" element={<Add />} />
            <Route path="edit-product/:id" element={<Edit />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="add-category" element={<AddCategory />} />
            <Route path="edit-category/:id" element={<EditCategory />} />
            <Route path="posts" element={<ManagePost />} />
            <Route path="add-post" element={<AddPost />} />
            <Route path="edit-post/:id" element={<EditPost />} />
            <Route path="orders" element={<ManageOrder />} />
          </Route>
        </Route>

        {/* Route đăng nhập Admin (Không cần bảo vệ) */}
        <Route path="/admin/login" element={<LoginAdmin />} />
       
      </Routes>
    </Router>
  );
}

export default App;
