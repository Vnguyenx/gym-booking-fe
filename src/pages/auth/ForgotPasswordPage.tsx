import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { ROUTES } from '../../constants/routes';
import './Auth.css';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState({ status: '', text: '' });
    const navigate = useNavigate();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ status: '', text: '' });

        try {
            // 1. Kiểm tra email có trong Firestore users chưa
            const q = query(collection(db, "users"), where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return setMessage({ status: 'error', text: 'Email này chưa được đăng ký!' });
            }

            // 2. Gửi email reset pass của Firebase [cite: 75]
            await sendPasswordResetEmail(auth, email);
            setMessage({ status: 'success', text: 'Thành công! Kiểm tra hộp thư của bạn.' });
        } catch (err: any) {
            setMessage({ status: 'error', text: 'Lỗi: ' + err.message });
        }
    };

    return (
        <div className="auth-container">
            {/* Nút Back về trang Login */}
            <button className="back-btn" onClick={() => navigate(ROUTES.LOGIN)}>
                ← Quay lại Đăng nhập
            </button>

            <h1 className="auth-title">KHÔI PHỤC</h1>
            <p className="auth-subtitle">Nhập email để lấy lại mật khẩu</p>

            <form onSubmit={handleReset}>
                <input
                    className="auth-input"
                    type="email"
                    placeholder="Email của bạn"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                {message.text && (
                    <p className={message.status === 'success' ? "auth-success" : "auth-error"}>
                        {message.text}
                    </p>
                )}

                <button type="submit" className="auth-btn">GỬI YÊU CẦU</button>
            </form>

            <div className="auth-links" style={{ justifyContent: 'center' }}>
                <span className="auth-link-item">Chưa có tài khoản? </span>
                <Link to={ROUTES.REGISTER} className="auth-link-highlight">&nbsp;Đăng ký ngay</Link>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;