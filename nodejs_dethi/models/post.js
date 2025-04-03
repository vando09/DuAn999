var db = require("./database");

module.exports = class Post {
  constructor() {}

  // Lấy tất cả bài viết
  static async getAll() {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM posts`;
      db.query(sql, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  // Thêm bài viết mới
  static async addPost(post) {
    return new Promise((resolve, reject) => {
      db.query(`INSERT INTO posts SET ?`, post, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  // Lấy bài viết theo ID
  static async getPostById(id) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM posts WHERE id = ?", id, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  // Cập nhật bài viết
  static async updatePost(post, id) {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE posts SET ? WHERE id = ?",
        [post, id],
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

  // Xóa bài viết
  static deletePost(postId) {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM posts WHERE id = ?",
        [postId],
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
