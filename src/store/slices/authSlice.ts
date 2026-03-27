// store/slices/authSlice.ts
// Slice quản lý trạng thái xác thực người dùng (authentication)
// Một "slice" trong Redux Toolkit = 1 phần của store,
// bao gồm: state ban đầu + các action để thay đổi state

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Role } from '../../constants/roles';

// Định nghĩa kiểu dữ liệu của 1 User trong hệ thống
interface User {
    uid: string;           // ID duy nhất từ Firebase Auth
    email: string;         // Email đăng nhập
    displayName: string;   // Tên hiển thị
    role: Role;            // Phân quyền: customer | pt | admin
    phone: string;         // Số Zalo liên hệ
    avatarUrl: string;     // Link ảnh đại diện
}

// Định nghĩa kiểu dữ liệu của auth state trong store
interface AuthState {
    user: User | null;     // null = chưa đăng nhập
    loading: boolean;      // true = đang xử lý (đăng nhập, đăng ký...)
    error: string | null;  // null = không có lỗi
}

// Giá trị khởi tạo ban đầu khi app mới mở
const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // setUser: cập nhật thông tin user sau khi đăng nhập thành công
        // hoặc truyền null khi đăng xuất
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.loading = false;
            state.error = null;
        },

        // setLoading: bật/tắt trạng thái loading
        // dùng khi bắt đầu hoặc kết thúc một thao tác bất đồng bộ
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        // setError: lưu thông báo lỗi khi đăng nhập/đăng ký thất bại
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },

        // logout: xoá toàn bộ thông tin user, đưa về trạng thái ban đầu
        logout: (state) => {
            state.user = null;
            state.loading = false;
            state.error = null;
        },
    },
});

// Export các action để dùng trong component
export const { setUser, setLoading, setError, logout } = authSlice.actions;

// Export reducer để đăng ký vào store
export default authSlice.reducer;