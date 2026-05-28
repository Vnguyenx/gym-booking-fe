// src/hooks/useBooking.ts
// Hook quản lý state trang đặt lịch dạng single page
// Hỗ trợ 3 điểm vào: direct, fromPricing, fromPT
// Data lấy từ Redux store thay vì fetch trực tiếp từ BE

import { useState } from 'react';
import { Membership, PTService, PT } from '../types/models';
import { bookingService } from '../services/bookingService';
import usePTServiceData from './usePTServiceData';
import usePTData from './usePTData';

export type PaymentMethod = 'vnpay' | 'qr';

interface BookingResult {
    bookingId: string;
    paymentUrl: string;   // link VNPay
    totalPrice: number;
}

export interface QRData {
    bookingId: string;
    qrUrl: string;
    paymentCode: string;
    totalPrice: number;
    accountNo: string;
    accountName: string;
    bankId: string;
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

    // ── Phương thức thanh toán ───────────────────────────
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vnpay');

    // ── Kết quả booking ──────────────────────────────────
    const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
    const [loadingBooking, setLoadingBooking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ── QR Modal ─────────────────────────────────────────
    const [qrData, setQrData] = useState<QRData | null>(null);
    const [showQRModal, setShowQRModal] = useState(false);

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
        if (ptService.type === 'none') {
            setSelectedPT(null);
        }
    };

    const handleSelectPT = (pt: PT) => {
        if (selectedPT?.id === pt.id) {
            setSelectedPT(null);
        } else {
            setSelectedPT(pt);
        }
    };

    // Xác nhận đặt lịch — VNPay: redirect cổng thanh toán
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

            window.location.href = result.paymentUrl;

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoadingBooking(false);
        }
    };

    // Xác nhận đặt lịch — QR: gọi BE lấy QR rồi hiện modal
    const handleConfirmQR = async () => {
        if (!canCheckout() || !selectedMembership || !selectedPTService) return;

        setLoadingBooking(true);
        setError(null);
        try {
            const result = await bookingService.createBookingQR({
                membershipId: selectedMembership.id!,
                ptServiceId: selectedPTService.id!,
                ptId: selectedPT?.id || '',
            });

            setQrData(result);
            setShowQRModal(true);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoadingBooking(false);
        }
    };

    const handleCloseQRModal = () => {
        setShowQRModal(false);
        setQrData(null);
    };

    return {
        // Điểm vào
        entryPoint,

        // Lựa chọn
        selectedMembership,
        selectedPTService,
        selectedPT,

        // Phương thức thanh toán
        paymentMethod,
        setPaymentMethod,

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

        // QR Modal
        qrData,
        showQRModal,
        handleCloseQRModal,

        // Computed
        totalPrice: calcTotalPrice(),
        canCheckout: canCheckout(),

        // Actions
        handleSelectMembership,
        handleSelectPTService,
        handleSelectPT,
        handleConfirmBooking,
        handleConfirmQR,
    };
};

export default useBooking;