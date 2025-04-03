import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const API_URL = "http://localhost:3000/api/categories";

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_URL);
      if (response.data && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      } else {
        setError("Dữ liệu không hợp lệ.");
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh mục:", err);
      setError("Không thể tải danh sách danh mục.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setCategories(categories.filter((category) => category.id !== id));
      setNotification({ message: "Xóa danh mục thành công!", type: "success" });
    } catch (err) {
      console.error("Lỗi khi xóa danh mục:", err);
      setNotification({ message: "Không thể xóa danh mục.", type: "error" });
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(categories.length / itemsPerPage);

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-primary">Quản Lý Danh Mục</h2>
          <Link to="/admin/add-category" className="btn btn-primary d-flex align-items-center">
            <FaPlus className="me-2" /> Thêm Danh Mục
          </Link>
        </div>

        {notification.message && (
          <div className={`alert alert-${notification.type === "success" ? "success" : "danger"} text-center`}>
            {notification.message}
          </div>
        )}

        {loading ? (
          <p className="text-center text-info">Đang tải danh mục...</p>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover text-center align-middle">
              <thead className="table-primary">
                <tr>
                  <th>ID</th>
                  <th>Tên Danh Mục</th>
                  <th>Slug</th>
                  <th>Ngày Tạo</th>
                  <th>Ngày Cập Nhật</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {currentCategories.length > 0 ? (
                  currentCategories.map((category) => (
                    <tr key={category.id}>
                      <td className="fw-bold">{category.id}</td>
                      <td className="fw-semibold">{category.name}</td>
                      <td className="text-muted">{category.slug}</td>
                      <td className="text-secondary">
                        {category.created_at ? new Date(category.created_at).toLocaleDateString("vi-VN") : "N/A"}
                      </td>
                      <td className="text-secondary">
                        {category.updated_at ? new Date(category.updated_at).toLocaleDateString("vi-VN") : "N/A"}
                      </td>
                      <td>
                        <div className="d-flex justify-content-center">
                          <Link to={`/admin/edit-category/${category.id}`} className="btn btn-sm btn-outline-primary me-2">
                            <FaEdit /> Sửa
                          </Link>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(category.id)}>
                            <FaTrash /> Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-muted">
                      Không có danh mục nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {categories.length > itemsPerPage && (
          <div className="d-flex justify-content-center mt-3">
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FaChevronLeft /> Trước
            </button>
            <span className="align-self-center">Trang {currentPage} / {totalPages}</span>
            <button
              className="btn btn-outline-primary ms-2"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCategories;