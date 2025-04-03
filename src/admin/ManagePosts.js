import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ManagePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const API_URL = "http://localhost:3000/api/posts";

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(API_URL);
      if (response.data && Array.isArray(response.data.data)) {
        setPosts(response.data.data);
      } else {
        setError("Dữ liệu không hợp lệ.");
      }
    } catch (err) {
      console.error("Lỗi khi lấy bài viết:", err);
      setError("Không thể tải danh sách bài viết.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
      setNotification({ message: "Xóa bài viết thành công!", type: "success" });
    } catch (err) {
      console.error("Lỗi khi xóa bài viết:", err);
      setNotification({ message: "Không thể xóa bài viết.", type: "error" });
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPosts = posts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(posts.length / itemsPerPage);

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-primary">Quản Lý Bài Viết</h2>
          <Link to="/admin/add-post" className="btn btn-primary d-flex align-items-center">
            <FaPlus className="me-2" /> Thêm Bài Viết
          </Link>
        </div>

        {notification.message && (
          <div className={`alert alert-${notification.type === "success" ? "success" : "danger"} text-center`} role="alert">
            {notification.message}
          </div>
        )}

        {loading ? (
          <p className="text-center text-info">Đang tải bài viết...</p>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover text-center align-middle">
              <thead className="table-primary">
                <tr>
                  <th>ID</th>
                  <th>ID Người Dùng</th>
                  <th>Tiêu Đề</th>
                  <th>Nội Dung</th>
                  <th>Hình Ảnh</th>
                  <th>Ngày Tạo</th>
                  <th>Ngày Cập Nhật</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.length > 0 ? (
                  currentPosts.map((post) => (
                    <tr key={post.id}>
                      <td className="fw-bold">{post.id}</td>
                      <td>{post.user_id}</td>
                      <td className="fw-semibold">{post.title}</td>
                      <td className="text-truncate" style={{ maxWidth: "250px" }}>{post.content}</td>
                      <td>
                        <img
                          src={post.image}
                          alt={post.title}
                          width="70"
                          height="70"
                          className="rounded border"
                          style={{ objectFit: "cover" }}
                        />
                      </td>
                      <td className="text-secondary">
                        {post.created_at ? new Date(post.created_at).toLocaleDateString("vi-VN") : "N/A"}
                      </td>
                      <td className="text-secondary">
                        {post.updated_at ? new Date(post.updated_at).toLocaleDateString("vi-VN") : "N/A"}
                      </td>
                      <td>
                        <div className="d-flex justify-content-center">
                          <Link to={`/admin/edit-post/${post.id}`} className="btn btn-sm btn-outline-primary me-2">
                            <FaEdit /> Sửa
                          </Link>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(post.id)}>
                            <FaTrash /> Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center text-muted">
                      Không có bài viết nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {posts.length > itemsPerPage && (
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

export default ManagePosts;
