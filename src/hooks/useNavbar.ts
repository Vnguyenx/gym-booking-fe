import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import useAuth from './useAuth';

// ─────────────────────────────────────────────
// Kiểu dữ liệu trả về của hook
// ─────────────────────────────────────────────
interface UseNavbarReturn {
    // Trạng thái
    isDrawerOpen: boolean;
    isLoggedIn:   boolean;
    firstName:    string;

    // Hành động
    toggleDrawer: () => void;
    closeDrawer:  () => void;
}

/**
 * useNavbar
 *
 * Hook quản lý toàn bộ logic của Navbar:
 *   - Mở / đóng drawer mobile
 *   - Tự đóng drawer khi: đổi route, nhấn Escape
 *   - Khoá scroll body khi drawer đang mở
 *   - Lấy trạng thái đăng nhập và tên người dùng
 */
const useNavbar = (): UseNavbarReturn => {
    const { isLoggedIn, user } = useAuth();
    const location = useLocation();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Lấy tên cuối (vd: "Nguyễn Văn An" → "An"), phù hợp cách gọi tên tiếng Việt
    const firstName = user?.displayName?.split(' ').pop() ?? '';


    // ── Đóng drawer ──
    const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

    // ── Bật/tắt drawer ──
    const toggleDrawer = useCallback(() => setIsDrawerOpen(prev => !prev), []);


    // ── Tự đóng khi người dùng chuyển trang ──
    useEffect(() => {
        closeDrawer();
    }, [location.pathname, closeDrawer]);


    // ── Đóng khi nhấn phím Escape ──
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeDrawer();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [closeDrawer]);


    // ── Khoá scroll body khi drawer mở ──
    // (tránh nội dung phía sau bị cuộn khi người dùng vuốt trong drawer)
    useEffect(() => {
        document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
        // Cleanup: trả lại overflow khi component unmount
        return () => { document.body.style.overflow = ''; };
    }, [isDrawerOpen]);


    return {
        isDrawerOpen,
        isLoggedIn,
        firstName,
        toggleDrawer,
        closeDrawer,
    };
};

export default useNavbar;