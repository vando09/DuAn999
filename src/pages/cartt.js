import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, updateCartItem, removeCartItem } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa"; // Icon xóa sản phẩm

const Cart = () => {
  const dispatch = useDispatch();
  const {
    items = {},
    loading,
    error,
    notification,
  } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.login.currentUser);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  const [editingItemId, setEditingItemId] = useState(null);
  const [updatedQuantity, setUpdatedQuantity] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCart(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (notification?.message) {
      setAlertMessage(notification.message);
      setTimeout(() => setAlertMessage(""), 3000);
    }
  }, [notification]);

  const cart = Array.isArray(items.data)
    ? items.data.filter((item) => item?.price)
    : [];
  // const totalPrice = cart.reduce(
  //   (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
  //   0
  // );

  const startEditing = (id, quantity) => {
    setEditingItemId(id);
    setUpdatedQuantity(quantity);
  };

  const handleQuantityChange = async (id, quantity) => {
    console.log("Cập nhật giỏ hàng:", id, quantity);
  
    if (!id || !quantity || quantity < 1) {
      console.error("Lỗi: ID không hợp lệ hoặc số lượng nhỏ hơn 1");
      return;
    }
  
    try {
      await dispatch(updateCartItem({ cartItemId: id, quantity })).unwrap(); // Cập nhật số lượng
      setTimeout(() => dispatch(fetchCart(user?.id)), 500); // Fetch giỏ hàng sau một khoảng thời gian
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng:", error);
    } finally {
      setEditingItemId(null); // Đóng input sau khi cập nhật xong
    }
  };
  

  const handleRemove = (id) => {
    dispatch(removeCartItem(id));
  };
  const handleCheckboxChange = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  const units = Array.isArray(cart) ? cart : [];
  console.log("cc",cart);
  
  const selectedCartTotal = cart
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

    const payment = () => {

      // Lấy danh sách sản phẩm được checkbox
      const selectedProducts = units.filter((item) =>
        selectedItems.includes(item.id)
      );
  
      // Điều hướng sang trang thanh toán và gửi dữ liệu
      navigate("/checkout", {
        state: { selectedProducts, selectedCartTotal },
      });
    };
  if (loading) return <p>Đang tải giỏ hàng...</p>;
  if (error) return <p style={{ color: "red" }}>Lỗi: {error}</p>;

  return (
    <section className="shoping-cart spad">
      <div className="container">
        {alertMessage && <p style={{ color: "green" }}>{alertMessage}</p>}

        <div className="row">
          <div className="col-lg-12">
            <div className="shoping__cart__table">
              <table>
                <thead>
                  <tr>
                  <th>Chọn</th>
                    <th className="shoping__product">Sản phẩm</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Tổng</th>
                    <th>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.length > 0 ? (
                    cart.map((item) => (
                      <tr key={item.id} style={{ height: "50px" }}>
                        <td>
                          <input
                            type="checkbox"
                            style={{ width: "15px", height: "15px" }}
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleCheckboxChange(item.id)}
                          />
                        </td>
                        <td
                          className="shoping__cart__item"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                            }}
                          />
                          <h5 style={{ fontSize: "14px", margin: 0 }}>
                            {item.name}
                          </h5>
                        </td>
                        <td className="shoping__cart__price">
                          {item.price
                            ? new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })
                                .format(item.price)
                                .replace("₫", "VNĐ")
                            : "Liên hệ"}
                        </td>

                        <td className="shoping__cart__quantity">
                          {editingItemId === item.id ? (
                            <input
                              type="number"
                              value={updatedQuantity ?? item.quantity} // Giữ giá trị cũ nếu bị `undefined`
                              min="1"
                              onChange={(e) => {
                                const newQuantity = Number(e.target.value);
                                if (!isNaN(newQuantity) && newQuantity >= 1) {
                                  setUpdatedQuantity(newQuantity);
                                }
                              }}
                              onBlur={() =>
                                handleQuantityChange(
                                  item.id,
                                  updatedQuantity ?? item.quantity
                                )
                              }
                              onKeyDown={(e) =>
                                e.key === "Enter" &&
                                handleQuantityChange(
                                  item.id,
                                  updatedQuantity ?? item.quantity
                                )
                              }
                              autoFocus
                              style={{
                                width: "50px",
                                padding: "5px",
                                textAlign: "center",
                              }}
                            />
                          ) : (
                            <span
                              onClick={() =>
                                startEditing(item.id, item.quantity)
                              }
                              style={{
                                cursor: "pointer",
                                padding: "5px",
                                border: "1px solid #ddd",
                                display: "inline-block",
                                minWidth: "30px",
                                textAlign: "center",
                              }}
                            >
                              {item.quantity}
                            </span>
                          )}
                        </td>

                        <td className="shoping__cart__total">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })
                            .format((Number(item.price) || 0) * (Number(item.quantity) || 1))
                            .replace("₫", "VNĐ")}
                        </td>

                        <td className="shoping__cart__item__close">
                          <button
                            onClick={() => handleRemove(item.id)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            <FaTrashAlt size={18} color="red" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        Giỏ hàng trống
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <div className="shoping__checkout">
              <h5>Tổng giỏ hàng</h5>
              <ul>
                <li>
                  Tạm tính{" "}
                  <span>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })
                        .format(selectedCartTotal)
                        .replace("₫", "VNĐ")}
                    </span>
                  </span>
                </li>
                <li>
                  Tổng cộnggg{" "}
                  <span>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })
                        .format(selectedCartTotal)
                        .replace("₫", "VNĐ")}
                    </span>
                  </span>
                </li>
              </ul>
              {selectedItems.length > 0 && (
                <button
                  onClick={payment}
                  className="primary-btn"
                >
                  TIẾN HÀNH THANH TOÁN
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
