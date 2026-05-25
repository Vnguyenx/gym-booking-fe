// src/components/admin/AdminProfileCard.tsx
/**
 * Hiển thị thông tin admin đang đăng nhập (chỉ đọc)
 */

import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store/hooks';
import { logout } from '../../../store/authSlice';
import { auth } from '../../../config/firebase';
import { signOut } from 'firebase/auth';
import useAuth from '../../../hooks/useAuth';
import { ROUTES } from '../../../constants/routes';

const AdminProfileCard: React.FC = () => {
    const { user, loading,isLoggedIn } = useAuth();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // 1. Kiểm tra quyền truy cập (Nếu chưa login thì đá ra trang Login)
    if (!loading && !isLoggedIn) {
        return <Navigate to={ROUTES.LOGIN} />;
    }

    const handleLogout = async () => {
        try {
            await signOut(auth); // Đăng xuất khỏi Firebase
            dispatch(logout()); // Xoá data trong Redux
            navigate(ROUTES.LOGIN);
        } catch (error) {
            console.error("Lỗi đăng xuất:", error);
        }
    };

    if (loading) {
        return <div className="profile-card">Đang tải thông tin...</div>;
    }

    if (!user) {
        return <div className="profile-card">Không tìm thấy thông tin người dùng</div>;
    }

    return (
        <div className="profile-card">
            <h2 className="profile-card__title">Thông tin cá nhân</h2>
            <div className="profile-card__avatar">
                {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.displayName} />
                ) : (
                    <div className="profile-card__avatar-placeholder">
                        {user.displayName?.charAt(0) || 'A'}
                    </div>
                )}
            </div>
            <div className="profile-card__info">
                <div className="profile-card__field">
                    <label>Họ tên</label>
                    <p>{user.displayName || 'Chưa cập nhật'}</p>
                </div>
                <div className="profile-card__field">
                    <label>Email</label>
                    <p>{user.email}</p>
                </div>
                <div className="profile-card__field">
                    <label>Số điện thoại</label>
                    <p>{user.phone || 'Chưa cập nhật'}</p>
                </div>
                <div className="profile-card__field">
                    <label>Vai trò</label>
                    <p className="profile-card__role">{user.role.toUpperCase()}</p>
                </div>
                <button className="auth-btn" onClick={handleLogout}>
                    ĐĂNG XUẤT
                </button>
            </div>
            <p className="profile-card__note">
                * Để chỉnh sửa thông tin, vui lòng vào mục "Quản lý người dùng".
            </p>
        </div>
    );
};

export default AdminProfileCard;