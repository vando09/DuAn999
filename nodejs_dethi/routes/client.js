// routes/client.js 
const express = require('express')

const homeController = require('../controllers/client/home');
const router = express.Router();

// *** Home

// GET / (hiển thị trang chủ client)
router.get('/', homeController.home);

// *** End Home





module.exports = router;