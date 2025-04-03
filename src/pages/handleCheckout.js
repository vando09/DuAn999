import axios from "axios";

const handleCheckout = async (order, products) => {
  try {
    const response = await axios.post("http://localhost:3000/api/orders", {
      order,
      products,
    });

    if (response.data.success) {
      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl; // Chuyển hướng đến VNPay
      } else {
        alert("Đơn hàng COD đã được đặt thành công!");
      }
    } else {
      alert("Lỗi: Không thể đặt hàng.");
    }
  } catch (error) {
    console.error("❌ Lỗi khi gửi đơn hàng:", error);
    alert("Có lỗi xảy ra, vui lòng thử lại.");
  }
};

export default handleCheckout;
