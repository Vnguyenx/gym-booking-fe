import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth'; //
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; //
import { auth, db } from '../../config/firebase'; // [cite: 16]
import { ROUTES } from '../../constants/routes'; // [cite: 16]
import { ROLES } from '../../constants/roles'; // [cite: 16]
import useValidator from '../../hooks/useValidator';
import './Auth.css';
import {setLoading} from "../../store/slices/authSlice";


const RegisterPage = () => {

    const navigate = useNavigate();
    // Lấy toàn bộ logic từ Hook ra
    const {
        showPassword,
        togglePassword,
        validatePassword,
        validatePhone,
        isMatch
    } = useValidator();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        displayName: '',
        phone: ''
    });
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Kiểm tra logic bằng Hook
        if (!validatePhone(formData.phone)) return setError('Số điện thoại không hợp lệ (VN)!');
        if (!validatePassword(formData.password)) return setError('Mật khẩu yếu! (8 ký tự, 1 hoa, 1 số, 1 đặc biệt)');
        if (!isMatch(formData.password, formData.confirmPassword)) return setError('Mật khẩu nhập lại không khớp!');

        console.log("Dữ liệu hợp lệ, tiến hành đăng ký...", formData);
        setLoading(true);
        try {
            // 2. Tạo tài khoản trên Firebase Auth
            const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

            // 3. Lưu thông tin bổ sung vào Firestore [cite: 23, 37]
            // Document ID sẽ khớp với UID của Firebase Auth
            await setDoc(doc(db, 'users', userCred.user.uid), {
                uid: userCred.user.uid,
                displayName: formData.displayName,
                email: formData.email,
                phone: formData.phone,
                role: ROLES.CUSTOMER, // Mặc định là khách hàng [cite: 5, 23]
                avatarUrl: '',
                createdAt: serverTimestamp() // [cite: 23]
            });

            // 4. Thành công thì đá về trang Login hoặc Home
            navigate(ROUTES.LOGIN);
        } catch (err: any) {
            // Việt hoá một số lỗi cơ bản từ Firebase
            if (err.code === 'auth/email-already-in-use') setError('Email này đã được sử dụng!');
            else setError('Lỗi đăng ký: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h1 className="auth-title">Đăng ký</h1>
            <button className="back-btn" onClick={() => navigate(-1)}>
                ← Quay lại
            </button>
            <form onSubmit={handleRegister}>
                <input className="auth-input" placeholder="Họ tên"
                       onChange={e => setFormData({...formData, displayName: e.target.value})} required/>
                <input className="auth-input" type="email" placeholder="Email"
                       onChange={e => setFormData({...formData, email: e.target.value})} required/>

                <input
                    className="auth-input"
                    placeholder="Số điện thoại"
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    required
                />

                {/* Ô Mật khẩu 1 */}
                <div style={{position: 'relative'}}>
                    <input
                        className="auth-input"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mật khẩu"
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        required
                    />
                    <span className="toggle-pass" onClick={togglePassword}>
                        {showPassword ? '👁️' : '🙈'}
                    </span>
                </div>

                {/* Ô Nhập lại mật khẩu - CŨNG DÙNG CHUNG showPassword */}
                <div style={{position: 'relative'}}>
                    <input
                        className="auth-input"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu"
                        onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                        required
                    />
                    <span className="toggle-pass" onClick={togglePassword}>
                        {showPassword ? '👁️' : '🙈'}
                    </span>
                </div>

                {error && <p className="auth-error">{error}</p>}
                <button type="submit" className="auth-btn">ĐĂNG KÝ</button>

                <div className="auth-links" style={{justifyContent: 'center', gap: '8px'}}>
                    <span className="auth-link-item">Bạn đã có tài khoản?</span>
                    <Link to={ROUTES.LOGIN} className="auth-link-highlight">Đăng nhập</Link>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;