var db = require("./database");

module.exports = class Product {
  constructor() {}

  // Lấy tất cả sản phẩm
  static async getAll() {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM products`;
      db.query(sql, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  // Thêm sản phẩm mới
  static async addProduct(product) {
    return new Promise((resolve, reject) => {
      db.query(`INSERT INTO products SET ?`, product, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  // Lấy sản phẩm theo ID
  static async getProductById(id) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM products WHERE id = ?", id, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data.length ? data[0] : null);
        }
      });
    });
  }

  // Cập nhật sản phẩm
  static async updateProduct(product, id) {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE products SET ? WHERE id = ?",
        [product, id],
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

  // Xóa sản phẩm
  static deleteProduct(productId) {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM products WHERE id = ?",
        [productId],
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



  // static hideProduct(productId) {
  //   return new Promise((resolve, reject) => {
  //     db.query(
  //       "UPDATE products SET is_hidden = 1 WHERE id = ?",
  //       [productId],
  //       function (err, data) {
  //         if (err) {
  //           reject(err);
  //         } else {
  //           resolve(data);
  //         }
  //       }
  //     );
  //   });
  // }

  
  
  static async getProductsByCategory(categoryId) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM products WHERE category_id = ?`;
      db.query(sql, [categoryId], function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data || []); // Trả về mảng rỗng nếu không có sản phẩm
        }
      });
    });
  }
  
  
};


