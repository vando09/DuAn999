var db = require("./database");

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
    const connection = db; // Không cần getConnection
    try {
      await connection.beginTransaction();
  
      // Thêm đơn hàng vào bảng orders
      connection.query("INSERT INTO orders SET ?", order, (err, result) => {
        if (err) {
          connection.rollback();
          throw new Error("Không thể thêm đơn hàng.");
        }
        const orderId = result.insertId;
  
        // Thêm sản phẩm vào bảng order_details
          const orderItems = products.map((product) => [
            orderId,
            product.product_name,
            product.quantity,
            product.price,
          ]);
        
          connection.query(
            "INSERT INTO order_details (order_id, product_name, quantity, price) VALUES ?",
            [orderItems],
            (err) => {
              if (err) {
                return connection.rollback(() => {
                  console.error("❌ Lỗi khi thêm sản phẩm vào đơn hàng:", err);
                });
              }
              connection.commit((commitErr) => {
                if (commitErr) {
                  return console.error("❌ Lỗi commit giao dịch:", commitErr);
                }
                console.log("✅ Thêm sản phẩm vào đơn hàng thành công!");
              });
            }
          );
        
      });
  
      return { success: true, message: "Đơn hàng đã được thêm." };
    } catch (error) {
      connection.rollback();
      throw new Error(error.message || "Lỗi khi thêm đơn hàng.");
    }
  }
  
  

  // 🔍 Lấy đơn hàng theo ID
  static async getOrderById(userId) {
    try {
      return await new Promise((resolve, reject) => {
        db.query("SELECT * FROM orders WHERE user_id = ?", [userId], function (err, data) {
          if (err) reject(err);
          else resolve(data);
        });
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
        db.query("UPDATE orders SET status= ? WHERE id = ?", [order, id], function (err, data) {
          if (err) reject(err);
          else resolve(data);
        });
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
        db.query("DELETE FROM orders WHERE id = ?", [orderId], function (err, data) {
          if (err) reject(err);
          else resolve(data);
        });
      });
    } catch (error) {
      console.error(`Lỗi khi xóa đơn hàng với ID ${orderId}:`, error);
      throw new Error("Không thể xóa đơn hàng.");
    }
  }


  // static async getOrderDetailsByOrderId(orderId) {
  //   try {
  //     return await new Promise((resolve, reject) => {
  //       const query = `
  //         SELECT 
  //           p.name AS product_name,
  //           p.id AS product_id,
  //           od.quantity,
  //           od.price,
  //           od.created_at,
  //           od.updated_at
  //         FROM order_details od
  //         JOIN products p ON od.product_id = p.id
  //         WHERE od.order_id = ?
  //       `;
  
  //       db.query(query, [orderId], (err, data) => {
  //         if (err) reject(err);
  //         else resolve(data);
  //       });
  //     });
  //   } catch (error) {
  //     console.error(`Lỗi khi lấy chi tiết đơn hàng với order_id ${orderId}:`, error);
  //     throw new Error("Không thể lấy chi tiết đơn hàng.");
  //   }
  // }
  
  
};




