const Product = require("../../models/product");

// Hiển thị danh sách sản phẩm
exports.listProductAPI = async (req, res, next) => {
  var products = await Product.getAll();
  console.log(products);

  res.status(200).json({
    data: products,
  });
};

// Thêm sản phẩm
exports.addProduct = async (req, res, next) => {
  let product = {
    name: req.body.name,
    price: req.body.price,
    discount: req.body.discount,
    description: req.body.description,
    stock: req.body.stock,
    category_id: req.body.category_id,
    image: req.body.image || null,  // Expecting image URL from the body instead of a file
    created_at: new Date(),
    updated_at: new Date(),
  };

  console.log(product);

  try {
    let result = await Product.addProduct(product);
    console.log(result);

    res.status(201).json({
      result: result,
      product: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Có lỗi xảy ra khi thêm sản phẩm.",
      error: error.message,
    });
  }
};


// Hiển thị chi tiết sản phẩm theo ID
exports.detailProduct = async (req, res, next) => {
  let id = req.params.id;
  let product = await Product.getProductById(id);
  console.log(product);
  res.status(200).json({
    data: product,
  });
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res, next) => {
  try {
    let id = req.params.id;
    let product = {
      name: req.body.name,
      price: req.body.price,
      discount: req.body.discount,
      description: req.body.description,
      stock: req.body.stock,
      category_id: req.body.category_id,
      image: req.body.image || null,
      updated_at: new Date(),
    };

    console.log("Sản phẩm cần cập nhật:", product);

    // Giả sử Product.updateProduct là phương thức để cập nhật sản phẩm trong cơ sở dữ liệu
    let result = await Product.updateProduct(product, id);

    // Nếu không tìm thấy sản phẩm hoặc không có thay đổi, trả về lỗi
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm hoặc không có thay đổi nào.",
      });
    }

    // Nếu cập nhật thành công
    res.status(200).json({
      message: "Cập nhật sản phẩm thành công!",
      product: product,
    });
  } catch (error) {
    // Xử lý lỗi trong quá trình cập nhật
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    res.status(500).json({
      message: "Đã xảy ra lỗi khi cập nhật sản phẩm.",
      error: error.message,
    });
  }
};


// Xóa sản phẩm
exports.deleteProduct = async (req, res, next) => {
  let id = req.params.id;

  let result = await Product.deleteProduct(id);

  console.log(result);
  res.status(201).json({
    result: result,
  });
};
// exports.hideProduct = async (req, res, next) => {
//   let id = req.params.id;

//   try {
//     let result = await Product.hideProduct(id);
//     res.status(200).json({
//       message: "Sản phẩm đã được ẩn thành công",
//       result: result,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Lỗi khi ẩn sản phẩm", error: err });
//   }
// };



