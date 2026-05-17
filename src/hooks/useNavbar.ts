// src/hooks/useNavbar.ts
//
// Thay đổi so với bản gốc:
//   - Thêm `user` vào return để Navbar lấy role → tính đúng profilePath

import { useState, useEffect, useCallback } from 'react';
import { useLocation }                       from 'react-router-dom';
import useAuth                               from './useAuth';

interface UseNavbarReturn {
    isDrawerOpen: boolean;
    isLoggedIn:   boolean;
    user:         ReturnType<typeof useAuth>['user'];  // ← thêm mới
    firstName:    string;
    toggleDrawer: () => void;
    closeDrawer:  () => void;
}

const useNavbar = (): UseNavbarReturn => {
    const { isLoggedIn, user } = useAuth();
    const location = useLocation();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Lấy tên cuối (vd: "Nguyễn Văn An" → "An")
    const firstName = user?.displayName?.split(' ').pop() ?? '';

    const closeDrawer  = useCallback(() => setIsDrawerOpen(false), []);
    const toggleDrawer = useCallback(() => setIsDrawerOpen((prev) => !prev), []);

    // Tự đóng khi đổi route
    useEffect(() => { closeDrawer(); }, [location.pathname, closeDrawer]);

    // Đóng khi nhấn Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer(); };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [closeDrawer]);

    // Khoá scroll body khi drawer mở
    useEffect(() => {
        document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isDrawerOpen]);

    return {
        isDrawerOpen,
        isLoggedIn,
        user,          // ← thêm mới
        firstName,
        toggleDrawer,
        closeDrawer,
    };
};

export default useNavbar;