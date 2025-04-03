import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const API_URL = "http://localhost:3000/api/users";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      if (response.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      } else {
        setError("Dữ liệu không hợp lệ.");
      }
    } catch (err) {
      console.error("Lỗi khi lấy người dùng:", err);
      setError("Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      setNotification({ message: "Xóa người dùng thành công!", type: "success" });
    } catch (err) {
      console.error("Lỗi khi xóa người dùng:", err);
      setNotification({ message: "Không thể xóa người dùng.", type: "error" });
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(users.length / itemsPerPage);

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-primary">Quản Lý Người Dùng</h2>
          <Link to="/admin/add-user" className="btn btn-primary d-flex align-items-center">
            <FaPlus className="me-2" /> Thêm Người Dùng
          </Link>
        </div>

        {notification.message && (
          <div className={`alert alert-${notification.type === "success" ? "success" : "danger"} text-center`}>
            {notification.message}
          </div>
        )}

        {loading ? (
          <p className="text-center text-info">Đang tải người dùng...</p>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover text-center align-middle">
              <thead className="table-primary">
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Email</th>
                  {/* <th>Mật khẩu</th> */}
                  <th>Vai trò</th>
                  <th>Số điện thoại</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="fw-bold">{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      {/* <td>******</td> */}
                      <td>{user.role}</td>
                      <td>{user.phone}</td>
                      <td>
                        <div className="d-flex justify-content-center">
                          <Link to={`/admin/edit-user/${user.id}`} className="btn btn-sm btn-outline-primary me-2">
                            <FaEdit /> Sửa
                          </Link>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user.id)}>
                            <FaTrash /> Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center text-muted">Không có người dùng nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {users.length > itemsPerPage && (
          <div className="d-flex justify-content-center mt-3">
            <button className="btn btn-outline-primary me-2" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              <FaChevronLeft /> Trước
            </button>
            <span className="align-self-center">Trang {currentPage} / {totalPages}</span>
            <button className="btn btn-outline-primary ms-2" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
              Sau <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;