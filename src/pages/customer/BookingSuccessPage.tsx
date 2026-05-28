// src/pages/customer/BookingSuccessPage.tsx
import React from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import '../../styles/booking/booking.css';

const BookingSuccessPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    // ── QR flow: state truyền từ QRPaymentModal ──────────
    const qrState = location.state as {
        method?: 'qr';
        paymentCode?: string;
        totalPrice?: number;
    } | null;

    const isQRFlow = qrState?.method === 'qr';

    // ── VNPay flow: query params từ VNPay redirect ───────
    const responseCode = searchParams.get('vnp_ResponseCode');
    const amount = searchParams.get('vnp_Amount');
    const txnRef = searchParams.get('vnp_TxnRef');

    const isVNPaySuccess = responseCode === '00';
    const totalPrice = amount ? parseInt(amount) / 100 : (qrState?.totalPrice ?? 0);
    const formatPrice = (n: number) => n.toLocaleString('vi-VN') + 'đ';

    return (
        <div className="booking-page">
            <Navbar />
            <main className="container booking-main">
                <div className="booking-success">

                    {/* ── QR flow ── */}
                    {isQRFlow ? (
                        <>
                            <div className="booking-success__icon">⏳</div>
                            <h2 className="booking-success__title">Chờ xác nhận</h2>
                            <p className="booking-success__sub">
                                Đơn hàng đang chờ admin kiểm tra và xác nhận
                            </p>
                            <div className="booking-success__info">
                                <div className="success-row">
                                    <span>Mã đối chiếu</span>
                                    <span className="success-code">{qrState?.paymentCode}</span>
                                </div>
                                <div className="success-row">
                                    <span>Số tiền</span>
                                    <span className="success-price">{formatPrice(totalPrice)}</span>
                                </div>
                                <div className="success-row">
                                    <span>Trạng thái</span>
                                    <span style={{ color: 'var(--orange)' }}>Chờ xác nhận</span>
                                </div>
                            </div>
                            <p className="booking-success__note">
                                📋 Vui lòng lưu lại mã đối chiếu <strong>{qrState?.paymentCode}</strong>.
                                Admin sẽ xác nhận đơn trong vòng 24 giờ làm việc.
                            </p>
                        </>

                    ) : isVNPaySuccess ? (
                        /* ── VNPay thành công ── */
                        <>
                            <div className="booking-success__icon">✅</div>
                            <h2 className="booking-success__title">Thanh toán thành công!</h2>
                            <p className="booking-success__sub">
                                Đơn hàng của bạn đã được xác nhận
                            </p>
                            <div className="booking-success__info">
                                <div className="success-row">
                                    <span>Mã đơn hàng</span>
                                    <span className="success-code">{txnRef}</span>
                                </div>
                                <div className="success-row">
                                    <span>Số tiền</span>
                                    <span className="success-price">{formatPrice(totalPrice)}</span>
                                </div>
                                <div className="success-row">
                                    <span>Trạng thái</span>
                                    <span style={{ color: 'green' }}>Đã xác nhận</span>
                                </div>
                            </div>
                        </>

                    ) : (
                        /* ── VNPay thất bại ── */
                        <>
                            <div className="booking-success__icon">❌</div>
                            <h2 className="booking-success__title">Thanh toán thất bại</h2>
                            <p className="booking-success__sub">
                                Đơn hàng chưa được xác nhận. Vui lòng thử lại.
                            </p>
                        </>
                    )}

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