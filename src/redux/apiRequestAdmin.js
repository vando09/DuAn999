import axios from "axios";
import { 
  loginFailed, 
  loginSuccess, 
  loginStart, 
  logout,

} from "./authSlideAdmin";

// Login Admin
export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("http://localhost:3000/api/users/login", user);

        console.log("API Response:", res.data); // Debug response

        // Kiểm tra quyền admin
        if (!res.data.user || res.data.user.role !== "admin") {
            dispatch(loginFailed());
            return { error: "Bạn không có quyền truy cập!" };
        }

        // ✅ Lưu thông tin admin vào localStorage (Định dạng JSON)
        localStorage.setItem("authAdmin", JSON.stringify(res.data.user));
        localStorage.setItem("authTokenAdmin", res.data.token);

        dispatch(loginSuccess(res.data.user));
        navigate("/admin");
    } catch (error) {
        console.error("Login error:", error.response ? error.response.data : error.message);
        dispatch(loginFailed());
        return error.response?.data || { error: "Đăng nhập thất bại!" };
    }
};


// export const registerAdmin = async (admin, dispatch, navigate) => {
//     dispatch(registerStart()); 
//     try {
//         await axios.post('http://localhost:3000/api/users/register', admin);
//         console.log("Dữ liệu gửi lên API:", admin);

//         dispatch(registerSuccess());
//         // navigate('/admin/login');
//     } catch (error) {
//         dispatch(registerFailed());
//         return error.response?.data || "Đã xảy ra lỗi khi đăng ký.";
        

//     }
// };

export const logoutUser = async (dispatch, navigate) => {
    dispatch(logout()); 
    localStorage.removeItem('authAdmin');
    localStorage.removeItem('authTokenAdmin');
   
    navigate('/admin/login'); 
}
