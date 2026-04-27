import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setLoading, setError } from '../../store/slices/authSlice';
import useValidator from '../../hooks/useValidator';
import '../../styles/auth.css';

const RegisterPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector(state => state.auth);
    const { showPassword, togglePassword, validatePassword, validatePhone, isMatch } = useValidator();

    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setError(null));

        if (!validatePhone(formData.phone)) return dispatch(setError('Số điện thoại không hợp lệ.'));
        if (!validatePassword(formData.password)) return dispatch(setError('Mật khẩu cần ít nhất 8 ký tự, có chữ hoa và số.'));
        if (!isMatch(formData.password, formData.confirmPassword)) return dispatch(setError('Mật khẩu nhập lại không khớp.'));

        dispatch(setLoading(true));
        try {
            const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            await setDoc(doc(db, "users", userCred.user.uid), {
                uid: userCred.user.uid,
                email: formData.email,
                displayName: formData.displayName,
                phone: formData.phone,
                role: ROLES.CUSTOMER,
                createdAt: serverTimestamp()
            });
            navigate(ROUTES.LOGIN);
        } catch (err: any) {
            dispatch(setError(err.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <Link to={ROUTES.HOME} className="auth-logo">GYM<span>XYZ</span></Link>

                <button className="auth-back" onClick={() => navigate(ROUTES.HOME)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                    </svg>
                    Về trang chủ
                </button>

                <h1 className="auth-title">Tạo tài khoản</h1>
                <p className="auth-sub">Miễn phí · Kích hoạt trong 24 giờ.</p>

                <form className="auth-form" onSubmit={handleRegister}>
                    <div className="form-group">
                        <label className="form-label">Họ và tên</label>
                        <input className="auth-input" type="text" placeholder="Nguyễn Văn A"
                               onChange={e => setFormData({...formData, displayName: e.target.value})} required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input className="auth-input" type="email" placeholder="name@example.com"
                               onChange={e => setFormData({...formData, email: e.target.value})} required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Số điện thoại</label>
                        <input className="auth-input" type="tel" placeholder="0901234567"
                               onChange={e => setFormData({...formData, phone: e.target.value})} required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Mật khẩu</label>
                            <input className="auth-input" type={showPassword ? "text" : "password"} placeholder="••••••••"
                                   onChange={e => setFormData({...formData, password: e.target.value})} required />

                    </div>

                    <div className="form-group">
                        <label className="form-label">Xác nhận mật khẩu</label>
                        <input className="auth-input" type={showPassword ? "text" : "password"} placeholder="••••••••"
                               onChange={e => setFormData({...formData, confirmPassword: e.target.value})} required />
                    </div>

                    {error && <p className="auth-error-msg">{error}</p>}

                    <button type="submit" className="btn-auth" disabled={loading}>
                        {loading ? 'Đang tạo tài khoản...' : 'Đăng ký ngay'}
                    </button>
                </form>

                <p className="auth-footer">
                    Đã có tài khoản? <Link to={ROUTES.LOGIN}>Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;