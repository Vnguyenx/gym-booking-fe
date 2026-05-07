// src/pages/customer/BookingPage.tsx
// Trang đặt lịch — ghép các bước lại với nhau
// Đọc state từ trang trước (membership hoặc PT nếu có)
// Render đúng bước theo điểm vào

import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Membership, PT } from '../../types/models';
import useAuth from '../../hooks/useAuth';
import useBooking from '../../hooks/useBooking';
import { ROUTES } from '../../constants/routes';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import BookingProgress from '../../components/customer/booking/BookingProgress';
import StepMembership from '../../components/customer/booking/StepMembership';
import StepPTService from '../../components/customer/booking/StepPTService';
import StepSelectPT from '../../components/customer/booking/StepSelectPT';
import StepSummary from '../../components/customer/booking/StepSummary';
import '../../styles/booking/booking.css';

const BookingPage: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const location = useLocation();

    // Đọc data từ trang trước (nếu có)
    const { membership, pt } = (location.state || {}) as {
        membership?: Membership;
        pt?: PT;
    };

    const booking = useBooking({ membership, pt });

    // Chưa đăng nhập → về trang login
    if (!isLoggedIn) return <Navigate to={ROUTES.LOGIN} />;


    // ── Render bước hiện tại theo entryPoint ─────────────
    const renderStep = () => {
        const { currentStep, entryPoint } = booking;

        // ── Điểm vào: Từ PricingCard (đã có membership) ──
        // Bước 1: Chọn gói PT service
        // Bước 2: Chọn PT cụ thể (nếu có PT)
        // Bước 3: Tổng hợp + thanh toán
        if (entryPoint === 'fromPricing') {
            if (currentStep === 1) return <StepPTService booking={booking} />;
            if (currentStep === 2) return <StepSelectPT booking={booking} />;
            return <StepSummary booking={booking} />;
        }

        // ── Điểm vào: Từ PTDetailPage (đã có PT) ─────────
        // Bước 1: Chọn gói PT service
        // Bước 2: Chọn gói tập (membership)
        // Bước 3: Tổng hợp + thanh toán
        if (entryPoint === 'fromPT') {
            if (currentStep === 1) return <StepPTService booking={booking} />;
            if (currentStep === 2) return <StepMembership booking={booking} />;
            return <StepSummary booking={booking} />;
        }

        // ── Điểm vào: Vào thẳng trang booking ────────────
        // Bước 1: Chọn gói tập
        // Bước 2: Chọn gói PT service
        // Bước 3: Chọn PT cụ thể (nếu có PT)
        // Bước 4: Tổng hợp + thanh toán
        if (currentStep === 1) return <StepMembership booking={booking} />;
        if (currentStep === 2) return <StepPTService booking={booking} />;
        if (currentStep === 3) return <StepSelectPT booking={booking} />;
        return <StepSummary booking={booking} />;
    };

    return (
        <div className="booking-page">
            <Navbar />
            <main className="container booking-main">
                <h1 className="booking-title">Đăng ký gói tập</h1>

                {/* Thanh tiến trình */}
                <BookingProgress
                    currentStep={booking.currentStep}
                    maxSteps={booking.maxSteps}
                />

                {/* Nội dung từng bước */}
                <div className="booking-content">
                    {renderStep()}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BookingPage;