import { createSlice } from "@reduxjs/toolkit";

// Kiểm tra dữ liệu từ localStorage trước khi parse JSON
const storedUser = localStorage.getItem("authAdmin");

const initialState = {
  login: {
    currentUser: storedUser ? (() => {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Error parsing authUser from localStorage:", error);
        localStorage.removeItem("authUser"); // Xóa dữ liệu bị lỗi
        return null;
      }
    })() : null,
    isFetching: false,
    error: false,
  },
  register: {
    isFetching: false,
    error: false,
    success: false,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.login.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentUser = action.payload || null;
      state.login.error = false;

      // Kiểm tra payload trước khi lưu vào localStorage
      if (action.payload) {
        try {
          // localStorage.setItem("authToken", action.payload.token);
          localStorage.setItem("authUser", JSON.stringify(action.payload));
        } catch (error) {
          console.error("Error saving auth data to localStorage:", error);
        }
      }
    },
    loginFailed: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
    },
    registerStart: (state) => {
      state.register.isFetching = true;
    },
    registerSuccess: (state) => {
      state.register.isFetching = false;
      state.register.success = true;
      state.register.error = false;
    },
    registerFailed: (state) => {
      state.register.isFetching = false;
      state.register.error = true;
      state.register.success = false;
    },
    logout: (state) => {
      state.login.currentUser = null;
      state.login.isFetching = false;
      state.login.error = false;

      // Xóa thông tin khỏi localStorage
      try {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
      } catch (error) {
        console.error("Error removing auth data from localStorage:", error);
      }
    },
    setCurrentUser: (state, action) => {
      state.login.currentUser = action.payload;
    },
  },
});

// Export các action creators
export const {
  loginStart,
  loginFailed,
  loginSuccess,
  registerStart,
  registerFailed,
  registerSuccess,
  logout,
  setCurrentUser,
} = authSlice.actions;

export default authSlice.reducer;
