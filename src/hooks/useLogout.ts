import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { authService } from '../services/authService';
import { ROUTES } from '../constants/routes';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UseLogoutReturn {
    isLoggingOut: boolean;
    handleLogout: () => Promise<void>;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * useLogout
 * Xử lý toàn bộ flow đăng xuất:
 * 1. Đăng xuất Firebase client
 * 2. Xoá session cookie trên BE
 * 3. Xoá Redux store + localStorage
 * 4. Điều hướng về trang chủ
 */
const useLogout = (): UseLogoutReturn => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            // Bước 1: Đăng xuất Firebase client SDK
            await signOut(auth);

            // Bước 2: Gọi BE xoá session cookie
            // Nếu BE đang tắt (dev mode) thì bỏ qua lỗi, vẫn logout bình thường
            await authService.logout().catch(() => {});

            // Bước 3: Xoá data trong Redux + localStorage
            dispatch(logout());

            navigate(ROUTES.HOME);
        } catch (error) {
            console.error('Lỗi đăng xuất:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return { isLoggingOut, handleLogout };
};

export default useLogout;