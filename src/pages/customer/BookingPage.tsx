// src/pages/customer/BookingPage.tsx
// Trang đặt lịch dạng single page — giống trang checkout TMĐT
import { useLocation, Navigate} from 'react-router-dom';
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

    const booking = useBooking({ membership, pt });


    if (!isLoggedIn) return <Navigate to={ROUTES.LOGIN} />;


    return (
        <div className="booking-page">
            <Navbar />
            <main className="booking-main">
                <h1 className="booking-title">Đăng ký gói tập</h1>

                <div className="booking-layout">
                    {/* ── CỘT TRÁI: Các mục chọn ── */}
                    <div className="booking-sections">
                        <SectionMembership booking={booking} />
                        <SectionPTService booking={booking} />
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

export default BookingPage;