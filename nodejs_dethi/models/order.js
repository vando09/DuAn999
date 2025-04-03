var db = require("./database");
const crypto = require('crypto');
// const querystring = require('querystring');


module.exports = class Order {
  constructor() {}

  // 🛒 Lấy tất cả đơn hàng
  static async getAll() {
    try {
      return await new Promise((resolve, reject) => {
        let sql = `SELECT * FROM orders`;
        db.query(sql, function (err, data) {
          if (err) reject(err);
          else resolve(data);
        });
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      throw new Error("Không thể lấy danh sách đơn hàng.");
    }
  }

  // 🆕 Thêm đơn hàng

  static async addOrder(order, products) {
    const connection = db;
    try {
      await connection.beginTransaction();
  
      if (order.payment_method == 1) {
        // 👉 Xử lý thanh toán qua VNPay
        process.env.TZ = "Asia/Ho_Chi_Minh";
        let vnp_TmnCode = process.env.VNP_TMN_CODE;
        let vnp_HashSecret = process.env.VNP_HASH_SECRET;
        let vnp_Url = process.env.VNP_URL;
        let vnp_ReturnUrl = process.env.VNP_RETURN_URL;
  
        let date = new Date();
        let orderId = date.getTime();
        let amount = order.total_amount * 100; // VNPay yêu cầu nhân 100
        let ipAddr = "127.0.0.1"; // Lấy IP thực tế nếu cần
  
        let pad = (num) => num.toString().padStart(2, "0");
  
        let createDate = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(
          date.getDate()
        )}${pad(date.getHours())}${pad(date.getMinutes())}${pad(
          date.getSeconds()
        )}`;
  
        let expireDateObj = new Date(date.getTime() + 15 * 60 * 1000);
        let expireDate = `${expireDateObj.getFullYear()}${pad(
          expireDateObj.getMonth() + 1
        )}${pad(expireDateObj.getDate())}${pad(expireDateObj.getHours())}${pad(
          expireDateObj.getMinutes()
        )}${pad(expireDateObj.getSeconds())}`;
  
        let vnp_Params = {
          vnp_Version: "2.1.0",
          vnp_Command: "pay",
          vnp_TmnCode: vnp_TmnCode,
          vnp_Locale: "vn",
          vnp_CurrCode: "VND",
          vnp_TxnRef: orderId.toString(),
          vnp_OrderInfo: `${orderId}`,
          vnp_OrderType: "billpayment",
          vnp_Amount: amount,
          vnp_ReturnUrl: vnp_ReturnUrl,
          vnp_IpAddr: ipAddr,
          vnp_CreateDate: createDate,
          vnp_ExpireDate: expireDate,
        };
  
        const sortedParams = Object.keys(vnp_Params)
          .sort()
          .reduce((acc, key) => {
            acc[key] = vnp_Params[key];
            return acc;
          }, {});
  
        const queryString = new URLSearchParams(sortedParams).toString();
  
        const hmac = crypto.createHmac("sha512", vnp_HashSecret);
        const signed = hmac.update(Buffer.from(queryString, "utf-8")).digest("hex");
  
        vnp_Params["vnp_SecureHash"] = signed;
  
        const paymentUrl = `${vnp_Url}?${queryString}&vnp_SecureHash=${signed}`;
  
        console.log("🔍 URL Thanh Toán VNPay:", paymentUrl);
        console.log("🔏 Chữ ký tạo ra:", signed);
        console.log("🔑 VNP_HASH_SECRET:", process.env.VNP_HASH_SECRET);
  
        return { success: true, paymentUrl, vnp_Params };
      } else if (order.payment_method == 0) {
        // 👉 Xử lý đơn hàng khi chọn "Nhận hàng" (COD)
        let [orderResult] = await connection.query(
          "INSERT INTO orders (user_id, recipient_name, phone_number, address, total_amount, status, created_at, updated_at, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            order.user_id,
            order.recipient_name,
            order.phone_number,
            order.address,
            order.total_amount,
            order.status,
            new Date(), // created_at
            new Date(), // updated_at
            order.payment_method,
          ]
        );
  
        let orderId = orderResult.insertId;
  
        const orderItems = products.map((product) => [
          orderId,
          product.product_name,
          product.quantity,
          product.price,
        ]);
  
        await connection.query(
          "INSERT INTO order_details (order_id, product_name, quantity, price) VALUES ?",
          [orderItems]
        );
  
        await connection.commit();
        return { success: true, message: "Đơn hàng đã được thêm thành công." };
      } else {
        throw new Error("Phương thức thanh toán không hợp lệ.");
      }
    } catch (error) {
      await connection.rollback();
      console.error("❌ Lỗi khi xử lý đơn hàng:", error.message);
      throw new Error(error.message || "Lỗi khi thêm đơn hàng.");
    }
  }
  

  
  
  
  // 🔍 Lấy đơn hàng theo ID
  static async getOrderById(userId) {
    try {
      return await new Promise((resolve, reject) => {
        db.query(
          "SELECT * FROM orders WHERE user_id = ?",
          [userId],
          function (err, data) {
            if (err) reject(err);
            else resolve(data);
          }
        );
      });
    } catch (error) {
      console.error(`Lỗi khi lấy đơn hàng với ID ${userId}:`, error);
      throw new Error("Không thể lấy đơn hàng.");
    }
  }

  // ✏️ Cập nhật đơn hàng
  static async updateOrder(order, id) {
    try {
      return await new Promise((resolve, reject) => {
        db.query(
          "UPDATE orders SET status= ? WHERE id = ?",
          [order, id],
          function (err, data) {
            if (err) reject(err);
            else resolve(data);
          }
        );
      });
    } catch (error) {
      console.error(`Lỗi khi cập nhật đơn hàng với ID ${id}:`, error);
      throw new Error("Không thể cập nhật đơn hàng.");
    }
  }

  // ❌ Xóa đơn hàng
  static async deleteOrder(orderId) {
    try {
      return await new Promise((resolve, reject) => {
        db.query(
          "DELETE FROM orders WHERE id = ?",
          [orderId],
          function (err, data) {
            if (err) reject(err);
            else resolve(data);
          }
        );
      });
    } catch (error) {
      console.error(`Lỗi khi xóa đơn hàng với ID ${orderId}:`, error);
      throw new Error("Không thể xóa đơn hàng.");
    }
  }

  static async getOrderDetailsByOrderId(orderId) {
    try {
      return await new Promise((resolve, reject) => {
        const query = `
          SELECT
            product_name,
            quantity,
            price,
            created_at,
            updated_at
          FROM order_details
          WHERE order_id = ?
        `;

        db.query(query, [orderId], (err, data) => {
          if (err) {
            console.error("Database query error:", err);
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw new Error("Không thể lấy chi tiết đơn hàng.");
    }
  }
  
  
  
};
