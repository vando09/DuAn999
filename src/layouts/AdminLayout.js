import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../admin/AdminHeader";
import AdminSidebar from "../admin/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <AdminHeader />

      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content area */}
        <main className="flex-grow-1 p-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
