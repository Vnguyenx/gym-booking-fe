// store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Role } from '../constants/roles';

interface User {
    uid: string;
    email: string;
    displayName: string;
    role: Role;
    phone: string;
    avatarUrl: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const STORAGE_KEY = 'auth_user';

const loadUserFromStorage = (): User | null => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
};

const initialState: AuthState = {
    user: loadUserFromStorage(),
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

            localStorage.removeItem(STORAGE_KEY);
        },

        // updateUserInStore: cập nhật một phần thông tin user (displayName, phone, avatarUrl...)
        // Dùng sau khi gọi API chỉnh sửa profile thành công
        // Đồng thời sync lại localStorage để F5 không mất dữ liệu mới
        updateUserInStore: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state.user));
            }
        },
    },
});

// Export các action để dùng trong component
export const { setUser, setLoading, setError, logout, updateUserInStore } = authSlice.actions;

// Export reducer để đăng ký vào store
export default authSlice.reducer;