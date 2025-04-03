import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/apiRequest";
import { loginSuccess } from "../redux/authSlide";
import {
  FiUser,
  FiShoppingCart,
  FiHeart,
  FiLogOut,
  FiMail,
  FiMenu,
} from "react-icons/fi";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

const Header = () => {
  // const user = useSelector((state) => state.auth.login.currentUser);
  const user = JSON.parse(localStorage.getItem("authUser") || "null")
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Lấy user từ localStorage khi tải trang
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("authUser") || "null");
    if (savedUser) {
      dispatch(loginSuccess(savedUser));
    }
  }, [dispatch]);

  // Xử lý đăng xuất
  const handleLogout = () => {
    logoutUser(dispatch, navigate);
  };

  return (
    <>
      {/* Preloader */}
      <div id="preloader"></div>

      {/* Mobile Menu */}
      <div className="humberger__menu__overlay"></div>
      <div className="humberger__menu__wrapper">
        <div className="humberger__menu__logo">
          <Link to="/">
            <h4>DongHo</h4>
          </Link>
        </div>
        <div className="humberger__menu__cart">
          <ul>
            <li>
              <Link to="#">
                <FiHeart /> <span>1</span>
              </Link>
            </li>
            <li>
              <Link to="#">
                <FiShoppingCart /> <span>3</span>
              </Link>
            </li>
          </ul>
          <div className="header__cart__price">
            Items: <span>$150.00</span>
          </div>
        </div>
        <div className="humberger__menu__widget">
          <div className="header__top__right__auth">
            {user ? (
              <button onClick={handleLogout} className="btn btn-outline-danger">
                <FiLogOut /> Đăng xuất
              </button>
            ) : (
              <Link to="/login">
                <FiUser /> Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="header__top">
          <div className="container">
            <div className="row">
              {/* Hiển thị tên user & đăng xuất */}
              <Navbar expand="lg">
                <div className="col-lg-6 col-md-6">
                  <div className="header__top__left">
                    <ul>
                      {" "}
                      <li>
                        <FiMail /> Vandmpc05835@fpt.edu.vn
                      </li>
                      <li>Miễn phí giao hàng cho đơn hàng 99k</li>
                    </ul>
                  </div>
                </div>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="ms-auto">
                    {user ? (
                      <NavDropdown
                        title={
                          <>
                            <FiUser size={20} className="me-2" /> Xin chào,{" "}
                            {user?.username}
                          </>
                        }
                        id="user-nav-dropdown"
                        className="user-dropdown"
                        align="end" // Canh phải dropdown
                      >
                        <NavDropdown.Divider />
                        <NavDropdown.Item
                          onClick={handleLogout}
                          className="logout-btn"
                        >
                          <FiLogOut size={16} className="me-1" /> Đăng xuất
                        </NavDropdown.Item>
                      </NavDropdown>
                    ) : (
                      <Nav.Link as={Link} to="/login">
                        <FiUser size={20} color="white" /> Đăng nhập
                      </Nav.Link>
                    )}
                    <Nav.Link as={Link} to={`/cart/${user?.id || "guest"}`}>
                      <FiShoppingCart size={20} color="white" />
                    </Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <div className="header__logo">
                <Link to="/">
                  <h4
                    style={{
                      fontWeight: "bold",
                      fontSize: "24px",
                      color: "#000",
                    }}
                  >
                    DongHo
                  </h4>
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <nav className="header__menu">
                <ul>
                  <li className="active">
                    <Link to="/">Trang chủ</Link>
                  </li>
                  <li>
                    <Link to="/shop">Của hàng</Link>
                  </li>
                  {/* <li>
                    <Link to="#">Pages</Link>
                    <ul className="header__menu__dropdown">
                      <li>
                        <Link to="/shop-details">Shop Details</Link>
                      </li>
                      <li>
                        <Link to="/cart">Shopping Cart</Link>
                      </li>
                      <li>
                        <Link to="/checkout">Checkout</Link>
                      </li>
                      <li>
                        <Link to="/blog-details">Blog Details</Link>
                      </li>
                    </ul>
                  </li> */}
                  <li>
                    <Link to="/blog">Blog</Link>
                  </li>
                  <li>
                    <Link to="/contact">Liên lệ</Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="col-lg-3">
              <div className="header__cart">
                <ul>
                  <li>
                    <Link to={`/history/${user?.id}`}>
                      <FiHeart />
                    </Link>
                  </li>
                  <li>
                    <Link to={`/cart/${user?.id}`}>
                      <FiShoppingCart />
                    </Link>
                  </li>
                </ul>
                <div className="header__cart__price">
                  Items: <span>$150.00</span>
                </div>
              </div>
            </div>
          </div>
          <div className="humberger__open">
            <FiMenu />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
