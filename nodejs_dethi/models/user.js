const db = require("./database");

module.exports = class User {
  // Lấy tất cả người dùng
  static async getAll() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users", (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  // Lấy user theo email
  static async getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data.length > 0 ? data[0] : null); // Trả về user đầu tiên hoặc null nếu không có
      }
    });
  });
}

  // Lấy user theo ID
  static async getUserById(id) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE id = ?", [id], (err, data) => {
        if (err) reject(err);
        else resolve(data[0] || null);
      });
    });
  }

  // Thêm người dùng (đăng ký)
  static async addUser(user) {
    return new Promise((resolve, reject) => {
      db.query("INSERT INTO users SET ?", user, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  // Cập nhật thông tin user
  static async updateUser(id, user) {
    return new Promise((resolve, reject) => {
      db.query("UPDATE users SET ? WHERE id = ?", [user, id], (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  // Xóa user
  static async deleteUser(id) {
    return new Promise((resolve, reject) => {
      db.query("DELETE FROM users WHERE id = ?", [id], (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }
};
