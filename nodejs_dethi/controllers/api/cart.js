const ShoppingCart = require("../../models/cart");

// Lấy giỏ hàng của người dùng
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    
    

    if (!userId) {
      return res.status(400).json({ message: "Thiếu userId." });
    }

    const cartItems = await ShoppingCart.getCartByUserId(userId);

    return res.status(200).json({
      message: cartItems.length ? "Lấy giỏ hàng thành công!" : "Giỏ hàng trống.",
      data: cartItems,
    });
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error);
    return res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  }
};

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;
    // if (!product_id) {
    //   return res.status(400).json({ message: "Thiếu product_id." });
    // }
    // if (!user_id) {
    //   return res.status(400).json({ message: "Thiếu user_id." });
    // }

    

    const result = await ShoppingCart.addToCart({ user_id, product_id });

    if (result.affectedRows > 0) {
      return res.status(201).json({ message: "Thêm vào giỏ hàng thành công!", result });
    } else {
      return res.status(400).json({ message: "Không thể thêm vào giỏ hàng." });
    }
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error);
    return res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  }
};


// Cập nhật số lượng sản phẩm trong giỏ hàng
exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!id || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ." });
    }

    const result = await ShoppingCart.updateCartItemQuantity(id, quantity);

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Cập nhật số lượng thành công!", id, quantity });
    } else {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng." });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật giỏ hàng:", error);
    return res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Thiếu ID sản phẩm." });
    }

    const result = await ShoppingCart.removeCartItem(id);

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Xóa sản phẩm khỏi giỏ hàng thành công!", id });
    } else {
      return res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng." });
    }
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
    return res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  }
};

// Xóa toàn bộ giỏ hàng của người dùng
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "Thiếu userId." });
    }

    const result = await ShoppingCart.clearCart(userId);

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Xóa toàn bộ giỏ hàng thành công!", userId });
    } else {
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng để xóa." });
    }
  } catch (error) {
    console.error("Lỗi khi xóa giỏ hàng:", error);
    return res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  }
};

// Lấy chi tiết một sản phẩm trong giỏ hàng theo ID
exports.detailCart = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Thiếu ID sản phẩm." });
    }

    const cartItem = await ShoppingCart.getCartItemById(id);

    if (cartItem) {
      return res.status(200).json({ message: "Lấy chi tiết sản phẩm thành công!", cartItem });
    } else {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng." });
    }
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  }
};
