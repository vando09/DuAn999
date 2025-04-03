import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user", // ✅ Thêm name
  initialState: {
    users: {
      allUsers: null,
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    getUsersStart: (state) => {
      state.users.isFetching = true;
    },
    getUsersSuccess: (state, action) => {
      state.users.isFetching = false;
      state.users.allUsers = action.payload;
      state.users.error = false; // ✅ Đặt lại error thành false khi fetch thành công
    },
    getUsersFailed: (state) => { // ✅ Sửa lỗi chính tả
      state.users.isFetching = false;
      state.users.error = true;
    },
  },
});

export const { getUsersStart, getUsersSuccess, getUsersFailed } = userSlice.actions;

export default userSlice.reducer;
