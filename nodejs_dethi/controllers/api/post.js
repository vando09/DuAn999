const Post = require("../../models/post");

// Hiển thị danh sách bài viết
exports.listPostAPI = async (req, res, next) => {
  try {
    var posts = await Post.getAll();
    res.status(200).json({ data: posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách bài viết.", error: error.message });
  }
};

// Thêm bài viết
exports.addPost = async (req, res, next) => {
  let post = {
    user_id: req.body.user_id,
    title: req.body.title,
    content: req.body.content,
    image: req.body.image || null, // URL ảnh hoặc null
    created_at: new Date(),
    updated_at: new Date(),
  };

  try {
    let result = await Post.addPost(post);
    res.status(201).json({ result: result, post: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Có lỗi xảy ra khi thêm bài viết.", error: error.message });
  }
};

// Hiển thị chi tiết bài viết theo ID
exports.detailPost = async (req, res, next) => {
  let id = req.params.id;
  try {
    let result = await Post.getPostById(id);
    res.status(200).json({ data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy chi tiết bài viết.", error: error.message });
  }
};

// Cập nhật bài viết
exports.updatePost = async (req, res, next) => {
  try {
    let id = req.params.id;
    let post = {
      user_id: req.body.user_id,
      title: req.body.title,
      content: req.body.content,
      image: req.body.image || null,
      updated_at: new Date(),
    };

    let result = await Post.updatePost(post, id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy bài viết hoặc không có thay đổi nào." });
    }

    res.status(200).json({ message: "Cập nhật bài viết thành công!", post: post });
  } catch (error) {
    console.error("Lỗi khi cập nhật bài viết:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi cập nhật bài viết.", error: error.message });
  }
};

// Xóa bài viết
exports.deletePost = async (req, res, next) => {
  let id = req.params.id;
  try {
    let result = await Post.deletePost(id);
    res.status(200).json({ result: result, message: "Xóa bài viết thành công!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi xóa bài viết.", error: error.message });
  }
};
