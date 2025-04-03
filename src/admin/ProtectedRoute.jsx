import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const token = localStorage.getItem("authTokenAdmin"); // Lấy token từ localStorage

    if (!token) {
        return <Navigate to="/admin/login" replace />; // Chưa đăng nhập -> Chuyển đến trang đăng nhập
    }

    return <Outlet />; // Đã đăng nhập -> Hiển thị AdminLayout
};

export default ProtectedRoute;
