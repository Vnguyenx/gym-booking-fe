// src/hooks/admin/useAdminMemberships.ts
//
// Hook tách logic UI khỏi component.
// Component chỉ cần gọi hook này, không cần biết về Redux hay API.
//
// Bao gồm:
//   - Load dữ liệu khi mount
//   - Quản lý trạng thái modal (thêm / sửa)
//   - Xác nhận xoá
//   - Submit form

import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/index';
import { Membership } from '../types/models';
import {
    fetchMemberships,
    createMembership,
    updateMembership,
    deleteMembership,
    clearError,
} from '../store/admin/adminCatalogSlice';

// ─── TYPES ───────────────────────────────────────────────────────────────────

/** Dữ liệu form khi tạo / sửa gói tập */
export interface MembershipFormData {
    name: string;
    durationMonths: number;
    price: number;
    priceOnline: number;
    note: string;
    isPopular: boolean;
    promotions: string[];
}

/** Giá trị mặc định khi mở form tạo mới */
const DEFAULT_FORM: MembershipFormData = {
    name: '',
    durationMonths: 1,
    price: 0,
    priceOnline: 0,
    note: '',
    isPopular: false,
    promotions: [],
};

// ─── HOOK ────────────────────────────────────────────────────────────────────

export function useAdminMemberships() {
    const dispatch = useDispatch<AppDispatch>();

    // Lấy dữ liệu từ Redux store
    const { memberships, isLoading, error } = useSelector(
        (state: RootState) => state.adminCatalog
    );

    // ── Modal state ──────────────────────────────────────────────────────────
    // null = đóng modal | object = đang sửa item đó | 'new' = tạo mới
    const [editingItem, setEditingItem] = useState<Membership | 'new' | null>(null);

    // Dữ liệu trong form
    const [formData, setFormData] = useState<MembershipFormData>(DEFAULT_FORM);

    // id đang chờ xác nhận xoá (hiện confirm dialog)
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // ── Load dữ liệu lần đầu ─────────────────────────────────────────────────
    useEffect(() => {
        dispatch(fetchMemberships());
    }, [dispatch]);

    // ── Mở form tạo mới ──────────────────────────────────────────────────────
    const openCreateModal = useCallback(() => {
        setFormData(DEFAULT_FORM);
        setEditingItem('new');
    }, []);

    // ── Mở form sửa ─────────────────────────────────────────────────────────
    const openEditModal = useCallback((item: Membership) => {
        setFormData({
            name: item.name,
            durationMonths: item.durationMonths,
            price: item.price,
            priceOnline: item.priceOnline ?? item.price,
            note: item.note ?? '',
            isPopular: item.isPopular ?? false,
            promotions: item.promotions ?? [],
        });
        setEditingItem(item);
    }, []);

    // ── Đóng modal ───────────────────────────────────────────────────────────
    const closeModal = useCallback(() => {
        setEditingItem(null);
        dispatch(clearError());
    }, [dispatch]);

    // ── Submit form (tạo hoặc sửa) ───────────────────────────────────────────
    const handleSubmit = useCallback(async () => {
        if (editingItem === 'new') {
            // Tạo mới
            await dispatch(createMembership(formData));
        } else if (editingItem) {
            // Sửa
            // editingItem.id là id? nhưng khi đang sửa thì server đã trả id
            await dispatch(updateMembership({ id: editingItem.id!, data: formData }));
        }
        closeModal();
    }, [dispatch, editingItem, formData, closeModal]);

    // ── Xoá ─────────────────────────────────────────────────────────────────
    const handleDeleteConfirm = useCallback(async () => {
        if (!deletingId) return;
        await dispatch(deleteMembership(deletingId));
        setDeletingId(null);
    }, [dispatch, deletingId]);

    // ── Cập nhật từng field trong form ───────────────────────────────────────
    const updateField = useCallback(
        <K extends keyof MembershipFormData>(field: K, value: MembershipFormData[K]) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
        },
        []
    );

    return {
        // Dữ liệu
        memberships,
        isLoading,
        error,

        // Modal
        editingItem,
        formData,
        openCreateModal,
        openEditModal,
        closeModal,
        updateField,
        handleSubmit,

        // Xoá
        deletingId,
        setDeletingId,
        handleDeleteConfirm,
    };
}