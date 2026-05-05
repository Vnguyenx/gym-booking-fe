// store/index.ts
// File cấu hình trung tâm của Redux
// Redux store giống như một "kho dữ liệu toàn cục" —
// mọi component đều có thể đọc và cập nhật dữ liệu từ đây

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import membershipReducer from './membershipSlice';

export const store = configureStore({
    reducer: {
        // auth: quản lý trạng thái đăng nhập (user hiện tại, loading, lỗi)
        auth: authReducer,
        memberships: membershipReducer,
    },
});

// RootState: kiểu dữ liệu của toàn bộ store
// Dùng khi đọc dữ liệu từ store bằng useAppSelector
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch: kiểu dữ liệu của hàm dispatch
// Dùng khi gửi action để thay đổi state bằng useAppDispatch
export type AppDispatch = typeof store.dispatch;