import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, updateCartItem, removeCartItem } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const { items = {}, loading, error, notification } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.login.currentUser);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

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

  // Lấy dữ liệu giỏ hàng từ Redux
  const cart = Array.isArray(items.data) ? items.data.filter(item => item?.price) : [];

  // Tính tổng tiền
  const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  // Xử lý cập nhật số lượng sản phẩm
  const handleQuantityChange = (id, quantity) => {
    if (quantity > 0) {
      dispatch(updateCartItem({ id, quantity }));
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemove = (id) => {
    dispatch(removeCartItem(id));
  };

  if (loading) return <p>Loading cart...</p>;
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
                    <th className="shoping__product">Products</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.length > 0 ? (
                    cart.map((item) => (
                      <tr key={item.id}>
                        <td className="shoping__cart__item">
                          <img src={item.image} alt={item.name} style={{ width: "80px", height: "80px" }} />
                          <h5>{item.name}</h5>
                        </td>
                        <td className="shoping__cart__price">${item.price.toFixed(2)}</td>
                        <td className="shoping__cart__quantity">
                          <div className="quantity">
                            <input
                              type="number"
                              value={item.quantity}
                              min="1"
                              onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                            />
                          </div>
                        </td>
                        <td className="shoping__cart__total">${(item.price * item.quantity).toFixed(2)}</td>
                        <td className="shoping__cart__item__close">
                          <button onClick={() => handleRemove(item.id)}>❌</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>Giỏ hàng trống</td>
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
              <h5>Cart Total</h5>
              <ul>
                <li>Subtotal <span>${totalPrice.toFixed(2)}</span></li>
                <li>Total <span>${totalPrice.toFixed(2)}</span></li>
              </ul>
              <button onClick={() => navigate("/checkout")} className="primary-btn">
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
