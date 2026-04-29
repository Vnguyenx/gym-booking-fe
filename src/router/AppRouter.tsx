// AppRouter.tsx
// File này định nghĩa tất cả các đường dẫn (route) của ứng dụng
// Mỗi path tương ứng với 1 trang cụ thể

import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import useAuth from '../hooks/useAuth';

// --- Import các trang (sẽ tạo dần) ---
// Public pages (không cần đăng nhập)
import HomePage from '../pages/public/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import AboutDetailPage from '../pages/public/AboutDetail';
import EquipmentPage from "../pages/public/EquipmentPage";

// Import Dashboard Pages (Bạn tạo các file này trong thư mục tương ứng)
import AdminDashboard from '../pages/admin/AdminDashboard';
import PtDashboard from '../pages/pt/PtDashboard';
import ProfilePage from '../pages/customer/ProfilePage';
import EquipmentDetailPage from "../pages/public/EquipmentDetailPage";



const AppRouter = () => {
    const { isLoggedIn } = useAuth();
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes — ai cũng vào được */}
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.LOGIN} element={!isLoggedIn ? <LoginPage /> : <Navigate to="/" />} />
                <Route path={ROUTES.REGISTER} element={!isLoggedIn ? <RegisterPage /> : <Navigate to="/" />} />
                <Route path={ROUTES.RESET} element={<ForgotPasswordPage />} />
                <Route path={ROUTES.ABOUT_DETAIL} element={<AboutDetailPage />} />
                <Route path={ROUTES.EQUIPMENT} element={<EquipmentPage />} />
                <Route path={ROUTES.EQUIPMENT_DETAIL} element={<EquipmentDetailPage />} />

                {/* Dashboard routes */}
                <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
                <Route path={ROUTES.PT_DASHBOARD} element={<PtDashboard />} />
                <Route path={ROUTES.MY_PROFILE} element={<ProfilePage />} />


                {/* Fallback - Link lung tung sẽ về Home */}
                <Route path="*" element={<Navigate to="/" />} />

            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;