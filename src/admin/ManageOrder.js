import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const API_URL = "http://localhost:3000/api/orders";
  const ORDER_DETAILS_URL = "http://localhost:3000/api/order-details";

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(API_URL);
      if (response.data && Array.isArray(response.data.data)) {
        setOrders(response.data.data);
      } else {
        setError("Dữ liệu đơn hàng không hợp lệ.");
      }
    } catch (err) {
      console.error("Lỗi khi lấy đơn hàng:", err);
      setError("Không thể tải danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  };
  const updateOrderStatus = async (newStatus, orderId) => {
    const confirmMessage = `Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng thành "${newStatus}" không?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await axios.put(`${API_URL}/${orderId}`, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      alert(`Cập nhật trạng thái thành công: ${newStatus}`);
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", err);
      alert("Cập nhật trạng thái thất bại.");
    }
  };

  const fetchOrderDetails = async (order_id) => {
    try {
      const response = await axios.get(`${ORDER_DETAILS_URL}/${order_id}`);
      console.log("Order details response:", response.data); // Log the response to check the data
      if (response.data && Array.isArray(response.data.data)) {
        setSelectedOrderDetails(response.data.data);
      } else {
        setSelectedOrderDetails([]); // No details found
      }
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
      setSelectedOrderDetails([]); // Set to empty if error occurs
    }
  };

  const closeModal = () => {
    setSelectedOrderDetails(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4">
        <h2 className="fw-bold text-primary text-center">Quản Lý Đơn Hàng</h2>
        {loading ? (
          <p className="text-center text-info">Đang tải đơn hàng...</p>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover text-center align-middle">
              <thead className="table-primary">
                <tr>
                  <th>Tên Người Nhận</th>
                  <th>Số Điện Thoại</th>
                  <th>Địa Chỉ</th>
                  <th>Tổng Tiền</th>
                  <th>Trạng Thái</th>
                  <th>Phương Thức Thanh Toán</th>
                  {/* <th>Ngày Tạo</th>
                  <th>Ngày Cập Nhật</th>  */}
                  <th>Hành Động</th>
                  <th>Xem chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="fw-bold">{order.recipient_name}</td>
                      <td>{order.phone_number}</td>
                      <td>{order.address}</td>
                      <td className="fw-bold text-dark">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                          .format(order.total_amount)
                          .replace("₫", " VND")}
                      </td>
                      <td className="fw-semibold text-primary">
                        {order.status}
                      </td>
                      <td>
                        {order.payment_method === 0
                          ? "Thanh toán khi nhận hàng"
                          : "Thanh toán online"}
                      </td>
                      {/* <td>
                        {new Date(order.created_at).toLocaleDateString("vi-VN")}
                      </td>
                      <td>
                        {new Date(order.updated_at).toLocaleDateString("vi-VN")}
                      </td> */}
                      <td>
                        {order.status === "pending" && (
                          <>
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() =>
                                updateOrderStatus("paid", order.id)
                              }
                            >
                              Xác nhận thanh toán
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                updateOrderStatus("cancelled", order.id)
                              }
                            >
                              Hủy đơn
                            </button>
                          </>
                        )}
                        {order.status === "paid" && (
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() =>
                              updateOrderStatus("shipped", order.id)
                            }
                          >
                            Giao hàng
                          </button>
                        )}
                        {order.status === "shipped" && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                              updateOrderStatus("completed", order.id)
                            }
                          >
                            Hoàn thành
                          </button>
                        )}
                      </td>
                      <td>
                       

                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => fetchOrderDetails(order.id)}
                        >
                          Xem
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center text-muted">
                      Không có đơn hàng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {orders.length > itemsPerPage && (
          <div className="d-flex justify-content-center mt-3">
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FaChevronLeft /> Trước
            </button>
            <span className="align-self-center">
              Trang {currentPage} / {totalPages}
            </span>
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

      {/* Modal hiển thị chi tiết đơn hàng */}
      {selectedOrderDetails !== null && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chi Tiết Đơn Hàng</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                {selectedOrderDetails.length > 0 ? (
                  <ul>
                    {selectedOrderDetails.map((item, index) => (
                      <li key={index}>
                        <strong>{item.product_name}</strong> - Số lượng:{" "}
                        {item.quantity} - Giá:{" "}
                         {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                          .format(item.price)
                          .replace("₫", " VND")}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-muted">
                    Không có sản phẩm nào.
                  </p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
