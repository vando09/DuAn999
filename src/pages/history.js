import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchOrders } from "../redux/ordersSlice";
import "./OrdersList.css";

const OrdersList = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  const { items: orders = [], loading, error } = useSelector((state) => state.orders);
  const orderData = Array.isArray(orders?.data) ? orders.data : [];

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // State for selected order details and modal visibility
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null); // Changed to null initially

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchOrders(user.id));
    }
  }, [dispatch, user?.id]);

  const updateOrderStatus = async (orderId) => {
    const confirmMessage = "Bạn có chắc chắn muốn hủy đơn hàng này không?";

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      // Update the status to "cancelled"
      await axios.put(`http://localhost:3000/api/orders/${orderId}`, { status: "cancelled" });

      // Remove the cancelled order from the list
      dispatch(fetchOrders(user.id));  // Refresh the order list after status update
      alert("Cập nhật trạng thái thành công: Đã hủy đơn hàng.");
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", err);
      alert("Cập nhật trạng thái thất bại.");
    }
  };

  // Fetch order details when clicking on 'Xem chi tiết'
  const fetchOrderDetails = async (order_id) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/order-details/${order_id}`);
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

  // Pagination logic
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orderData.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orderData.length / itemsPerPage);

  return (
    <div>
      <h2>Danh sách đơn hàng</h2>
      <table border={1} className="orders-table">
        <thead>
          <tr>
            <th>Người nhận</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Ngày đặt</th>
            <th>Phương thức thanh toán</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.recipient_name || "N/A"}</td>
                <td>{order.phone_number || "N/A"}</td>
                <td>{order.address || "N/A"}</td>
                <td> 
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(order.total_amount).replace("₫", "VNĐ")}
                </td>
                <td>{order.status}</td>
                <td>{new Date(order.created_at).toLocaleDateString("vi-VN")}</td>
                <td>
                  {order.payment_method === 0
                    ? "Thanh toán khi nhận hàng"
                    : order.payment_method === 1
                    ? "Thanh toán qua PayPal"
                    : "Không xác định"}
                </td>
                <td>
                  {order.status === "pending" && (
                    <button
                      className="btn btn-danger"
                      onClick={() => updateOrderStatus(order.id)}
                    >
                      Hủy
                    </button>
                  )}
                  <button
                    className="btn btn-info"
                    onClick={() => fetchOrderDetails(order.id)}
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="no-orders">Không có đơn hàng nào.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="pagination-button"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &#60; Prev
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`pagination-button ${currentPage === index + 1 ? "active" : ""}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="pagination-button"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next &#62;
          </button>
        </div>
      )}

      {/* Modal for Order Details */}
      {selectedOrderDetails !== null && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chi Tiết Đơn Hàng</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
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
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
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

export default OrdersList;
