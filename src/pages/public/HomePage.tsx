import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import '../auth/Auth.css';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="auth-container" style={{ textAlign: 'center', maxWidth: '600px' }}>
            <h1 className="auth-title">GYM PRO SYSTEM</h1>
                <div>
                    <p className="auth-subtitle">Hệ thống quản lý tập luyện chuyên nghiệp</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="auth-btn" onClick={() => navigate(ROUTES.LOGIN)}>ĐĂNG NHẬP</button>
                        <button className="auth-btn" style={{ backgroundColor: '#1C1C1E', border: '1px solid #FF3B30' }} onClick={() => navigate(ROUTES.REGISTER)}>ĐĂNG KÝ</button>
                    </div>
                </div>

        </div>
    );
};
export default HomePage;