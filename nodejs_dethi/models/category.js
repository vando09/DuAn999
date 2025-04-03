var db = require("./database");

module.exports = class Category {
  constructor() {}

  // Lấy tất cả danh mục
  static async getAll() {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM categories`;
      db.query(sql, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  // Thêm danh mục mới
  static async addCategory(category) {
    return new Promise((resolve, reject) => {
      db.query(`INSERT INTO categories SET ?`, category, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  // Lấy danh mục theo ID
  static async getCategoryById(id) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM categories WHERE id = ?", id, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data.length ? data[0] : null);
        }
      });
    });
  }

  // Cập nhật danh mục
  static async updateCategory(category, id) {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE categories SET ? WHERE id = ?",
        [category, id],
        function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        }
      );
    });
  }

  // Xóa danh mục
  static deleteCategory(categoryId) {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM categories WHERE id = ?",
        [categoryId],
        function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        }
      );
    });
  }
};
