// AppRouter.tsx
// File này định nghĩa tất cả các đường dẫn (route) của ứng dụng
// Mỗi path tương ứng với 1 trang cụ thể

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

// --- Import các trang (sẽ tạo dần) ---
// Public pages (không cần đăng nhập)
import HomePage from '../pages/public/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes — ai cũng vào được */}
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;