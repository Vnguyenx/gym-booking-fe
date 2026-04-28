import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { ROUTES } from '../../constants/routes';
import '../../styles/auth/auth-shared.css';
import '../../styles/auth/forgot-password.css';


const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await sendPasswordResetEmail(auth, email);
            setSent(true);
        } catch (err: any) {
            setError("Không thể gửi email. Vui lòng kiểm tra lại địa chỉ email.");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <Link to={ROUTES.HOME} className="auth-logo">Welcome to my <span>GYM</span></Link>

                <button className="auth-back" onClick={() => navigate(ROUTES.LOGIN)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                    </svg>
                    Quay lại Đăng nhập
                </button>

                {!sent ? (
                    <>
                        <h1 className="auth-title">Quên mật khẩu</h1>
                        <p className="auth-sub">Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu.</p>

                        <div className="auth-info" style={{marginBottom: '1.5rem'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Kiểm tra cả hòm thư Spam nếu bạn không thấy email gửi đến.
                        </div>

                        <form className="auth-form" onSubmit={handleReset}>
                            <div className="form-group">
                                <label className="form-label">Email đăng ký</label>
                                <input className="auth-input" type="email" value={email}
                                       onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required />
                            </div>
                            {error && <p className="auth-error-msg">{error}</p>}
                            <button type="submit" className="btn-auth">Gửi yêu cầu</button>
                        </form>
                    </>
                ) : (
                    <div className="auth-success">
                        <div style={{fontSize: '3rem', marginBottom: '1rem'}}>📩</div>
                        <h2 className="auth-title" style={{fontSize: '1.5rem'}}>Đã gửi thành công!</h2>
                        <p className="auth-sub">Liên kết đặt lại mật khẩu đã được gửi tới <b>{email}</b>.</p>
                        <button className="btn-auth" onClick={() => navigate(ROUTES.LOGIN)}>Quay lại Đăng nhập</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;