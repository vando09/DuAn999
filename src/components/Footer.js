import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPaperPlane,
  FaEnvelope,
  FaHeart,
} from "react-icons/fa";

const Footer = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Đã gửi biểu mẫu nhận bản tin");
  };

  return (
    <footer className="footer spad">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div className="footer__about">
              <div className="footer__about__logo">
               
              </div>
              <ul>
                <li>Địa chỉ: Cần Thơ</li>
                <li>Điện thoại: +65 11.188.888</li>
                <li>Email: vandmpc05835@fpt.edu.vn</li>
              </ul>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-6 offset-lg-1">
            <div className="footer__widget">
              <h6>Liên kết hữu ích</h6>
              <div className="d-flex">
                <ul>
                  <li><a href="#">Về chúng tôi</a></li>
                  <li><a href="#">Giới thiệu cửa hàng</a></li>
                  <li><a href="#">Mua sắm an toàn</a></li>
                  <li><a href="#">Thông tin giao hàng</a></li>
                  <li><a href="#">Chính sách bảo mật</a></li>
                  <li><a href="#">Sơ đồ trang web</a></li>
                </ul>
                <ul>
                  <li><a href="#">Chúng tôi là ai?</a></li>
                  <li><a href="#">Dịch vụ của chúng tôi</a></li>
                  <li><a href="#">Dự án</a></li>
                  <li><a href="#">Liên hệ</a></li>
                  <li><a href="#">Sáng tạo</a></li>
                  <li><a href="#">Phản hồi</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-12">
            <div className="footer__widget">
              <h6>Đăng ký nhận tin tức</h6>
              <p>Nhận email cập nhật về cửa hàng và các ưu đãi đặc biệt của chúng tôi.</p>
              <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nhập email của bạn" />
                <button type="submit" className="site-btn">
                  Đăng ký <FaPaperPlane />
                </button>
              </form>
              <div className="footer__widget__social">
                <a href="#"><FaFacebookF /></a>
                <a href="#"><FaInstagram /></a>
                <a href="#"><FaTwitter /></a>
                <a href="#"><FaLinkedin /></a>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="footer__copyright">
              <div className="footer__copyright__text">
                <p>
                  Bản quyền &copy; {new Date().getFullYear()} | Mẫu này được thiết kế với <FaHeart /> bởi
                  <a href="https://colorlib.com" target="_blank" rel="noopener noreferrer">
                    Colorlib
                  </a>
                </p>
              </div>
              <div className="footer__copyright__payment">
                <img src="/img/payment-item.png" alt="Phương thức thanh toán" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
