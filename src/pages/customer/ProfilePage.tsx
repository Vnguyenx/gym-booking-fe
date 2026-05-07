import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { authService } from '../../services/authService';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

const ProfilePage = () => {
    const { user, isLoggedIn, loading } = useAuth();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    if (loading) return <div>Đang tải...</div>;

    if (!loading && !isLoggedIn) {
        return <Navigate to={ROUTES.HOME} />;
    }

    const handleLogout = async () => {
        try {
            // Bước 1: Đăng xuất khỏi Firebase client SDK
            await signOut(auth);

            // Bước 2: Gọi BE xoá session cookie
            // Nếu BE đang tắt (dev mode) thì bỏ qua lỗi, vẫn logout bình thường
            await authService.logout().catch(() => {});

            // Bước 3: Xoá data trong Redux + localStorage
            dispatch(logout());

            navigate(ROUTES.HOME);
        } catch (error) {
            console.error("Lỗi đăng xuất:", error);
        }
    };

    // ── UI giữ nguyên ─────────────────────────────────────
    return (
        <div className="auth-container">
            <h1 className="auth-title">THÔNG TIN CÁ NHÂN</h1>

            {user ? (
                <div style={{ backgroundColor: '#0F0F0F', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <p><strong>Họ tên:</strong> {user.displayName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Số Zalo:</strong> {user.phone}</p>
                    <p><strong>Vai trò:</strong> <span style={{ color: '#FF9500' }}>{user.role.toUpperCase()}</span></p>
                </div>
            ) : (
                <p>Đang tải dữ liệu...</p>
            )}

            <button className="auth-btn" onClick={handleLogout}>
                ĐĂNG XUẤT
            </button>
        </div>
    );
};

export default ProfilePage;