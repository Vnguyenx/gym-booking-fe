import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setUser, setLoading, setError } from '../../store/authSlice';
import { ROUTES } from '../../constants/routes';
import useValidator from '../../hooks/useValidator';
import { authService } from '../../services/authService';
import '../../styles/auth/auth-shared.css';
import '../../styles/auth/login.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { showPassword } = useValidator();
    const { loading, error } = useAppSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            // Bước 1: Dùng Firebase client SDK để xác thực email/password
            // Mục đích: lấy idToken để gửi lên BE verify
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCred.user.getIdToken();

            // Bước 2: Gửi idToken lên BE
            // BE verify token → tạo session cookie → trả về thông tin user
            const data = await authService.login(idToken);

            // Bước 3: Lưu thông tin user vào Redux store
            dispatch(setUser(data.user));
            navigate(ROUTES.HOME);

        } catch (err: any) {
            dispatch(setError('Email hoặc mật khẩu không chính xác.'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ── UI giữ nguyên ─────────────────────────────────────
    return (
        <div className="auth-page">
            <div className="auth-card">
                <Link to={ROUTES.HOME} className="auth-logo">Welcome to my <span>GYM</span></Link>

                <button className="auth-back" onClick={() => navigate(ROUTES.HOME)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                    </svg>
                    Về trang chủ
                </button>

                <h1 className="auth-title">Đăng nhập</h1>
                <p className="auth-sub">Chào mừng trở lại! Tiếp tục hành trình của bạn.</p>

                <form className="auth-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            className={`auth-input ${error ? 'error' : ''}`}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Mật khẩu</label>
                        <input
                            className={`auth-input ${error ? 'error' : ''}`}
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && <p className="auth-error-msg">{error}</p>}

                    <button type="submit" className="btn-auth" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <Link to={ROUTES.RESET} className="auth-link-item" style={{ fontSize: '0.85rem' }}>
                            Quên mật khẩu?
                        </Link>
                    </div>
                </form>

                <p className="auth-footer">
                    Chưa có tài khoản? <Link to={ROUTES.REGISTER}>Đăng ký ngay</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;