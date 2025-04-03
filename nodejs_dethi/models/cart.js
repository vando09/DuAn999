const db = require("./database");
const util = require("util");

// Chuyển đổi db.query thành phiên bản hỗ trợ async/await
const query = util.promisify(db.query).bind(db);

module.exports = class ShoppingCart {
  // Lấy giỏ hàng theo user ID
  static async getCartByUserId(userId) {
    try {
      if (!userId) throw new Error("Thiếu userId.");
  
      const sql = `
        SELECT sc.*, p.name, p.price, p.image, p.description
        FROM shopping_cart AS sc
        JOIN products AS p ON sc.product_id = p.id
        WHERE sc.user_id = ?
      `;
  
      return await query(sql, [userId]); // Tránh SQL Injection
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
      throw new Error("Không thể lấy giỏ hàng.");
    }
  }
  

  // Thêm sản phẩm vào giỏ hàng
  static async addToCart({ user_id, product_id }) {
    try {
      if (!user_id || !product_id) {
        throw new Error("Dữ liệu không hợp lệ.");
      }
  
      // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
      const checkSql = "SELECT quantity FROM shopping_cart WHERE user_id = ? AND product_id = ?";
      const existingItem = await query(checkSql, [user_id, product_id]);
  
      if (existingItem.length > 0) {
        // Nếu đã tồn tại, tăng số lượng lên 1
        const updateSql = "UPDATE shopping_cart SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?";
        return await query(updateSql, [user_id, product_id]);
      } else {
        // Nếu chưa có, thêm sản phẩm mới vào giỏ hàng
        const insertSql = "INSERT INTO shopping_cart (user_id, product_id, quantity, created_at) VALUES (?, ?, 1, NOW())";
        return await query(insertSql, [user_id, product_id]);
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      throw new Error("Không thể thêm sản phẩm vào giỏ hàng.");
    }
  }
  

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  static async updateCartItemQuantity(cartItemId, quantity) {
    try {
      if (!cartItemId || quantity < 1) throw new Error("Dữ liệu không hợp lệ.");

      const sql = "UPDATE shopping_cart SET quantity = ? WHERE id = ?";
      return await query(sql, [quantity, cartItemId]);
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng:", error);
      throw new Error("Không thể cập nhật giỏ hàng.");
    }
  }

  // Xóa sản phẩm khỏi giỏ hàng
  static async removeCartItem(cartItemId) {
    try {
      if (!cartItemId) throw new Error("Thiếu ID sản phẩm.");

      const sql = "DELETE FROM shopping_cart WHERE id = ?";
      return await query(sql, [cartItemId]);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
      throw new Error("Không thể xóa sản phẩm khỏi giỏ hàng.");
    }
  }

  // Xóa toàn bộ giỏ hàng của một user
  static async clearCart(userId) {
    try {
      if (!userId) throw new Error("Thiếu userId.");

      const sql = "DELETE FROM shopping_cart WHERE user_id = ?";
      return await query(sql, [userId]);
    } catch (error) {
      console.error("Lỗi khi xóa giỏ hàng:", error);
      throw new Error("Không thể xóa giỏ hàng.");
    }
  }


};
