// index.tsx
// Đây là file khởi động toàn bộ ứng dụng React
// Provider bọc bên ngoài để mọi component đều dùng được Redux store

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/index';
import App from './App';

import './styles/base/base.css';
import './styles/layout/navbar.css';
import './styles/layout/footer.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        {/* Provider cung cấp Redux store cho toàn bộ ứng dụng */}
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);