// src/hooks/useBooking.ts
// Hook quản lý state trang đặt lịch dạng single page
// Hỗ trợ 3 điểm vào: direct, fromPricing, fromPT
// Data lấy từ Redux store thay vì fetch trực tiếp từ BE

import { useState } from 'react';
import { Membership, PTService, PT } from '../types/models';
import { bookingService } from '../services/bookingService';
import usePTServiceData from './usePTServiceData';
import usePTData from './usePTData';

interface BookingResult {
    bookingId: string;
    paymentUrl: string;   // link VNPay
    totalPrice: number;
}

interface BookingInitialState {
    membership?: Membership;
    pt?: PT;
}

export type EntryPoint = 'fromPricing' | 'fromPT' | 'direct';

const useBooking = (initial?: BookingInitialState) => {
    // ── Xác định điểm vào ────────────────────────────────
    const entryPoint: EntryPoint = initial?.membership
        ? 'fromPricing'
        : initial?.pt
            ? 'fromPT'
            : 'direct';

    // ── Lựa chọn của user ────────────────────────────────
    const [selectedMembership, setSelectedMembership] = useState<Membership | null>(
        initial?.membership ?? null
    );
    const [selectedPTService, setSelectedPTService] = useState<PTService | null>(null);
    const [selectedPT, setSelectedPT] = useState<PT | null>(
        initial?.pt ?? null
    );

    // ── Kết quả booking ──────────────────────────────────
    const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
    const [loadingBooking, setLoadingBooking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ── Data từ Redux (không fetch trực tiếp từ BE nữa) ──
    const { ptServices, loading: loadingPTServices } = usePTServiceData();
    const { pts: allPTs, loading: loadingPTs } = usePTData();

    // Lọc PT available — chỉ hiện khi chọn gói có PT
    const availablePTs: PT[] = selectedPTService && selectedPTService.type !== 'none'
        ? allPTs.filter(pt => pt.isAvailable)
        : [];

    // ── Tính tổng tiền ───────────────────────────────────
    const calcTotalPrice = (): number => {
        if (!selectedMembership) return 0;
        const membershipPrice = selectedMembership.priceOnline;
        const ptPrice = selectedPTService && selectedPTService.type !== 'none'
            ? selectedPTService.pricePerMonth * selectedMembership.durationMonths
            : 0;
        return membershipPrice + ptPrice;
    };

    // ── Kiểm tra đủ điều kiện thanh toán ─────────────────
    const canCheckout = (): boolean => {
        if (!selectedMembership) return false;
        if (!selectedPTService) return false;
        if (selectedPTService.type !== 'none' && !selectedPT) return false;
        return true;
    };

    // ── Handlers ─────────────────────────────────────────

    const handleSelectMembership = (membership: Membership) => {
        setSelectedMembership(membership);
    };

    const handleSelectPTService = (ptService: PTService) => {
        setSelectedPTService(ptService);
        // Đổi sang "Không PT" → bỏ PT đã chọn
        if (ptService.type === 'none') {
            setSelectedPT(null);
        }
    };

    const handleSelectPT = (pt: PT) => {
        // Bấm lại PT đang chọn → bỏ chọn
        if (selectedPT?.id === pt.id) {
            setSelectedPT(null);
        } else {
            setSelectedPT(pt);
        }
    };

    // Xác nhận đặt lịch → gọi BE
    const handleConfirmBooking = async () => {
        if (!canCheckout() || !selectedMembership || !selectedPTService) return;

        setLoadingBooking(true);
        setError(null);
        try {
            const result = await bookingService.createBooking({
                membershipId: selectedMembership.id!,
                ptServiceId: selectedPTService.id!,
                ptId: selectedPT?.id || '',
            });

            // Redirect thẳng sang trang thanh toán VNPay
            window.location.href = result.paymentUrl;

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoadingBooking(false);
        }
    };

    return {
        // Điểm vào
        entryPoint,

        // Lựa chọn
        selectedMembership,
        selectedPTService,
        selectedPT,

        // Data từ Redux
        ptServices,
        availablePTs,

        // Loading
        loadingPTServices,
        loadingPTs,
        loadingBooking,

        // Kết quả
        bookingResult,
        error,

        // Computed
        totalPrice: calcTotalPrice(),
        canCheckout: canCheckout(),

        // Actions
        handleSelectMembership,
        handleSelectPTService,
        handleSelectPT,
        handleConfirmBooking,
    };
};

export default useBooking;