import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api/orders"; // API lấy danh sách đơn hàng

// Action lấy danh sách đơn hàng theo user_id
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Lỗi khi lấy đơn hàng");
    }
  }
);





const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    items: [], // ✅ Đảm bảo items là mảng
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ordersSlice.reducer;
