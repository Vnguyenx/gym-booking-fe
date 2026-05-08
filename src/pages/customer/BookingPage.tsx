// src/pages/customer/BookingPage.tsx
// Trang đặt lịch dạng single page — giống trang checkout TMĐT
// Hiển thị tất cả các mục cùng lúc, user chọn từng phần

import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Membership, PT } from '../../types/models';
import useAuth from '../../hooks/useAuth';
import useBooking from '../../hooks/useBooking';
import { ROUTES } from '../../constants/routes';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SectionMembership from '../../components/customer/booking/SectionMembership';
import SectionPTService from '../../components/customer/booking/SectionPTService';
import SectionSelectPT from '../../components/customer/booking/SectionSelectPT';
import OrderSummary from '../../components/customer/booking/OrderSummary';
import '../../styles/booking/booking.css';

const BookingPage: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const location = useLocation();

    const { membership, pt } = (location.state || {}) as {
        membership?: Membership;
        pt?: PT;
    };

    // ✅ Hook gọi trước early return
    const booking = useBooking({ membership, pt });

    if (!isLoggedIn) return <Navigate to={ROUTES.LOGIN} />;

    // Đã thanh toán → hiển thị kết quả QR
    if (booking.bookingResult) {
        return (
            <div className="booking-page">
                <Navbar />
                <main className="container booking-main">
                    <BookingSuccess result={booking.bookingResult} />
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="booking-page">
            <Navbar />
            <main className="booking-main">
                <h1 className="booking-title">Đăng ký gói tập</h1>

                <div className="booking-layout">
                    {/* ── CỘT TRÁI: Các mục chọn ── */}
                    <div className="booking-sections">
                        {/* Mục 1: Chọn gói tập */}
                        <SectionMembership booking={booking} />

                        {/* Mục 2: Chọn dịch vụ PT */}
                        <SectionPTService booking={booking} />

                        {/* Mục 3: Chọn PT cụ thể — chỉ hiện khi chọn có PT */}
                        {booking.selectedPTService &&
                            booking.selectedPTService.type !== 'none' && (
                                <SectionSelectPT booking={booking} />
                            )}
                    </div>

                    {/* ── CỘT PHẢI: Tổng hợp đơn hàng ── */}
                    <div className="booking-sidebar">
                        <OrderSummary booking={booking} />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

// ── Component hiển thị kết quả sau khi đặt thành công ────
interface BookingSuccessProps {
    result: {
        bookingId: string;
        paymentCode: string;
        qrImageUrl: string;
        totalPrice: number;
    };
}

const BookingSuccess: React.FC<BookingSuccessProps> = ({ result }) => {
    const formatPrice = (amount: number) => amount.toLocaleString('vi-VN') + 'đ';

    return (
        <div className="booking-success">
            <div className="booking-success__icon">✅</div>
            <h2 className="booking-success__title">Đặt lịch thành công!</h2>
            <p className="booking-success__sub">
                Quét mã QR bên dưới để hoàn tất thanh toán
            </p>

            {result.qrImageUrl && (
                <img
                    src={result.qrImageUrl}
                    alt="QR thanh toán"
                    className="booking-success__qr"
                />
            )}

            <div className="booking-success__info">
                <div className="success-row">
                    <span>Mã đối chiếu</span>
                    <span className="success-code">{result.paymentCode}</span>
                </div>
                <div className="success-row">
                    <span>Số tiền</span>
                    <span className="success-price">{formatPrice(result.totalPrice)}</span>
                </div>
            </div>

            <p className="booking-success__note">
                ⚠️ Ghi đúng mã đối chiếu khi chuyển khoản.
                Đơn hàng được xác nhận trong vòng 24 giờ.
            </p>
        </div>
    );
};

export default BookingPage;