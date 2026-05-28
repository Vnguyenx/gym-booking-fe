// App.tsx
import React, { useEffect, useState } from 'react';
import AppRouter from './router/AppRouter';
import { useAppDispatch } from './store/hooks';
import { setUser } from './store/authSlice';
import { authService } from './services/authService';

const App = () => {
    const dispatch = useAppDispatch();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        // Luôn gọi BE để verify session cookie
        // Nếu còn session → dùng data từ BE (mới nhất)
        // Nếu hết session → xóa localStorage, về trạng thái chưa đăng nhập
        authService.getMe()
            .then(data => {
                if (data?.user) {
                    dispatch(setUser(data.user));
                    localStorage.setItem('auth_user', JSON.stringify(data.user));
                } else {
                    localStorage.removeItem('auth_user');
                }
            })
            .catch(() => {
                // BE lỗi mạng → dùng localStorage làm fallback
                const saved = localStorage.getItem('auth_user');
                if (saved) {
                    try { dispatch(setUser(JSON.parse(saved))); } catch {}
                }
            })
            .finally(() => setChecking(false));
    }, []);

    if (checking) return null;

    return <AppRouter />;
};

export default App;