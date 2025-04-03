import { createSlice } from "@reduxjs/toolkit";

// Kiểm tra dữ liệu từ localStorage trước khi parse JSON
const storedAdminUser = localStorage.getItem("authAdminUser");

const initialState = {
  login: {
    currentAdmin: storedAdminUser ? (() => {
      try {
        return JSON.parse(storedAdminUser);
      } catch (error) {
        console.error("Error parsing authAdminUser from localStorage:", error);
        localStorage.removeItem("authAdminUser"); // Xóa dữ liệu bị lỗi
        return null;
      }
    })() : null,
    isFetching: false,
    error: false,
  },
};

const authAdminSlice = createSlice({
  name: "authAdmin",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.login.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentAdmin = action.payload || null;
      state.login.error = false;

      // ✅ Lưu thông tin đăng nhập admin vào localStorage
      if (action.payload) {
        try {
          localStorage.setItem("authAdminToken", action.payload.token);
          localStorage.setItem("authAdminUser", JSON.stringify(action.payload));
        } catch (error) {
          console.error("Error saving authAdmin data to localStorage:", error);
        }
      }
    },
    loginFailed: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
    },
    logout: (state) => {
      state.login.currentAdmin = null;
      state.login.isFetching = false;
      state.login.error = false;

      // ✅ Xóa thông tin đăng nhập admin khỏi localStorage
      try {
        localStorage.removeItem("authAdminToken");
        localStorage.removeItem("authAdminUser");
      } catch (error) {
        console.error("Error removing authAdmin data from localStorage:", error);
      }
    },
  },
});

// Export các action creators
export const {
  loginStart,
  loginFailed,
  loginSuccess,
  logout,
} = authAdminSlice.actions;

export default authAdminSlice.reducer;
