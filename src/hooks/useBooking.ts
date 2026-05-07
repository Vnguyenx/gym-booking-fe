// src/hooks/useBooking.ts
// Hook quản lý toàn bộ state luồng đặt lịch
// Hỗ trợ 3 điểm vào:
// 1. Vào thẳng trang booking
// 2. Từ PricingCard (đã có membership)
// 3. Từ PTDetailPage (đã có PT)

import { useState } from 'react';
import { Membership, PTService, PT } from '../types/models';
import { bookingService } from '../services/bookingService';

// Kết quả trả về sau khi tạo booking thành công
interface BookingResult {
    bookingId: string;
    paymentCode: string;
    qrImageUrl: string;
    totalPrice: number;
}

// Data truyền vào từ trang trước (nếu có)
interface BookingInitialState {
    membership?: Membership; // truyền từ PricingCard
    pt?: PT;                 // truyền từ PTDetailPage
}

// Định nghĩa từng bước theo điểm vào
// fromPricing: Bước 1=PTService, 2=SelectPT, 3=Summary
// fromPT:      Bước 1=PTService, 2=Membership, 3=Summary
// direct:      Bước 1=Membership, 2=PTService, 3=SelectPT, 4=Summary
export type EntryPoint = 'fromPricing' | 'fromPT' | 'direct';

const useBooking = (initial?: BookingInitialState) => {
    // ── Xác định điểm vào ────────────────────────────────
    const entryPoint: EntryPoint = initial?.membership
        ? 'fromPricing'
        : initial?.pt
            ? 'fromPT'
            : 'direct';

    // ── Bước hiện tại ────────────────────────────────────
    const [currentStep, setCurrentStep] = useState(1);

    // ── Lựa chọn của user ────────────────────────────────
    const [selectedMembership, setSelectedMembership] = useState<Membership | null>(
        initial?.membership ?? null // đã có nếu từ PricingCard
    );
    const [selectedPTService, setSelectedPTService] = useState<PTService | null>(null);
    const [selectedPT, setSelectedPT] = useState<PT | null>(
        initial?.pt ?? null // đã có nếu từ PTDetailPage
    );

    // ── Kết quả booking ──────────────────────────────────
    const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ── Tính tổng tiền ───────────────────────────────────
    const calcTotalPrice = (): number => {
        if (!selectedMembership) return 0;
        const membershipPrice = selectedMembership.priceOnline;
        const ptPrice = selectedPTService
            ? selectedPTService.pricePerMonth * selectedMembership.durationMonths
            : 0;
        return membershipPrice + ptPrice;
    };

    // ── Số bước tối đa theo điểm vào ────────────────────
    const maxSteps = entryPoint === 'direct' ? 4 : 3;

    // Quay lại bước trước
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    // ── Các handler theo từng bước ───────────────────────

    // Chọn gói tập (dùng khi direct hoặc fromPT)
    const handleSelectMembership = (membership: Membership) => {
        setSelectedMembership(membership);
        setCurrentStep(prev => prev + 1);
    };

    // Chọn gói dịch vụ PT
    const handleSelectPTService = (ptService: PTService) => {
        setSelectedPTService(ptService);

        if (ptService.type === 'none') {
            // Không chọn PT → bỏ qua bước chọn PT, qua thẳng Summary
            setSelectedPT(null);
            setCurrentStep(maxSteps); // bước cuối = Summary
        } else if (entryPoint === 'fromPT') {
            // Đã có PT → không cần chọn PT nữa, qua Membership
            setCurrentStep(prev => prev + 1);
        } else {
            // fromPricing hoặc direct → qua bước chọn PT
            setCurrentStep(prev => prev + 1);
        }
    };

    // Chọn PT cụ thể
    const handleSelectPT = (pt: PT) => {
        setSelectedPT(pt);
        setCurrentStep(maxSteps); // luôn qua Summary sau khi chọn PT
    };

    // Xác nhận đặt lịch → gọi BE
    const handleConfirmBooking = async () => {
        if (!selectedMembership || !selectedPTService) return;

        setLoading(true);
        setError(null);
        try {
            const result = await bookingService.createBooking({
                membershipId: selectedMembership.id!,
                ptServiceId: selectedPTService.id!,
                ptId: selectedPT?.id || '',
            });
            setBookingResult(result);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        // State
        currentStep,
        maxSteps,
        entryPoint,
        selectedMembership,
        selectedPTService,
        selectedPT,
        bookingResult,
        loading,
        error,

        // Computed
        totalPrice: calcTotalPrice(),

        // Actions
        handleSelectMembership,
        handleSelectPTService,
        handleSelectPT,
        handleConfirmBooking,
        prevStep,
    };
};

export default useBooking;