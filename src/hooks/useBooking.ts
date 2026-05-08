// src/hooks/useBooking.ts
// Hook quản lý state trang đặt lịch dạng single page
// Hỗ trợ 3 điểm vào: direct, fromPricing, fromPT

import { useState, useEffect } from 'react';
import { Membership, PTService, PT } from '../types/models';
import { bookingService } from '../services/bookingService';

interface BookingResult {
    bookingId: string;
    paymentCode: string;
    qrImageUrl: string;
    totalPrice: number;
}

interface BookingInitialState {
    membership?: Membership; // từ PricingCard
    pt?: PT;                 // từ PTDetailPage
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

    // ── Data từ BE/mock ───────────────────────────────────
    const [ptServices, setPTServices] = useState<PTService[]>([]);
    const [availablePTs, setAvailablePTs] = useState<PT[]>([]);
    const [loadingPTServices, setLoadingPTServices] = useState(true);
    const [loadingPTs, setLoadingPTs] = useState(false);

    // ── Kết quả booking ──────────────────────────────────
    const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
    const [loadingBooking, setLoadingBooking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ── Fetch PT services khi mount ───────────────────────
    useEffect(() => {
        bookingService.getPTServices()
            .then(data => setPTServices(data.ptServices))
            .catch(err => console.error('Lỗi lấy PT services:', err))
            .finally(() => setLoadingPTServices(false));
    }, []);

    // ── Fetch danh sách PT khi chọn có PT ────────────────
    useEffect(() => {
        // Chỉ fetch khi chọn gói có PT (không phải 'none')
        if (!selectedPTService || selectedPTService.type === 'none') {
            setAvailablePTs([]);
            return;
        }
        setLoadingPTs(true);
        bookingService.getAvailablePTs()
            .then(data => setAvailablePTs(data.pts))
            .catch(err => console.error('Lỗi lấy danh sách PT:', err))
            .finally(() => setLoadingPTs(false));
    }, [selectedPTService]);

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
        // Nếu chọn có PT thì phải chọn PT cụ thể
        if (selectedPTService.type !== 'none' && !selectedPT) return false;
        return true;
    };

    // ── Handlers ─────────────────────────────────────────

    const handleSelectMembership = (membership: Membership) => {
        setSelectedMembership(membership);
    };

    const handleSelectPTService = (ptService: PTService) => {
        setSelectedPTService(ptService);
        // Nếu đổi sang "Không PT" → bỏ PT đã chọn
        // Nếu đến từ PTDetailPage và chọn 'none' → bỏ PT đã chọn luôn
        if (ptService.type === 'none') {
            setSelectedPT(null);
        }
        // Nếu đến từ PTDetailPage và đổi sang gói khác → giữ PT đã chọn
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
            setBookingResult(result);
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

        // Data
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