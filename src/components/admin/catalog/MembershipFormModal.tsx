// src/components/admin/catalog/MembershipFormModal.tsx
import React from 'react';
import { FormModal, FormField, FormInput, FormTextarea } from './CatalogShared';
import { MembershipFormData } from '../../../hooks/useAdminMemberships';

interface MembershipFormModalProps {
    isOpen: boolean;
    isEditing: boolean;
    formData: MembershipFormData;
    isLoading: boolean;
    onClose: () => void;
    onSubmit: () => void;
    updateField: <K extends keyof MembershipFormData>(
        field: K,
        value: MembershipFormData[K]
    ) => void;
}

const MembershipFormModal: React.FC<MembershipFormModalProps> = ({
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
        title={isEditing ? 'Sửa gói tập' : 'Thêm gói tập mới'}
        onClose={onClose}
        onSubmit={onSubmit}
        isLoading={isLoading}
        submitLabel={isEditing ? 'Cập nhật' : 'Tạo mới'}
    >
        {/* Tên gói */}
        <FormField label="Tên gói tập" required>
            <FormInput
                type="text"
                placeholder="VD: Gói 3 tháng Vip"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
            />
        </FormField>

        {/* Thời hạn + Giá (2 cột) */}
        <div className="catalog-form-row2">
            <FormField label="Thời hạn (tháng)" required>
                <FormInput
                    type="number"
                    min={1}
                    placeholder="3"
                    value={formData.durationMonths || ''}
                    onChange={(e) => updateField('durationMonths', Number(e.target.value))}
                />
            </FormField>
            <FormField label="Giá (VNĐ)" required>
                <FormInput
                    type="number"
                    min={0}
                    placeholder="1500000"
                    value={formData.price || ''}
                    onChange={(e) => updateField('price', Number(e.target.value))}
                />
            </FormField>
        </div>

        {/* Giá online */}
        <FormField label="Giá online (VNĐ)" hint="Để trống nếu bằng giá thường">
            <FormInput
                type="number"
                min={0}
                placeholder="1200000"
                value={formData.priceOnline || ''}
                onChange={(e) => updateField('priceOnline', Number(e.target.value))}
            />
        </FormField>

        {/* Ghi chú */}
        <FormField label="Ghi chú">
            <FormTextarea
                rows={3}
                placeholder="Mô tả ngắn về gói tập..."
                value={formData.note}
                onChange={(e) => updateField('note', e.target.value)}
            />
        </FormField>

        {/* Khuyến mãi — nhập từng dòng */}
        <FormField label="Khuyến mãi kèm theo" hint="Mỗi dòng là 1 ưu đãi">
            <FormTextarea
                rows={3}
                placeholder="Tặng áo gym\nMiễn phí tủ đồ"
                value={formData.promotions.join('\n')}
                onChange={(e) =>
                    updateField(
                        'promotions',
                        e.target.value
                            .split('\n')
                            .map((s) => s.trim())
                            .filter(Boolean)
                    )
                }
            />
        </FormField>

        {/* Checkbox Phổ biến */}
        <label className="catalog-checkbox-row">
            <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={(e) => updateField('isPopular', e.target.checked)}
            />
            <span>Đánh dấu là gói phổ biến 🔥</span>
        </label>
    </FormModal>
);

export default MembershipFormModal;