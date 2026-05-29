// src/components/pt/notifications/ErrorToast.tsx
//
// Sub-component: toast lỗi xuất hiện khi xác nhận thất bại.
// Bấm X hoặc đợi 4 giây → tự đóng.
// Tách riêng để dễ tái dùng ở các tab khác (profile, v.v.)

import React, { useEffect } from 'react';

interface ErrorToastProps {
    message:  string;
    onClose:  () => void;
    /** Tự động đóng sau X ms. Mặc định 4000ms. 0 = không tự đóng */
    duration?: number;
}

const ErrorToast: React.FC<ErrorToastProps> = ({
                                                   message,
                                                   onClose,
                                                   duration = 4000,
                                               }) => {
    // Tự đóng sau `duration` ms
    useEffect(() => {
        if (!duration) return;
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer); // cleanup khi component unmount
    }, [duration, onClose]);

    return (
        <div className="error-toast" role="alert" aria-live="assertive">
            <i className="ti ti-alert-circle error-toast__icon" aria-hidden="true" />
            <span className="error-toast__msg">{message}</span>
            <button
                className="error-toast__close"
                onClick={onClose}
                aria-label="Đóng thông báo lỗi"
            >
                <i className="ti ti-x" aria-hidden="true" />
            </button>
        </div>
    );
};

export default ErrorToast;