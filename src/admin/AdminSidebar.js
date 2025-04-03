import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { FaRegUser, FaRegFileAlt, FaThLarge, FaBell } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`d-flex flex-column bg-dark text-white vh-100 p-3 ${isOpen ? "" : "collapsed"}`} style={{ width: isOpen ? "250px" : "80px", transition: "width 0.3s" }}>
      {/* Toggle Button */}
      {/* <button className="btn btn-outline-light mb-3" onClick={() => setIsOpen(!isOpen)}>
        <FiMenu size={24} />
      </button> */}

      {/* Sidebar Menu */}
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/admin/dashboard" className="nav-link text-white d-flex align-items-center">
            <FaThLarge size={20} />
            {isOpen && <span className="ms-2">Dashboard</span>}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/users" className="nav-link text-white d-flex align-items-center">
            <FaRegUser size={20} />
            {isOpen && <span className="ms-2">Người dùng</span>}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/products" className="nav-link text-white d-flex align-items-center">
            <FaRegFileAlt size={20} />
            {isOpen && <span className="ms-2">Sản phẩm</span>}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/categories" className="nav-link text-white d-flex align-items-center">
            <FaBell size={20} />
            {isOpen && <span className="ms-2">Loại sản phẩm</span>}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/posts" className="nav-link text-white d-flex align-items-center">
            <FaBell size={20} />
            {isOpen && <span className="ms-2">Bài viết</span>}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/orders" className="nav-link text-white d-flex align-items-center">
            <FaBell size={20} />
            {isOpen && <span className="ms-2">Quản lý đơn hàng</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;