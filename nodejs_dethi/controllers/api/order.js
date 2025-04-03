const Order = require("../../models/order");


// 🛒 Lấy danh sách đơn hàng
exports.listOrdersAPI = async (req, res, next) => {
  try {
    const orders = await Order.getAll();
    res.status(200).json({ data: orders });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    next(error);
  }
};

exports.addOrder = async (req, res, next) => {
  try {
    const {
      user_id,
      recipient_name,
      phone_number,
      address,
      total_amount,
      payment_method,
      status,
      products,
    } = req.body;

    if (
      !user_id ||
      !recipient_name ||
      !phone_number ||
      !address ||
      !total_amount ||
      !payment_method ||
      !products?.length
    ) {
      return res
        .status(400)
        .json({ error: "Thiếu thông tin đơn hàng hoặc sản phẩmm." });
    }

    // Tạo đối tượng order
    const order = {
      user_id,
      recipient_name,
      phone_number,
      address,
      total_amount,
      payment_method,
      status: status || "Pending",
      created_at: new Date(),
      updated_at: new Date(),
    };

    // 👉 Gọi addOrder và lấy phản hồi
    const result = await Order.addOrder(order, products);

    if (result.success && result.paymentUrl) {
      // ✅ Trả về URL thanh toán nếu dùng VNPay
      return res
        .status(200)
        .json({
          success: true,
          paymentUrl: result.paymentUrl,
          vnp_Params: result.vnp_Params,
        });
    }

    // ✅ Trả về thông báo thành công nếu không thanh toán VNPay
    res
      .status(201)
      .json({
        success: true,
        message: "Đơn hàng đã được tạo thành công.",
        result,
      });
  } catch (error) {
    console.error("Lỗi khi thêm đơn hàng:", error);
    next(error);
  }
};

// ✏️ Cập nhật đơn hàng
exports.updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id)
      return res.status(400).json({ error: "Thiếu ID đơn hàng để cập nhật." });
    if (!status) {
      return res.status(400).json({ error: "Thiếu thông tin cần cập nhật." });
    }

    const result = await Order.updateOrder(status, id);
    if (!result)
      return res
        .status(404)
        .json({ error: "Không tìm thấy đơn hàng để cập nhật." });

    res
      .status(200)
      .json({ message: "Đơn hàng đã được cập nhật.", result, status });
  } catch (error) {
    console.error("Lỗi khi cập nhật đơn hàng:", error);
    next(error);
  }
};

// ❌ Xóa đơn hàng
exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id)
      return res.status(400).json({ error: "Thiếu ID đơn hàng để xóa." });

    const result = await Order.deleteOrder(id);
    if (!result)
      return res.status(404).json({ error: "Không tìm thấy đơn hàng để xóa." });

    res
      .status(200)
      .json({ message: "Đơn hàng đã được xóa thành công.", result });
  } catch (error) {
    console.error("Lỗi khi xóa đơn hàng:", error);
    next(error);
  }
};

// exports.listOrderDetailsAPI = async (req, res, next) => {
//   try {
//     const { order_id } = req.params;
//     if (!order_id) {
//       return res.status(400).json({ message: "Thiếu order_id" });
//     }

//     const details = await Order.getOrderDetailsByOrderId(order_id);
//     res.status(200).json({ data: details });
//   } catch (error) {
//     console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
//     next(error);
//   }
// };

exports.listOrder = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "Thiếu user_id" });
    }

    const details = await Order.getOrderById(userId);

    if (details.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy chi tiết đơn hàng cho user_id này" });
    }

    res.status(200).json({ data: details });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
    next(error);
  }
};




exports.listOrderDetailsAPI = async (req, res, next) => {
  try {
    const { order_id } = req.params;

    if (!order_id) {
      return res.status(400).json({ message: "Thiếu order_id" });
    }

    const details = await Order.getOrderDetailsByOrderId(order_id);

    if (details.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy chi tiết đơn hàng." });
    }

    res.status(200).json({ data: details });

  } catch (error) {
    console.error("Error fetching order details:", error);
    next(error);
  }
};





exports.handleVnpayCallback = async (vnp_Params, orderData, products) => {
  try {
    // Log dữ liệu để kiểm tra
    console.log("orderData:", JSON.stringify(orderData, null, 2));  // In ra toàn bộ orderData
    console.log("products:", JSON.stringify(products, null, 2));  // In ra toàn bộ products

    if (vnp_Params.vnp_ResponseCode === "00") {
      const {
        user_id,
        recipient_name,
        phone_number,
        address,
        total_amount,
        payment_method,
        status = "paid", // Đặt mặc định là "Paid"
      } = orderData;

      // Kiểm tra các tham số cần thiết có hợp lệ không
      if (
        !user_id ||
        !recipient_name ||
        !phone_number ||
        !address ||
        !total_amount ||
        !payment_method ||
        !products?.length
      ) {
        console.log("Dữ liệu không đầy đủ:", {
          user_id,
          recipient_name,
          phone_number,
          address,
          total_amount,
          payment_method,
          productsLength: products?.length
        });
        throw new Error("Dữ liệu thanh toán không đầy đủ.");
      }

      // Tạo đơn hàng mới
      const order = {
        user_id,
        recipient_name,
        phone_number,
        address,
        total_amount,
        payment_method,
        status,  // Thanh toán thành công
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Lưu đơn hàng vào cơ sở dữ liệu
      const result = await Order.addOrder(order, products);

      console.log("Đơn hàng đã được thêm vào CSDL:", result);
      return { message: "Thanh toán thành công!" };
    } else {
      throw new Error("Thanh toán thất bại!");
    }
  } catch (error) {
    console.error("Lỗi khi xử lý callback VNPay:", error);
    throw error;
  }
};







