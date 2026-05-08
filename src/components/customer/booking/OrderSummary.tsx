// src/components/booking/OrderSummary.tsx
// Tổng hợp đơn hàng — sticky sidebar trên desktop
// Hiển thị những gì đã chọn + tổng tiền + nút thanh toán

import React from 'react';
import useBooking from '../../../hooks/useBooking';

interface OrderSummaryProps {
    booking: ReturnType<typeof useBooking>;
}

const formatPrice = (amount: number) => amount.toLocaleString('vi-VN') + 'đ';

const OrderSummary: React.FC<OrderSummaryProps> = ({ booking }) => {
    const {
        selectedMembership,
        selectedPTService,
        selectedPT,
        totalPrice,
        canCheckout,
        loadingBooking,
        error,
        handleConfirmBooking,
    } = booking;

    return (
        <div className="order-summary">
            <h2 className="order-summary__title">Đơn hàng của bạn</h2>

            <div className="order-summary__items">
                {/* Gói tập */}
                <div className="order-item">
                    <span className="order-item__label">Gói tập</span>
                    <span className="order-item__value">
                        {selectedMembership
                            ? `${selectedMembership.name} — ${formatPrice(selectedMembership.priceOnline)}`
                            : <span className="order-item__empty">Chưa chọn</span>
                        }
                    </span>
                </div>

                {/* Dịch vụ PT */}
                <div className="order-item">
                    <span className="order-item__label">Dịch vụ PT</span>
                    <span className="order-item__value">
                        {selectedPTService
                            ? selectedPTService.name
                            : <span className="order-item__empty">Chưa chọn</span>
                        }
                    </span>
                </div>

                {/* PT đã chọn — chỉ hiện khi có chọn PT */}
                {selectedPT && (
                    <div className="order-item">
                        <span className="order-item__label">Huấn luyện viên</span>
                        <span className="order-item__value">{selectedPT.fullName}</span>
                    </div>
                )}
            </div>

            <hr className="order-summary__divider" />

            {/* Tổng tiền */}
            <div className="order-summary__total">
                <span>Tổng cộng</span>
                <span className="order-summary__price">
                    {totalPrice > 0 ? formatPrice(totalPrice) : '—'}
                </span>
            </div>

            {error && <p className="booking-error">{error}</p>}

            {/* Nút thanh toán */}
            <button
                className="order-summary__btn"
                onClick={handleConfirmBooking}
                disabled={!canCheckout || loadingBooking}
            >
                {loadingBooking ? 'Đang xử lý...' : 'Xác nhận & Thanh toán'}
            </button>

            {/* Gợi ý nếu chưa đủ điều kiện */}
            {!canCheckout && (
                <p className="order-summary__hint">
                    {!selectedMembership
                        ? '👆 Vui lòng chọn gói tập'
                        : !selectedPTService
                            ? '👆 Vui lòng chọn dịch vụ PT'
                            : '👆 Vui lòng chọn huấn luyện viên'
                    }
                </p>
            )}
        </div>
    );
};

export default OrderSummary;