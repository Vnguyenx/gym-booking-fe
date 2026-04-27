// index.tsx
// Đây là file khởi động toàn bộ ứng dụng React
// Provider bọc bên ngoài để mọi component đều dùng được Redux store

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/index';
import App from './App';

import './styles/base.css';           // 1. Phải load đầu tiên để có biến --red, --bg...
import './styles/navbar.css';         // 2. Header luôn dùng chung
import './styles/hero.css';           // 3. Cho trang chủ
import './styles/sections.css';       // 4. Cho About, Pricing, PT...
import './styles/auth.css';           // 5. Cho trang Login/Register
import './styles/equipment-page.css'; // 6. Cho trang danh sách dụng cụ
import './index.css';                 // 7. Các tùy chỉnh thêm (nếu có)

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        {/* Provider cung cấp Redux store cho toàn bộ ứng dụng */}
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);