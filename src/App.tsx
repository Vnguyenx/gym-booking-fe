// App.tsx
import React, { useEffect, useState } from 'react';
import AppRouter from './router/AppRouter';
import { useAppDispatch } from './store/hooks';
import { setUser } from './store/slices/authSlice';
import { authService } from './services/authService';

const App = () => {
  const dispatch = useAppDispatch();
  const [checking, setChecking] = useState(true); // đang kiểm tra session

  useEffect(() => {
    authService.getMe()
        .then(data => {
          if (data?.user) dispatch(setUser(data.user));
        })
        .finally(() => {
          setChecking(false); // kiểm tra xong dù có hay không có session
        });
  }, []);

  // Chưa kiểm tra xong → không render gì cả, tránh nháy trang
  if (checking) return null;

  return <AppRouter />;
};

export default App;