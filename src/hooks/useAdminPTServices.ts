// src/hooks/admin/useAdminPTServices.ts
//
// Hook tách logic UI cho trang quản lý dịch vụ PT.
// Pattern tương tự useAdminMemberships nhưng cho PTService.

import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/index';
import { PTService } from '../types/models';
import {
    fetchPTServices,
    createPTService,
    updatePTService,
    deletePTService,
    clearError,
} from '../store/admin/adminCatalogSlice';

// ─── TYPES ───────────────────────────────────────────────────────────────────

/** Dữ liệu form khi tạo / sửa dịch vụ PT */
export interface PTServiceFormData {
    name: string;
    pricePerMonth: number;
    // PTService.type là optional (type?) trong models.ts → để trống = không chọn loại
    type: string;
}

const DEFAULT_FORM: PTServiceFormData = {
    name: '',
    pricePerMonth: 0,
    type: '', // rỗng = chưa chọn loại
};

// ─── HOOK ────────────────────────────────────────────────────────────────────

export function useAdminPTServices() {
    const dispatch = useDispatch<AppDispatch>();

    const { ptServices, isLoading, error } = useSelector(
        (state: RootState) => state.adminCatalog
    );

    const [editingItem, setEditingItem] = useState<PTService | 'new' | null>(null);
    const [formData, setFormData] = useState<PTServiceFormData>(DEFAULT_FORM);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Load dữ liệu khi mount
    useEffect(() => {
        dispatch(fetchPTServices());
    }, [dispatch]);

    const openCreateModal = useCallback(() => {
        setFormData(DEFAULT_FORM);
        setEditingItem('new');
    }, []);

    const openEditModal = useCallback((item: PTService) => {
        setFormData({
            name: item.name,
            pricePerMonth: item.pricePerMonth,
            type: item.type ?? '', // PTService.type là optional (type?) nên fallback về ''
        });
        setEditingItem(item);
    }, []);

    const closeModal = useCallback(() => {
        setEditingItem(null);
        dispatch(clearError());
    }, [dispatch]);

    const handleSubmit = useCallback(async () => {
        if (editingItem === 'new') {
            await dispatch(createPTService(formData));
        } else if (editingItem) {
            // editingItem.id là id? nhưng khi đang sửa thì server đã trả id
            await dispatch(updatePTService({ id: editingItem.id!, data: formData }));
        }
        closeModal();
    }, [dispatch, editingItem, formData, closeModal]);

    const handleDeleteConfirm = useCallback(async () => {
        if (!deletingId) return;
        await dispatch(deletePTService(deletingId));
        setDeletingId(null);
    }, [dispatch, deletingId]);

    const updateField = useCallback(
        <K extends keyof PTServiceFormData>(field: K, value: PTServiceFormData[K]) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
        },
        []
    );

    return {
        ptServices,
        isLoading,
        error,
        editingItem,
        formData,
        openCreateModal,
        openEditModal,
        closeModal,
        updateField,
        handleSubmit,
        deletingId,
        setDeletingId,
        handleDeleteConfirm,
    };
}