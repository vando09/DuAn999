require("dotenv").config(); // Load biến môi trường từ file .enV
var mysql = require("mysql");
var db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});
db.connect(function (err) {
  if (err) throw err;
  console.log("Database is connected successfully !");
});
module.exports = db;


