import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlide"; 
import cartReducer from "./cartSlice"
import ordersReducer from "./ordersSlice";
// import productReducer from "./productSlide"
// import userReducer from "./authSlide";

const store = configureStore({
  reducer: {
    auth: authReducer,
    
    // users: userReducer
    cart: cartReducer,
    // product: productReducer,
    orders: ordersReducer,


  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(), 
});

export default store;
