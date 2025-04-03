import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import handleCheckout from "./handleCheckout";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedProducts, selectedCartTotal } = location.state || { selectedProducts: [], selectedCartTotal: 0 };

  // Lấy user_id từ Redux store (nếu có)
  const user = useSelector((state) => state.auth.login.currentUser);
  const user_id = user ? user.id : null;

  // ✅ Định nghĩa schema validation bằng Yup
  const validationSchema = Yup.object().shape({
    recipient_name: Yup.string()
      .matches(/^[\p{L} ]+$/u, "Tên không được chứa số hoặc ký tự đặc biệt")
      .required("Vui lòng nhập họ và tên"),
    phone_number: Yup.string()
      .matches(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ")
      .required("Vui lòng nhập số điện thoại"),
    address: Yup.string()
      .max(255, "Địa chỉ quá dài")
      .required("Vui lòng nhập địa chỉ"),
    paymentMethod: Yup.string().required("Vui lòng chọn phương thức thanh toán"),
  });

  // ✅ Xử lý submit form
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const orderData = {
      user_id,
      recipient_name: values.recipient_name,
      phone_number: values.phone_number,
      address: values.address,
      total_amount: selectedCartTotal,
      status: "Pending",
      payment_method: values.paymentMethod,
      products: selectedProducts.map((product) => ({
        product_name: product.name,
        quantity: product.quantity,
        price: product.price,
      })),
    };
  
    try {
      const response = await axios.post("http://localhost:3000/api/orders", orderData);
      
      console.log("Đơn hàng đã lưu:", response.data);
  
      if (response.data.success && response.data.paymentUrl) {
        // Nếu có URL thanh toán VNPay, chuyển hướng đến đó
        window.location.href = response.data.paymentUrl;
      } else {
        // Nếu không có VNPay, hiển thị thông báo và chuyển hướng
        alert("Đơn hàng đã được đặt thành công!");
        resetForm();
        navigate(`/history/${user?.id || "guest"}`);
      }
    } catch (error) {
      console.error("❌ Lỗi khi đặt hàng:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="checkout spad">
      <div className="container">
        <h4 className="checkout__title">Thông tin thanh toán</h4>

        <Formik
          initialValues={{
            recipient_name: "",
            phone_number: "",
            address: "",
            paymentMethod: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="checkout-form">
              {/* Họ và tên */}
              <div className="checkout__input">
                <label htmlFor="recipient_name">Họ và tên<span>*</span></label>
                <Field type="text" name="recipient_name" placeholder="Nhập họ và tên" style={{ color: "black" }} />
                <ErrorMessage name="recipient_name" component="div" className="error-message" style={{ color: "red", fontSize: "14px" }} />
                
              </div>

              {/* Số điện thoại */}
              <div className="checkout__input">
                <label htmlFor="phone_number">Số điện thoại<span>*</span></label>
                <Field type="text" name="phone_number" placeholder="Nhập số điện thoại"  style={{ color: "black" }}  />
                <ErrorMessage name="phone_number" component="div" className="error-message" style={{ color: "red", fontSize: "14px" }}  />
              </div>

              {/* Địa chỉ */}
              <div className="checkout__input">
                <label htmlFor="address">Địa chỉ<span>*</span></label>
                <Field type="text" name="address" placeholder="Nhập địa chỉ"  style={{ color: "black" }}  />
                <ErrorMessage name="address" component="div" className="error-message" style={{ color: "red", fontSize: "14px" }}  />
              </div>

              <h4 className="checkout__title">Đơn hàng của bạn</h4>
<table className="checkout__order-table">
  <thead>
    <tr>
      <th>Sản phẩm</th>
      <th>Số lượng</th>
      <th>Đơn giá</th>
      <th>Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    {selectedProducts.map((item) => (
      <tr key={item.id} className="checkout__order-row">
        <td  className="text-truncate" style={{ maxWidth: "250px" }}>{item.name}</td>
        <td>{item.quantity}</td>
        <td>
          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
            .format(item.price)
            .replace("₫", "VNĐ")}
        </td>
        <td>
          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
            .format(item.price * item.quantity)
            .replace("₫", "VNĐ")}
        </td>
      </tr>
    ))}
  </tbody>
</table>
<br></br>


              {/* Tổng tiền */}
              <div className="checkout__order__total">
                Tổng tiền: 
                <span>
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(selectedCartTotal).replace("₫", "VNĐ")}
                </span>
              </div>
              <br></br>

              {/* Phương thức thanh toán */}
              <h4 className="checkout__title">Phương thức thanh toán</h4>
              <div className="checkout__input__checkbox">
                <label>
                  Thanh toán khi nhận hàng
                  <Field type="radio" name="paymentMethod" value="0" />
                  <span className="checkmark"></span>
                </label>
              </div>
              <div className="checkout__input__checkbox">
                <label>
                  Paypal
                  <Field type="radio" name="paymentMethod" value="1" />
                  <span className="checkmark"></span>
                </label>
              </div>
              <ErrorMessage name="paymentMethod" component="div" className="error-message" style={{ color: "red", fontSize: "14px" }}  />

              {/* Nút đặt hàng */}
              <button  type="submit" className="site-btn checkout-btn" disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : "ĐẶT HÀNG"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

export default Checkout;
