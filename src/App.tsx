// App.tsx
import React, { useEffect, useState } from 'react';
import AppRouter from './router/AppRouter';
import { useAppDispatch } from './store/hooks';
import { setUser } from './store/slices/authSlice';
import { authService } from './services/authService';

const App = () => {
    const dispatch = useAppDispatch();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        // Nếu localStorage đã có user → dùng luôn, không cần gọi BE
        // Mục đích: dev FE không cần bật BE, production vẫn hoạt động
        const saved = localStorage.getItem('auth_user');
        if (saved) {
            try {
                dispatch(setUser(JSON.parse(saved)));
            } catch {
                // Dữ liệu bị hỏng → bỏ qua
            }
            setChecking(false);
            return; // ← thoát sớm, không gọi getMe
        }

        // Không có localStorage → hỏi BE xem còn session cookie không
        // Trường hợp: user chưa từng đăng nhập trên máy này
        authService.getMe()
            .then(data => {
                if (data?.user) dispatch(setUser(data.user));
            })
            .catch(() => {
                // BE tắt hoặc lỗi mạng → bỏ qua, giữ trạng thái chưa đăng nhập
            })
            .finally(() => setChecking(false));
    }, []);

    if (checking) return null;

    return <AppRouter />;
};

export default App;