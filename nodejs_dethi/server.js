const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const port = 3000;

const app = express();
const paymentRouter = require("./routes/api");
app.set("view engine", "ejs");

// Set up static directory for serving images
app.use(express.static("uploads"));

// Middleware setup
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route để xử lý thất bại thanh toán
app.get("/payment-failure", (req, res) => {
  const errorMessage = req.query.error;
  res.status(400).send(`<h1>Thanh toán thất bại</h1><p>${errorMessage}</p>`);
});
// Trong tệp routes hoặc app.js của bạn
app.get("/payment-success", (req, res) => {
  const message = req.query.message; // Lấy thông báo thành công từ query string
  res.send(`
    <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thanh toán thành công</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
          }
          .container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 30px;
            width: 90%;
            max-width: 600px;
          }
          h1 {
            color: #4CAF50;
            font-size: 32px;
            margin-bottom: 20px;
          }
          p {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
          }
          .btn {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            font-size: 16px;
            margin-top: 20px;
            display: inline-block;
          }
          .btn:hover {
            background-color: #45a049;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${message}</h1>
          <p>Cảm ơn bạn đã thanh toán. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.</p>
          <a href="http://localhost:3001/" class="btn">Quay lại trang chủ</a>
        </div>
      </body>
    </html>
  `);
});



// Enable CORS for requests from the frontend (React)
app.use(cors({ origin: "http://localhost:3001", credentials: true }));

// Configure multer storage (for image uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit size to 2MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// Routes setup
const clientRoutes = require("./routes/client");
app.use(clientRoutes);

const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);

const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);
app.use(paymentRouter);

// Use multer for handling image uploads in the product creation API
app.post("/api/products", upload.single("image"), (req, res) => {
  try {
    const { name, price, discount, description, stock, category_id } = req.body;
    const image = req.file; // The uploaded image file

    // Validate product data
    if (
      !name ||
      !price ||
      !discount ||
      !description ||
      !stock ||
      !category_id
    ) {
      return res
        .status(400)
        .json({ error: "All fields are required, including category_id" });
    }

    if (!image) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Ở đây bạn có thể thêm logic để lưu dữ liệu vào database

    // Trả về thông tin sản phẩm với đường dẫn hình ảnh
    res.status(200).json({
      message: "Product added successfully!",
      product: {
        name,
        price,
        discount,
        description,
        stock,
        category_id,
        imageUrl: `/uploads/${image.filename}`, // Image URL for the frontend
      },
    });
  } catch (error) {
    console.error("Error while adding product:", error);
    res
      .status(500)
      .json({ error: "Something went wrong while adding the product" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
