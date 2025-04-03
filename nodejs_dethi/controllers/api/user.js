const User = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Lấy danh sách users
exports.listUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Đăng ký user
exports.registerUser = async (req, res) => {
  try {
    const { username, password, email, phone, role } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin." });
    }

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email đã tồn tại!" });
    }

    // Kiểm tra nếu đã có admin trong hệ thống
    if (role === "admin") {
      const adminExists = await User.getAdminCount();
      if (adminExists > 0) {
        return res.status(403).json({ error: "Chỉ có thể có một tài khoản admin trong hệ thống." });
      }
    }

    // Mã hóa mật khẩu trước khi lưu vào DB
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword, email, phone, role: role || "user" };

    const result = await User.addUser(newUser);
    res.status(201).json({ message: "Đăng ký thành công!", userId: result.insertId });
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    res.status(500).json({ error: "Lỗi máy chủ!" });
  }
};



// Đăng nhập user
exports.loginUser = async (req, res) => {
  try {
    console.log("📩 Headers:", req.headers);
    console.log("📩 Dữ liệu đầu vào:", req.body); // Kiểm tra dữ liệu nhận được

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Vui lòng nhập email và mật khẩu." });
    }

    const user = await User.getUserByEmail(email);
    console.log("🔍 Tìm thấy user:", user);

    if (!user) {
      return res.status(401).json({ error: "Email không tồn tại!" });
    }

    // Compare the password provided with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Mật khẩu không đúng!" });
    }

    // Generate JWT token if email and password match
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, "SECRET_KEY", {
      expiresIn: "1d",
    });

    res.status(200).json({ message: "Đăng nhập thành công!", token, user });
  } catch (error) {
    console.error("❌ Lỗi khi đăng nhập:", error);
    res.status(500).json({ error: "Lỗi máy chủ!" });
  }
};

// exports.loginUser = async (req, res) => {
//   try {
//     console.log("📩 Headers:", req.headers);
//     console.log("📩 Dữ liệu đầu vào:", req.body);

//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ error: "Vui lòng nhập email và mật khẩu." });
//     }

//     const user = await User.getUserByEmail(email);
//     console.log("🔍 Tìm thấy user:", user);

//     if (!user) {
//       return res.status(401).json({ error: "Email không tồn tại!" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: "Mật khẩu không đúng!" });
//     }

//     // **Chỉ cho phép admin đăng nhập**
//     if (user.role !== "admin") {
//       return res.status(403).json({ error: "Bạn không có quyền truy cập!" });
//     }

//     // Tạo JWT token
//     const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, "SECRET_KEY", {
//       expiresIn: "1d",
//     });

//     res.status(200).json({ message: "Đăng nhập thành công!", token, user });
//   } catch (error) {
//     console.error("❌ Lỗi khi đăng nhập:", error);
//     res.status(500).json({ error: "Lỗi máy chủ!" });
//   }
// };


