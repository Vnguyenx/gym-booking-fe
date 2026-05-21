// src/components/admin/bookings/BookingCreateModal.tsx
//
// Modal tạo booking walk-in / cash.
// Admin chọn từ dropdown (không gõ ID thô).
// Tự tính totalPrice = membership.price + ptService.pricePerMonth * durationMonths

import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector }             from 'react-redux';
import { AppDispatch, RootState }               from '../../../store';
import { createAdminBooking, clearCreateError } from '../../../store/admin/adminBookingSlice';
import * as adminService                        from '../../../services/adminService';
import { UserProfile, Membership, PTService, PT } from '../../../types/models';
import '../../../styles/admin/AdminBookings.css';

interface BookingCreateModalProps {
    isOpen:  boolean;
    onClose: () => void;
}

const BookingCreateModal: React.FC<BookingCreateModalProps> = ({ isOpen, onClose }) => {
    const dispatch    = useDispatch<AppDispatch>();
    const { creating, createError } = useSelector((s: RootState) => s.adminBooking);

    // ── Dropdown data ─────────────────────────────────────────────────────────
    const [users,       setUsers]       = useState<UserProfile[]>([]);
    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [ptServices,  setPtServices]  = useState<PTService[]>([]);
    const [pts,         setPts]         = useState<PT[]>([]);
    const [loadingData, setLoadingData] = useState(false);

    // ── Form state ────────────────────────────────────────────────────────────
    const [customerId,   setCustomerId]   = useState('');
    const [membershipId, setMembershipId] = useState('');
    const [ptServiceId,  setPtServiceId]  = useState('pt-none');
    const [ptId,         setPtId]         = useState('');
    const [userSearch,   setUserSearch]   = useState('');

    // ── Load dropdown data khi modal mở ──────────────────────────────────────
    useEffect(() => {
        if (!isOpen) return;
        setLoadingData(true);
        Promise.all([
            adminService.fetchUsers(),
            adminService.fetchMemberships(),
            adminService.fetchPTServices(),
            adminService.fetchPTs(),
        ]).then(([u, m, ps, p]) => {
            setUsers(u.users);
            setMemberships(m.memberships);
            setPtServices(ps.ptServices);
            setPts(p.pts);
        }).catch(console.error)
            .finally(() => setLoadingData(false));
    }, [isOpen]);

    // ── Reset form khi đóng ───────────────────────────────────────────────────
    useEffect(() => {
        if (!isOpen) {
            setCustomerId('');
            setMembershipId('');
            setPtServiceId('pt-none');
            setPtId('');
            setUserSearch('');
            dispatch(clearCreateError());
        }
    }, [isOpen, dispatch]);

    // ── Reset ptId khi đổi sang pt-none ──────────────────────────────────────
    useEffect(() => {
        if (ptServiceId === 'pt-none') setPtId('');
    }, [ptServiceId]);

    // ── Tính tổng tiền tự động ────────────────────────────────────────────────
    const totalPrice = useMemo(() => {
        const mem = memberships.find(m => m.id === membershipId);
        const svc = ptServices.find(s => s.id === ptServiceId);
        if (!mem) return 0;
        const membershipPrice = mem.price;
        const ptPrice = (svc && ptServiceId !== 'pt-none')
            ? svc.pricePerMonth * mem.durationMonths
            : 0;
        return membershipPrice + ptPrice;
    }, [membershipId, ptServiceId, memberships, ptServices]);

    // ── Filter user theo search ───────────────────────────────────────────────
    const filteredUsers = useMemo(() => {
        const q = userSearch.toLowerCase().trim();
        if (!q) return users.filter(u => u.role === 'pt' || u.role === ('customer' as any));
        return users.filter(u =>
            (u.role === 'pt' || u.role === ('customer' as any)) &&
            (u.displayName?.toLowerCase().includes(q) ||
                u.phone?.includes(q) ||
                u.email?.toLowerCase().includes(q))
        );
    }, [users, userSearch]);

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!customerId || !membershipId || !ptServiceId) return;
        if (ptServiceId !== 'pt-none' && !ptId) return;

        const result = await dispatch(createAdminBooking({
            customerId,
            membershipId,
            ptServiceId,
            ptId: ptId || undefined,
            totalPrice,
        }));

        if (createAdminBooking.fulfilled.match(result)) {
            onClose();
        }
    };

    const needsPt      = ptServiceId !== 'pt-none';
    const canSubmit    = !!customerId && !!membershipId && !!ptServiceId &&
        (!needsPt || !!ptId) && !creating;
    const selectedUser = users.find(u => u.uid === customerId);

    if (!isOpen) return null;

    return (
        <div className="ab-modal-overlay" onClick={onClose}>
            <div className="ab-modal-box ab-create-modal" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="ab-create-modal-header">
                    <h3 className="ab-modal-title">＋ Tạo đơn Walk-in / Cash</h3>
                    <button className="ab-create-modal-close" onClick={onClose}>✕</button>
                </div>

                {loadingData ? (
                    <div className="ab-create-loading">⏳ Đang tải dữ liệu...</div>
                ) : (
                    <div className="ab-create-form">

                        {/* 1. Khách hàng */}
                        <div className="ab-form-group">
                            <label className="ab-form-label">Khách hàng <span className="ab-form-required">*</span></label>
                            <input
                                className="ab-form-input"
                                placeholder="Tìm theo tên, SĐT, email..."
                                value={userSearch}
                                onChange={e => {
                                    setUserSearch(e.target.value);
                                    setCustomerId(''); // reset khi gõ lại
                                }}
                            />
                            {userSearch && !customerId && (
                                <div className="ab-form-dropdown">
                                    {filteredUsers.length === 0 ? (
                                        <div className="ab-form-dropdown-empty">Không tìm thấy</div>
                                    ) : (
                                        filteredUsers.slice(0, 8).map(u => (
                                            <div
                                                key={u.uid}
                                                className="ab-form-dropdown-item"
                                                onClick={() => {
                                                    setCustomerId(u.uid);
                                                    setUserSearch(u.displayName || u.email);
                                                }}
                                            >
                                                <strong>{u.displayName}</strong>
                                                <span className="ab-form-dropdown-sub">{u.phone} · {u.email}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                            {selectedUser && (
                                <div className="ab-form-selected-tag">
                                    ✓ {selectedUser.displayName}
                                    <span className="ab-form-dropdown-sub"> · {selectedUser.phone}</span>
                                </div>
                            )}
                        </div>

                        {/* 2. Gói tập */}
                        <div className="ab-form-group">
                            <label className="ab-form-label">Gói tập <span className="ab-form-required">*</span></label>
                            <select
                                className="ab-form-select"
                                value={membershipId}
                                onChange={e => setMembershipId(e.target.value)}
                            >
                                <option value="">-- Chọn gói tập --</option>
                                {memberships.map(m => (
                                    <option key={m.id} value={m.id}>
                                        {m.name} — {m.durationMonths} tháng — {m.price.toLocaleString('vi-VN')}₫
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 3. Dịch vụ PT */}
                        <div className="ab-form-group">
                            <label className="ab-form-label">Dịch vụ PT <span className="ab-form-required">*</span></label>
                            <select
                                className="ab-form-select"
                                value={ptServiceId}
                                onChange={e => setPtServiceId(e.target.value)}
                            >
                                {ptServices.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                        {s.type !== 'none' ? ` — +${s.pricePerMonth.toLocaleString('vi-VN')}₫/tháng` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 4. Chọn PT (chỉ hiện khi cần) */}
                        {needsPt && (
                            <div className="ab-form-group">
                                <label className="ab-form-label">Huấn luyện viên <span className="ab-form-required">*</span></label>
                                <select
                                    className="ab-form-select"
                                    value={ptId}
                                    onChange={e => setPtId(e.target.value)}
                                >
                                    <option value="">-- Chọn PT --</option>
                                    {pts.filter(p => p.isAvailable).map(p => (
                                        <option key={p.id} value={p.id!}>
                                            {p.fullName}
                                            {p.specialty?.length ? ` · ${p.specialty[0]}` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* 5. Tổng tiền (tự tính, read-only) */}
                        <div className="ab-form-group">
                            <label className="ab-form-label">Tổng tiền</label>
                            <div className="ab-form-price-display">
                                {totalPrice > 0
                                    ? totalPrice.toLocaleString('vi-VN') + ' ₫'
                                    : <span className="ab-td--muted">Chọn gói để tính</span>
                                }
                            </div>
                        </div>

                        {/* Error */}
                        {createError && (
                            <div className="ab-create-error">⚠️ {createError}</div>
                        )}

                        {/* Actions */}
                        <div className="ab-modal-actions ab-create-actions">
                            <button className="ab-modal-btn-cancel" onClick={onClose}>
                                Huỷ
                            </button>
                            <button
                                className="ab-modal-btn-confirm ab-modal-btn-confirm--approve"
                                disabled={!canSubmit}
                                onClick={handleSubmit}
                            >
                                {creating ? 'Đang tạo...' : '✓ Tạo đơn'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingCreateModal;