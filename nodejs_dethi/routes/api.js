const express = require("express");
const productsAPIController = require("../controllers/api/product");
const ordersAPIController = require("../controllers/api/order");
const usersAPIController = require("../controllers/api/user");
const categoriesAPIController = require("../controllers/api/category");
const cartsAPIController = require("../controllers/api/cart");
const postController = require("../controllers/api/post");


const router = express.Router();

// Routes cho bills
router.get("/orders", ordersAPIController.listOrdersAPI);
router.get("/orders/:userId", ordersAPIController.listOrder);
router.post("/orders", ordersAPIController.addOrder);
// router.get("/orders/:id", ordersAPIController.detailOrder);
router.get('/order-details/:order_id', ordersAPIController.listOrderDetailsAPI);
router.put("/orders/:id", ordersAPIController.updateOrder);
router.delete("/orders/:id", ordersAPIController.deleteOrder);

router.get("/vnpay_return", async (req, res) => {
    try {
      // Các tham số trả về từ VNPay
      const vnp_Params = req.query;
      // Giả sử bạn gửi kèm dữ liệu đơn hàng tạm (orderData) và sản phẩm (products) qua query string
      const orderData = JSON.parse(req.query.orderData || "{}");
      const products = JSON.parse(req.query.products || "[]");
  
      const result = await ordersAPIController.handleVnpayCallback(vnp_Params, orderData, products);
      res.redirect(`/payment-success?message=${encodeURIComponent(result.message)}`);
    } catch (error) {
      res.redirect(`/payment-failure?error=${encodeURIComponent(error.message)}`);
    }
  });



// router.get("/orders/:order_id/details", ordersAPIController.listOrderDetailsAPI);


router.get("/products", productsAPIController.listProductAPI); // Lấy danh sách sản phẩm
router.post("/products", productsAPIController.addProduct); // Thêm sản phẩm
router.get("/products/:id", productsAPIController.detailProduct); // Lấy chi tiết sản phẩm
router.put("/products/:id", productsAPIController.updateProduct); // Cập nhật sản phẩm
router.delete("/products/:id", productsAPIController.deleteProduct); // Xóa sản phẩm
// router.put("/products/:id/hide", productsAPIController.hideProduct);



router.get("/categories", categoriesAPIController.listCategoryAPI); // Lấy danh sách sản phẩm
router.post("/categories", categoriesAPIController.addCategory); // Thêm sản phẩm
router.get("/categories/:id", categoriesAPIController.detailCategory); // Lấy chi tiết sản phẩm
router.put("/categories/:id", categoriesAPIController.updateCategory); // Cập nhật sản phẩm
router.delete("/categories/:id", categoriesAPIController.deleteCategory); // Xóa sản phẩm

// Routes cho carts
router.get("/carts/:userId", cartsAPIController.getCart); // Lấy danh sách giỏ hàng
router.post("/carts", cartsAPIController.addToCart); // Thêm sản phẩm vào giỏ hàng
router.get("/carts/:id", cartsAPIController.detailCart); // Lấy chi tiết giỏ hàng theo ID
router.put("/carts/:id", cartsAPIController.updateCartItem); // Cập nhật số lượng sản phẩm trong giỏ hàng
router.delete("/carts/:id", cartsAPIController.removeFromCart); // Xóa sản phẩm khỏi giỏ hàng
router.delete("/carts/user/:userId", cartsAPIController.clearCart); // Xóa toàn bộ giỏ hàng của user


router.get("/posts", postController.listPostAPI);
router.post("/posts", postController.addPost);
router.get("/posts/:id", postController.detailPost); //chi tiết
router.put("/posts/:id", postController.updatePost);
router.delete("/posts/:id", postController.deletePost);



// Routes cho users
router.get("/users", usersAPIController.listUsers);
router.post("/users/register", usersAPIController.registerUser); // Đăng ký
router.post("/users/login", usersAPIController.loginUser); // Đăng nhập

module.exports = router;
