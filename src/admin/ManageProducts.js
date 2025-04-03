import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const API_URL = "http://localhost:3000/api/products";
  const CATEGORY_API_URL = "http://localhost:3000/api/categories";

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      if (response.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
      } else {
        setError("Dữ liệu sản phẩm không hợp lệ.");
      }
    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm:", err);
      setError("Không thể tải danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách danh mục
  const fetchCategories = async () => {
    try {
      const response = await axios.get(CATEGORY_API_URL);
      if (response.data && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      } else {
        setError("Dữ liệu danh mục không hợp lệ.");
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh mục:", err);
      setError("Không thể tải danh mục.");
    }
  };

  // Xóa sản phẩm
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setProducts(products.filter((product) => product.id !== id));
      setNotification({ message: "Xóa sản phẩm thành công!", type: "success" });
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
      setNotification({ message: "Không thể xóa sản phẩm.", type: "error" });
    }
  };

  // Lấy tên danh mục theo ID
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Không rõ";
  };

  // Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-primary">Quản Lý Sản Phẩm</h2>
          <Link to="/admin/add-product" className="btn btn-primary d-flex align-items-center">
            <FaPlus className="me-2" /> Thêm Sản Phẩm
          </Link>
        </div>

        {notification.message && (
          <div className={`alert alert-${notification.type === "success" ? "success" : "danger"} text-center`} role="alert">
            {notification.message}
          </div>
        )}

        {loading ? (
          <p className="text-center text-info">Đang tải sản phẩm...</p>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover text-center align-middle">
              <thead className="table-primary">
                <tr>
                  <th>ID</th>
                  <th>Hình Ảnh</th>
                  <th>Tên Sản Phẩm</th>
                  <th>Giá</th>
                  <th>Giảm Giá</th>
                  <th>Mô Tả</th>
                  <th>Số Lượng</th>
                  <th>Danh Mục</th>
                  <th>Ngày Tạo</th>
                  <th>Ngày Cập Nhật</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="fw-bold">{product.id}</td>
                      <td>
                        <img
                          src={product.image}
                          alt={product.name}
                          width="70"
                          height="70"
                          className="rounded border"
                          style={{ objectFit: "cover" }}
                        />
                      </td>
                      <td className="fw-semibold">{product.name}</td>
                      <td className="fw-bold text-dark">
                        {product.price
                          ? new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(product.price).replace("₫", " VND")
                          : "Liên hệ"}
                      </td>
                      <td className={`fw-bold ${product.discount ? "text-danger" : "text-muted"}`}>
                        {product.discount ? `${product.discount}%` : "Không"}
                      </td>
                      <td className="text-truncate" style={{ maxWidth: "150px" }}>
                        {product.description || "Không có mô tả"}
                      </td>
                      <td>{product.stock || "Không rõ"}</td>
                      <td>{getCategoryName(product.category_id)}</td>
                      <td className="text-secondary">
                        {product.created_at
                          ? new Date(product.created_at).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </td>
                      <td className="text-secondary">
                        {product.updated_at
                          ? new Date(product.updated_at).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </td>
                      <td>
                        <div className="d-flex justify-content-center">
                          <Link to={`/admin/edit-product/${product.id}`} className="btn btn-sm btn-outline-primary me-2">
                            <FaEdit /> Sửa
                          </Link>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(product.id)}>
                            <FaTrash /> Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="text-center text-muted">
                      Không có sản phẩm nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {products.length > itemsPerPage && (
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

export default ManageProducts;
