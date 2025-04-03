import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api/carts"; // Đảm bảo backend đang chạy đúng địa chỉ

// Lấy giỏ hàng từ server
export const fetchCart = createAsyncThunk("cart/fetchCart", async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Lỗi khi lấy giỏ hàng");
  }
});

// Thêm sản phẩm vào giỏ hàng
export const addToCart = createAsyncThunk("cart/addToCart", async ({ productId, userId }, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_URL, { user_id: userId, product_id: productId });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Lỗi khi thêm sản phẩm vào giỏ hàng");
  }
});

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    if (!cartItemId || !quantity || quantity < 1) {
      return rejectWithValue("Lỗi: ID giỏ hàng không hợp lệ hoặc số lượng nhỏ hơn 1");
    }

    try {
      console.log("Gửi yêu cầu API cập nhật:", { cartItemId, quantity });
      const response = await axios.put(`${API_URL}/${cartItemId}`, { quantity });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Lỗi khi cập nhật số lượng");
    }
  }
);


// Xóa sản phẩm khỏi giỏ hàng
export const removeCartItem = createAsyncThunk("cart/removeCartItem", async (cartItemId, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/${cartItemId}`);
    return cartItemId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Lỗi khi xóa sản phẩm");
  }
});

// Xóa toàn bộ giỏ hàng
export const clearCart = createAsyncThunk("cart/clearCart", async (userId, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/clear/${userId}`);
    return userId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Lỗi khi xóa giỏ hàng");
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: { data: [] }, // Định dạng đúng để tránh lỗi
    loading: false,
    error: null,
    notification: null,
  },
  reducers: {
    clearNotification: (state) => {
      state.notification = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Lấy giỏ hàng
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Thêm sản phẩm vào giỏ hàng
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
    const existingItem = state.items.data.find((item) => item.id === action.payload.id);
    if (existingItem) {
        // Nếu sản phẩm đã có trong giỏ hàng, chỉ cập nhật số lượng
        existingItem.quantity += 1;
    } else {
        // Nếu chưa có, thêm mới vào giỏ hàng
        state.items.data.push({ ...action.payload, quantity: 1 });
    }
    state.loading = false;
    state.notification = { type: "success", message: "Sản phẩm đã được thêm vào giỏ hàng!" };
})

      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Cập nhật số lượng sản phẩm
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const item = state.items.data.find((i) => i.id === action.payload.id);
        if (item) {
          item.quantity = action.payload.quantity;
        }
        state.notification = { type: "success", message: "Cập nhật số lượng thành công!" };
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Xóa sản phẩm khỏi giỏ hàng
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items.data = state.items.data.filter((i) => i.id !== action.payload);
        state.notification = { type: "success", message: "Xóa sản phẩm thành công!" };
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.error = action.payload;
        state.notification = { type: "error", message: "Xóa sản phẩm thất bại!" };
      })

      // Xóa toàn bộ giỏ hàng
      .addCase(clearCart.fulfilled, (state) => {
        state.items.data = [];
        state.notification = { type: "success", message: "Đã xóa toàn bộ giỏ hàng!" };
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearNotification } = cartSlice.actions;
export default cartSlice.reducer;
