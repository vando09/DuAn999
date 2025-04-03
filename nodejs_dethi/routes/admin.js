// routes/admin.js 
const express = require('express')

const homeController = require('../controllers/admin/home');
const router = express.Router();

// *** Home

// GET /admin/ (hiển thị trang chủ admin)
router.get('/', homeController.home);

// *** End Home




module.exports = router;