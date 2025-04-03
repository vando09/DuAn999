import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/apiRequestAdmin";
import { loginSuccess} from "../redux/authSlideAdmin";


const AdminHeader = () => {
  // const user = useSelector((state) => state.auth.login.currentAdmin);
  const user = JSON.parse(localStorage.getItem("authAdmin"));
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
      const savedUser = JSON.parse(localStorage.getItem("authAdmin"));
      const token = localStorage.getItem("authTokenAdmin");
      if (savedUser && token) {
        dispatch(loginSuccess(savedUser)); 
      }
    }, [dispatch]);
  
    const handleLogout = () => {
      logoutUser(dispatch, navigate); 
    };
  return (
   
    <header className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
      {/* Logo / Title */}
      <Link to="/admin/dashboard" className="navbar-brand fw-bold">
        Admin Dashboard
      </Link>

      {/* Right section */}
      <div className="ms-auto d-flex align-items-center">
        {/* Notification Icon */}
        {/* <button className="btn btn-light me-3">
          <i className="bi bi-bell"></i>
        </button> */}

        {/* User Dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-light dropdown-toggle d-flex align-items-center"
            id="userDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <FaUserCircle size={24} className="me-2" />
            <span>{user?.username}</span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <li>
              <Link className="dropdown-item" to="/admin/profile">
                Hồ sơ
              </Link>
            </li>
            <li>
              <button className="dropdown-item text-danger" onClick={handleLogout}>Đăng xuất</button>
            </li>
          </ul>
        </div>
      </div>
    </header>
    )
 
};

export default AdminHeader;
