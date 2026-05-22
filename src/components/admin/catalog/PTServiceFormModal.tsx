// src/components/admin/catalog/PTServiceFormModal.tsx
import React from 'react';
import { FormModal, FormField, FormInput } from './CatalogShared';
import { PTServiceFormData } from '../../../hooks/useAdminPTServices';

interface PTServiceFormModalProps {
    isOpen: boolean;
    isEditing: boolean;
    formData: PTServiceFormData;
    isLoading: boolean;
    onClose: () => void;
    onSubmit: () => void;
    updateField: <K extends keyof PTServiceFormData>(
        field: K,
        value: PTServiceFormData[K]
    ) => void;
}

const PT_SERVICE_TYPES = [
    { value: 'basic', label: 'Cơ bản' },
    { value: 'standard', label: 'Tiêu chuẩn' },
    { value: 'premium', label: 'Cao cấp' },
];

const PTServiceFormModal: React.FC<PTServiceFormModalProps> = ({
                                                                   isOpen,
                                                                   isEditing,
                                                                   formData,
                                                                   isLoading,
                                                                   onClose,
                                                                   onSubmit,
                                                                   updateField,
                                                               }) => (
    <FormModal
        isOpen={isOpen}
        title={isEditing ? 'Sửa dịch vụ PT' : 'Thêm dịch vụ PT mới'}
        onClose={onClose}
        onSubmit={onSubmit}
        isLoading={isLoading}
        submitLabel={isEditing ? 'Cập nhật' : 'Tạo mới'}
    >
        {/* Tên dịch vụ */}
        <FormField label="Tên dịch vụ" required>
            <FormInput
                type="text"
                placeholder="VD: PT Basic 1 buổi/tuần"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
            />
        </FormField>

        {/* Loại dịch vụ — dropdown */}
        <FormField label="Loại dịch vụ">
            <select
                className="catalog-form-input"
                value={formData.type}
                onChange={(e) => updateField('type', e.target.value)}
            >
                <option value="" disabled>Chọn loại...</option>
                {PT_SERVICE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                ))}
            </select>
        </FormField>

        {/* Giá / tháng */}
        <FormField label="Giá mỗi tháng (VNĐ)" required>
            <FormInput
                type="number"
                min={0}
                placeholder="2000000"
                value={formData.pricePerMonth || ''}
                onChange={(e) => updateField('pricePerMonth', Number(e.target.value))}
            />
        </FormField>
    </FormModal>
);

export default PTServiceFormModal;