// src/components/booking/StepSummary.tsx
// Bước cuối — hiển thị tổng hợp đơn hàng và QR VietQR
// Nếu chưa confirm → hiển thị tóm tắt + nút xác nhận
// Nếu đã confirm → hiển thị QR để thanh toán

import React from 'react';
import useBooking from '../../../hooks/useBooking';

interface StepSummaryProps {
    booking: ReturnType<typeof useBooking>;
}

// Format tiền: 5250000 → "5.250.000đ"
const formatPrice = (amount: number): string =>
    amount.toLocaleString('vi-VN') + 'đ';

const StepSummary: React.FC<StepSummaryProps> = ({ booking }) => {
    const {
        selectedMembership,
        selectedPTService,
        selectedPT,
        totalPrice,
        bookingResult,
        loading,
        error,
        handleConfirmBooking,
        prevStep,
    } = booking;

    // ── Đã tạo booking → hiển thị QR ─────────────────────
    if (bookingResult) {
        return (
            <div className="booking-step booking-step--result">
                <div className="booking-result__icon">✅</div>
                <h2 className="booking-step__title">Đặt lịch thành công!</h2>
                <p className="booking-step__sub">
                    Quét mã QR bên dưới để hoàn tất thanh toán
                </p>

                {/* QR Code */}
                {bookingResult.qrImageUrl && (
                    <img
                        src={bookingResult.qrImageUrl}
                        alt="QR thanh toán"
                        className="booking-result__qr"
                    />
                )}

                {/* Thông tin thanh toán */}
                <div className="booking-result__info">
                    <p>
                        <strong>Mã đối chiếu:</strong>{' '}
                        <span className="booking-result__code">
                            {bookingResult.paymentCode}
                        </span>
                    </p>
                    <p>
                        <strong>Số tiền:</strong>{' '}
                        {formatPrice(bookingResult.totalPrice)}
                    </p>
                </div>

                <p className="booking-result__note">
                    ⚠️ Ghi đúng mã đối chiếu khi chuyển khoản.
                    Đơn hàng sẽ được xác nhận trong vòng 24 giờ.
                </p>
            </div>
        );
    }

    // ── Chưa confirm → hiển thị tóm tắt ─────────────────
    return (
        <div className="booking-step">
            <h2 className="booking-step__title">Xác nhận đơn hàng</h2>
            <p className="booking-step__sub">Kiểm tra lại thông tin trước khi thanh toán</p>

            <div className="booking-summary">
                {/* Gói tập */}
                {selectedMembership && (
                    <div className="summary-row">
                        <span className="summary-row__label">Gói tập</span>
                        <span className="summary-row__value">
                            {selectedMembership.name} —{' '}
                            {formatPrice(selectedMembership.priceOnline)}
                        </span>
                    </div>
                )}

                {/* Dịch vụ PT */}
                {selectedPTService && (
                    <div className="summary-row">
                        <span className="summary-row__label">Dịch vụ PT</span>
                        <span className="summary-row__value">
                            {selectedPTService.name}
                            {selectedPTService.pricePerMonth > 0 && (
                                ` — ${formatPrice(selectedPTService.pricePerMonth)}/tháng`
                            )}
                        </span>
                    </div>
                )}

                {/* PT đã chọn */}
                {selectedPT && (
                    <div className="summary-row">
                        <span className="summary-row__label">Huấn luyện viên</span>
                        <span className="summary-row__value">{selectedPT.fullName}</span>
                    </div>
                )}

                <hr className="summary-divider" />

                {/* Tổng tiền */}
                <div className="summary-row summary-row--total">
                    <span className="summary-row__label">Tổng cộng</span>
                    <span className="summary-row__total">{formatPrice(totalPrice)}</span>
                </div>
            </div>

            {error && <p className="booking-error">{error}</p>}

            {/* Nút hành động */}
            <div className="booking-actions">
                <button
                    className="booking-back-btn"
                    onClick={prevStep}
                    disabled={loading}
                >
                    ← Quay lại
                </button>

                <button
                    className="booking-confirm-btn"
                    onClick={handleConfirmBooking}
                    disabled={loading}
                >
                    {loading ? 'Đang xử lý...' : 'Xác nhận & Thanh toán'}
                </button>
            </div>
        </div>
    );
};

export default StepSummary;