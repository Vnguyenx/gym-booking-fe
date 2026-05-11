// src/pages/customer/BookingSuccessPage.tsx
// Trang hiển thị QR thanh toán sau khi đặt lịch thành công
// Có nút quay lại để đặt lịch mới

import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import '../../styles/booking/booking.css';

interface BookingResult {
    bookingId: string;
    paymentCode: string;
    qrImageUrl: string;
    totalPrice: number;
}

const BookingSuccessPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Lấy kết quả booking từ state của navigate
    const result = (location.state as { result?: BookingResult })?.result;

    // Không có result → về trang booking (trường hợp vào thẳng URL)
    if (!result) return <Navigate to={ROUTES.BOOKING} />;

    const formatPrice = (amount: number) => amount.toLocaleString('vi-VN') + 'đ';



    return (
        <div className="booking-page">
            <Navbar />
            <main className="container booking-main">
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
                            loading="eager"
                            referrerPolicy="no-referrer"
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
                        <div className="success-row">
                            <span>Trạng thái</span>
                            <span style={{ color: 'var(--orange)' }}>Chờ xác nhận</span>
                        </div>
                    </div>

                    <p className="booking-success__note">
                        ⚠️ Ghi đúng mã đối chiếu khi chuyển khoản.
                        Đơn hàng được xác nhận trong vòng 24 giờ.
                    </p>

                    {/* Nút quay lại đặt lịch mới */}
                    <button
                        className="booking-success__back-btn"
                        onClick={() => navigate(ROUTES.BOOKING)}
                    >
                        ← Đặt lịch mới
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BookingSuccessPage;