import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import '../../styles/booking/booking.css';

const BookingSuccessPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const responseCode = searchParams.get('vnp_ResponseCode');
    const amount = searchParams.get('vnp_Amount');
    const txnRef = searchParams.get('vnp_TxnRef');

    const isSuccess = responseCode === '00';
    const totalPrice = amount ? parseInt(amount) / 100 : 0;
    const formatPrice = (n: number) => n.toLocaleString('vi-VN') + 'đ';

    return (
        <div className="booking-page">
            <Navbar />
            <main className="container booking-main">
                <div className="booking-success">
                    {isSuccess ? (
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