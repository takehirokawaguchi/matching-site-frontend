import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice';
import productReducer from '../features/product/productSlice';
import chatReducer from '../features/chat/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    chat: chatReducer
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
