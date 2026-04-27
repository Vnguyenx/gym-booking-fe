import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';


const ProfilePage = () => {
    const { user, isLoggedIn, loading } = useAuth(); // Lấy data từ Redux
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    if (loading) return <div>Đang tải...</div>;


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