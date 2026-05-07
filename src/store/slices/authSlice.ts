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

// Key dùng để lưu vào localStorage
const STORAGE_KEY = 'auth_user';

/**
 * Đọc user từ localStorage khi app mới mở
 * Mục đích: giữ trạng thái đăng nhập khi F5, không cần gọi BE
 * Dùng try/catch để tránh lỗi nếu dữ liệu bị hỏng
 */
const loadUserFromStorage = (): User | null => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
};

// Giá trị khởi tạo — đọc từ localStorage nếu có
const initialState: AuthState = {
    user: loadUserFromStorage(), // ← thay vì null cứng
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // setUser: cập nhật thông tin user sau khi đăng nhập thành công
        // Đồng thời lưu vào localStorage để giữ session khi F5
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.loading = false;
            state.error = null;

            // Lưu vào localStorage để FE không cần BE khi dev
            if (action.payload) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload));
            }
        },

        // setLoading: bật/tắt trạng thái loading
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        // setError: lưu thông báo lỗi khi đăng nhập/đăng ký thất bại
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },

        // logout: xoá toàn bộ thông tin user, đưa về trạng thái ban đầu
        // Đồng thời xoá localStorage
        logout: (state) => {
            state.user = null;
            state.loading = false;
            state.error = null;

            // Xoá khỏi localStorage khi đăng xuất
            localStorage.removeItem(STORAGE_KEY);
        },
    },
});

// Export các action để dùng trong component
export const { setUser, setLoading, setError, logout } = authSlice.actions;

// Export reducer để đăng ký vào store
export default authSlice.reducer;