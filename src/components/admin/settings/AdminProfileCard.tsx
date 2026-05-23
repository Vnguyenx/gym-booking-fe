// src/components/admin/AdminProfileCard.tsx
/**
 * Hiển thị thông tin admin đang đăng nhập (chỉ đọc)
 */

import React from 'react';
import useAuth from '../../../hooks/useAuth';
const AdminProfileCard: React.FC = () => {
    const { user, loading } = useAuth();

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
            </div>
            <p className="profile-card__note">
                * Để chỉnh sửa thông tin, vui lòng vào mục "Quản lý người dùng".
            </p>
        </div>
    );
};

export default AdminProfileCard;