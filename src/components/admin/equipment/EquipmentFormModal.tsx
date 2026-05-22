import React from 'react';
import { Floor, Zone } from '../../../types/models';
import { EquipmentFormData } from '../../../hooks/useAdminEquipment';

interface EquipmentFormModalProps {
    mode: 'create' | 'edit';
    formData: EquipmentFormData;
    isLoading: boolean;
    error: string | null;
    onChange: (field: keyof EquipmentFormData, value: any) => void;
    onSubmit: () => void;
    onClose: () => void;
    floors: Floor[];
    zones: Zone[];
    categoryOptions: string[];
    subCategoryOptions: string[];
    uploadingImages: boolean;
    onUploadImages: (files: FileList | null) => void;
    onRemoveImage: (index: number) => void;
}

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode; hint?: string }> =
    ({ label, required, children, hint }) => (
        <div className="eq-field">
            <label className="eq-field__label">{label}{required && <span className="eq-field__required"> *</span>}</label>
            {children}
            {hint && <p className="eq-field__hint">{hint}</p>}
        </div>
    );

const EquipmentFormModal: React.FC<EquipmentFormModalProps> = ({
                                                                   mode, formData, isLoading, error, onChange, onSubmit, onClose,
                                                                   floors, zones, categoryOptions, subCategoryOptions,
                                                                   uploadingImages, onUploadImages, onRemoveImage,
                                                               }) => {
    const isEdit = mode === 'edit';
    const title = isEdit ? '✏️ Sửa thiết bị' : '➕ Thêm thiết bị mới';

    const handleText = (field: keyof EquipmentFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        onChange(field, e.target.value);

    const handleCommaList = (field: keyof EquipmentFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
        onChange(field, arr);
    };

    const arrayToString = (arr: string[]) => arr.join(', ');

    return (
        <div className="eq-modal-overlay" onClick={onClose}>
            <div className="eq-modal-box" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className="eq-modal-header">
                    <h2 className="eq-modal-title">{title}</h2>
                    <button className="eq-modal-close" onClick={onClose} disabled={isLoading}>✕</button>
                </div>

                {error && <p className="eq-alert eq-alert--error">⚠️ {error}</p>}

                <div className="eq-modal-body">
                    {/* Thông tin cơ bản */}
                    <p className="eq-form-section-title">Thông tin cơ bản</p>
                    <Field label="Tên tiếng Anh" required>
                        <input className="eq-input" value={formData.name} onChange={handleText('name')} />
                    </Field>
                    <Field label="Tên tiếng Việt" required>
                        <input className="eq-input" value={formData.nameVi} onChange={handleText('nameVi')} />
                    </Field>
                    <Field label="Mô tả">
                        <textarea className="eq-input eq-input--textarea" rows={3} value={formData.description} onChange={handleText('description')} />
                    </Field>

                    {/* Phân loại */}
                    <p className="eq-form-section-title">Phân loại</p>
                    <Field label="Danh mục (Category)" required>
                        <input className="eq-input" list="category-list" value={formData.category} onChange={handleText('category')} />
                        <datalist id="category-list">{categoryOptions.map(opt => <option key={opt} value={opt} />)}</datalist>
                    </Field>
                    <Field label="Danh mục phụ (Sub-category)">
                        <input className="eq-input" list="subcategory-list" value={formData.subCategory} onChange={handleText('subCategory')} />
                        <datalist id="subcategory-list">{subCategoryOptions.map(opt => <option key={opt} value={opt} />)}</datalist>
                    </Field>
                    <Field label="Nhóm cơ" hint="Nhập cách nhau dấu phẩy. VD: Ngực, Vai, Tay">
                        <input className="eq-input" value={arrayToString(formData.muscleGroups)} onChange={handleCommaList('muscleGroups')} />
                    </Field>

                    {/* Vị trí & số lượng */}
                    <p className="eq-form-section-title">Vị trí & Số lượng</p>
                    <Field label="Gym ID" required>
                        <input className="eq-input" value={formData.gymId} disabled />
                    </Field>
                    <Field label="Floor ID" required>
                        <select className="eq-input" value={formData.floorId} onChange={(e) => onChange('floorId', e.target.value)}>
                            <option value="">-- Chọn tầng --</option>
                            {floors.map(floor => <option key={floor.id} value={floor.id}>{floor.name} ({floor.id})</option>)}
                        </select>
                    </Field>
                    <Field label="Zone ID" required>
                        <select className="eq-input" value={formData.zoneId} onChange={(e) => onChange('zoneId', e.target.value)}>
                            <option value="">-- Chọn khu vực --</option>
                            {zones.map(zone => <option key={zone.id} value={zone.id}>{zone.name} ({zone.id})</option>)}
                        </select>
                    </Field>
                    <div className="eq-form-row">
                        <Field label="Số lượng" required>
                            <input type="number" min={1} className="eq-input" value={formData.quantity} onChange={(e) => onChange('quantity', Number(e.target.value))} />
                        </Field>
                        <Field label="Trạng thái">
                            <select className="eq-input" value={String(formData.isActive)} onChange={(e) => onChange('isActive', e.target.value === 'true')}>
                                <option value="true">Đang hoạt động</option>
                                <option value="false">Ngừng sử dụng</option>
                            </select>
                        </Field>
                    </div>

                    {/* Hình ảnh */}
                    <p className="eq-form-section-title">Hình ảnh</p>
                    <Field label="Upload ảnh" hint="Có thể chọn nhiều ảnh">
                        <div className="image-upload-wrapper">
                            <label className="custom-file-upload">
                                📁 Chọn ảnh
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => onUploadImages(e.target.files)}
                                    disabled={uploadingImages}
                                />
                            </label>
                            {uploadingImages && (
                                <div className="uploading-text">
                                    <span>⏳ Đang upload...</span>
                                </div>
                            )}
                        </div>
                        {formData.imageUrls.length > 0 && (
                            <div className="image-preview-list">
                                {formData.imageUrls.map((url, idx) => (
                                    <div key={idx} className="image-preview">
                                        <img src={url} alt={`preview-${idx}`} />
                                        <button type="button" onClick={() => onRemoveImage(idx)}>✕</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Field>

                    {/* Mẹo sử dụng */}
                    <Field label="Mẹo sử dụng (Tips)">
                        <textarea className="eq-input eq-input--textarea" rows={3} value={formData.tips} onChange={handleText('tips')} />
                    </Field>
                </div>

                <div className="eq-modal-footer">
                    <button className="eq-btn eq-btn--ghost" onClick={onClose} disabled={isLoading}>Huỷ</button>
                    <button className="eq-btn eq-btn--primary" onClick={onSubmit} disabled={isLoading || !formData.name || !formData.nameVi}>
                        {isLoading ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo thiết bị'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EquipmentFormModal;