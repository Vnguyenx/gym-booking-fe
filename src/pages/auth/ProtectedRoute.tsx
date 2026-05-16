// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

interface Props {
    children: React.JSX.Element;
    allowedRoles?: string[]; // Danh sách các role được phép (ví dụ: ['admin', 'pt'])
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
    const { user, isLoggedIn, loading } = useAuth();
    const location = useLocation();

    // 1. Đang tải dữ liệu user (ví dụ check token) thì hiện loading
    if (loading) {
        return <div className="loading-screen">Đang xác thực...</div>;
    }

    // 2. Nếu chưa đăng nhập -> đá ra trang login
    // Lưu lại cái link định vào (location) để sau khi login xong quay lại đúng trang đó
    if (!isLoggedIn) {
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    // 3. Nếu đã đăng nhập nhưng role không nằm trong danh sách cho phép
    if (allowedRoles && !allowedRoles.includes(user?.role || '')) {
        return <Navigate to="/" replace />; // Hoặc trang 403 Forbidden
    }

    // 4. Mọi thứ OK -> Hiển thị component bên trong
    return children;
};

export default ProtectedRoute;