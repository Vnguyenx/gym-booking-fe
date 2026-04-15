import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useAppDispatch, useAppSelector } from '../../store/hooks'; // Thêm selector để lấy error
import { setUser, setLoading, setError } from '../../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';
import useValidator from '../../hooks/useValidator';
import './Auth.css';

const LoginPage = () => {
    const { showPassword, togglePassword } = useValidator();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Lấy trạng thái từ Redux để hiển thị thông báo
    const { loading, error } = useAppSelector((state) => state.auth);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setLoading(true));
        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            const uid = userCred.user.uid; // Lấy UID từ Firebase Auth

            // Lấy thông tin từ Firestore
            const userDoc = await getDoc(doc(db, 'users', uid));

            if (userDoc.exists()) {
                const data = userDoc.data();

                // 1. Cập nhật Redux TRƯỚC
                dispatch(setUser({
                    uid: data.uid,
                    email: data.email,
                    displayName: data.displayName,
                    role: data.role,
                    phone: data.phone,
                    avatarUrl: data.avatarUrl || ''
                }));

                // 2. Ép nó dừng loading để AppRouter nhận diện isLoggedIn = true
                dispatch(setLoading(false));

                // 3. Điều hướng (Sử dụng setTimeout 100ms nếu vẫn bị đứng trang)
                setTimeout(() => {
                    if (data.role === ROLES.ADMIN) navigate(ROUTES.ADMIN_DASHBOARD);
                    else if (data.role === ROLES.PT) navigate(ROUTES.PT_DASHBOARD);
                    else navigate(ROUTES.MY_PROFILE);
                }, 100);

            } else {
                dispatch(setError("Tài khoản chưa được phân quyền trong hệ thống!"));
            }
        } catch (err: any) {
            dispatch(setError("Email hoặc mật khẩu không chính xác!"));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="auth-container">
            <button className="back-btn" onClick={() => navigate(ROUTES.HOME)}>
                ← Trang chủ
            </button>

            <h1 className="auth-title">Đăng nhập</h1>

            <form onSubmit={handleLogin}>
                {/* THIẾU 1: Bổ sung value và onChange cho Email */}
                <input
                    className="auth-input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <div style={{position: 'relative'}}>
                    {/* THIẾU 2: Bổ sung value và onChange cho Password */}
                    <input
                        className="auth-input"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <span className="toggle-pass" onClick={togglePassword}>
                        {showPassword ? '👁️' : '🙈'}
                    </span>
                </div>

                {/* THIẾU 3: Hiển thị thông báo lỗi từ Redux */}
                {error && <p className="auth-error">{error}</p>}

                <button type="submit" className="auth-btn" disabled={loading}>
                    {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
                </button>

                <div className="auth-links">
                    <Link to={ROUTES.RESET} className="auth-link-item">Quên mật khẩu?</Link>
                    <Link to={ROUTES.REGISTER} className="auth-link-highlight">Đăng ký ngay</Link>
                </div>
            </form>
        </div>
    );
};
export default LoginPage;