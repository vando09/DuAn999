import axios from "axios";
import { 
  loginFailed, 
  loginSuccess, 
  loginStart, 
  registerSuccess, 
  registerFailed, 
  registerStart, 
  logout
} from "./authSlide";
import { getUsersStart, getUsersSuccess } from "./userSlice";

// Login User
export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post('http://localhost:3000/api/users/login', user);

        // ✅ Lưu thông tin vào localStorage
        localStorage.setItem('authTokenUser', res.data.token);
        localStorage.setItem('authUser', JSON.stringify(res.data.user)); // Lưu cả user

        dispatch(loginSuccess(res.data.user));
        navigate('/');
    } catch (error) {
        dispatch(loginFailed());
        return error.response.data;
    }
}


// Register User
export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart()); 
    try {
        await axios.post('http://localhost:3000/api/users/register', user);
        dispatch(registerSuccess());
        navigate('/login');
    } catch (error) {
        dispatch(registerFailed());
        return error.response.data;
    }
}

export const getAllUsers = async (accessToken, dispatch) => {
    dispatch(getUsersStart());
    try {
        const res = await axios.get('http://localhost:3000/api/users', {headers: {
            token: `${accessToken}`
        }
    });
    dispatch(getUsersSuccess(res.data));
    } catch (error) {
        dispatch(registerFailed())    
    }
}

// Logout User
export const logoutUser = async (dispatch, navigate) => {
    dispatch(logout()); 
    localStorage.removeItem('authTokenUser');
    localStorage.removeItem('authUser');
   
    navigate('/login'); 
}