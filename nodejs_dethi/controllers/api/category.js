const Category = require("../../models/category");
const Product = require("../../models/product");

// Hiển thị danh sách danh mục
exports.listCategoryAPI = async (req, res, next) => {
  try {
    const categories = await Category.getAll();
    res.status(200).json({
      data: categories,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục:", error);
    res.status(500).json({
      message: "Đã xảy ra lỗi khi lấy danh sách danh mục.",
      error: error.message,
    });
  }
};

// Thêm danh mục
// exports.addCategory = async (req, res, next) => {
//   try {
//     const category = {
//       name: req.body.name,
//       slug: req.body.slug,
//       created_at: new Date(),
//       updated_at: new Date(),
//     };

//     const result = await Category.addCategory(category);
//     res.status(201).json({
//       message: "Thêm danh mục thành công!",
//       result: result,
//       category: category,
//     });
//   } catch (error) {
//     console.error("Lỗi khi thêm danh mục:", error);
//     res.status(500).json({
//       message: "Đã xảy ra lỗi khi thêm danh mục.",
//       error: error.message,
//     });
//   }
// };

exports.addCategory = async (req, res, next) => {
    try {
      const category = {
        name: req.body.name,
        slug: req.body.slug,
        created_at: new Date(),
        updated_at: new Date(),
      };
  
      const result = await Category.addCategory(category);
      res.status(201).json({
        message: "Thêm danh mục thành công!",
        category: category,
      });
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
  
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          message: "Tên danh mục hoặc slug đã tồn tại. Vui lòng chọn tên khác.",
        });
      }
  
      res.status(500).json({
        message: "Đã xảy ra lỗi khi thêm danh mục.",
        error: error.message,
      });
    }
  };
  

  

// Hiển thị chi tiết danh mục theo ID
exports.detailCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await Category.getCategoryById(id);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục." });
    }
    res.status(200).json({
      data: category,
    });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết danh mục:", error);
    res.status(500).json({
      message: "Đã xảy ra lỗi khi lấy chi tiết danh mục.",
      error: error.message,
    });
  }
};

// Cập nhật danh mục
// exports.updateCategory = async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     const category = {
//       name: req.body.name,
//       slug: req.body.slug,
//       updated_at: new Date(),
//     };

//     const result = await Category.updateCategory(category, id);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({
//         message: "Không tìm thấy danh mục hoặc không có thay đổi nào.",
//       });
//     }

//     res.status(200).json({
//       message: "Cập nhật danh mục thành công!",
//       category: category,
//     });
//   } catch (error) {
//     console.error("Lỗi khi cập nhật danh mục:", error);
//     res.status(500).json({
//       message: "Đã xảy ra lỗi khi cập nhật danh mục.",
//       error: error.message,
//     });
//   }
// };
exports.updateCategory = async (req, res, next) => {
    try {
      const id = req.params.id;
      const category = {
        name: req.body.name,
        slug: req.body.slug,
        updated_at: new Date(),
      };
  
      const result = await Category.updateCategory(category, id);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Không tìm thấy danh mục hoặc không có thay đổi nào.",
        });
      }
  
      res.status(200).json({
        message: "Cập nhật danh mục thành công!",
        category: category,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
  
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          message: "Tên danh mục hoặc slug đã tồn tại. Vui lòng chọn tên khác.",
        });
      }
  
      res.status(500).json({
        message: "Đã xảy ra lỗi khi cập nhật danh mục.",
        error: error.message,
      });
    }
  };
  

// Xóa danh mục
exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("ID danh mục cần xóa:", id);

    // Kiểm tra nếu ID không hợp lệ
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "ID danh mục không hợp lệ." });
    }

    // 1️⃣ Kiểm tra xem có sản phẩm nào thuộc danh mục này không
    const products = await Product.getProductsByCategory(id) || [];
    console.log("Danh sách sản phẩm liên quan:", products);

    if (products.length > 0) {
      return res.status(400).json({
        message: "Không thể xóa danh mục vì có sản phẩm liên quan.",
      });
    }

    // 2️⃣ Tiến hành xóa danh mục
    const result = await Category.deleteCategory(id);
    console.log("Kết quả xóa danh mục:", result);

    if (!result || result.affectedRows === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục để xóa.",
      });
    }

    res.status(200).json({
      message: "Xóa danh mục thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error.message);
    res.status(500).json({
      message: "Đã xảy ra lỗi khi xóa danh mục.",
      error: error.message,
    });
  }
};


