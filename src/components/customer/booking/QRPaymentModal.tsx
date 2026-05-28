// src/components/customer/booking/QRPaymentModal.tsx
// Modal hiển thị mã QR VietQR để khách chuyển khoản
// Sau khi chuyển: bấm "Tôi đã chuyển khoản" → đóng modal + thông báo chờ admin duyệt

import React from 'react';
import { QRData } from '../../../hooks/useBooking';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

interface QRPaymentModalProps {
    qrData: QRData;
    onClose: () => void;
}

const formatPrice = (amount: number) => amount.toLocaleString('vi-VN') + 'đ';

const QRPaymentModal: React.FC<QRPaymentModalProps> = ({ qrData, onClose }) => {
    const navigate = useNavigate();
    const { qrUrl, paymentCode, totalPrice, accountNo, accountName, bankId } = qrData;

    const handleDone = () => {
        // Đóng modal, chuyển sang trang thông báo chờ duyệt
        onClose();
        navigate(ROUTES.BOOKING_SUCCESS, {
            state: { method: 'qr', paymentCode, totalPrice },
        });
    };

    return (
        // Backdrop — click ngoài không đóng vì user cần xem mã
        <div className="qr-modal-backdrop">
            <div className="qr-modal">

                {/* Header */}
                <div className="qr-modal__header">
                    <h2 className="qr-modal__title">Quét mã để thanh toán</h2>
                    <button className="qr-modal__close" onClick={onClose} aria-label="Đóng">✕</button>
                </div>

                {/* Mã QR */}
                <div className="qr-modal__qr-wrap">
                    <img
                        src={qrUrl}
                        alt="Mã QR thanh toán"
                        className="qr-modal__qr-img"
                    />
                </div>

                {/* Thông tin chuyển khoản */}
                <div className="qr-modal__info">
                    <div className="qr-info-row">
                        <span className="qr-info-row__label">Ngân hàng</span>
                        <span className="qr-info-row__value">{bankId}</span>
                    </div>
                    <div className="qr-info-row">
                        <span className="qr-info-row__label">Số tài khoản</span>
                        <span className="qr-info-row__value qr-info-row__value--mono">{accountNo}</span>
                    </div>
                    <div className="qr-info-row">
                        <span className="qr-info-row__label">Chủ tài khoản</span>
                        <span className="qr-info-row__value">{accountName}</span>
                    </div>
                    <div className="qr-info-row">
                        <span className="qr-info-row__label">Số tiền</span>
                        <span className="qr-info-row__value qr-info-row__value--price">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="qr-info-row">
                        <span className="qr-info-row__label">Nội dung CK</span>
                        <span className="qr-info-row__value qr-info-row__value--code">{paymentCode}</span>
                    </div>
                </div>

                {/* Ghi chú */}
                <p className="qr-modal__note">
                    ⚠️ Vui lòng ghi đúng nội dung chuyển khoản <strong>{paymentCode}</strong> để admin xác nhận nhanh hơn.
                </p>

                {/* Nút xác nhận */}
                <button className="qr-modal__btn" onClick={handleDone}>
                    ✅ Tôi đã chuyển khoản
                </button>
            </div>
        </div>
    );
};

export default QRPaymentModal;