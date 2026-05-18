// src/components/pt/profile/ProfileEditForm.tsx
//
// Form chỉnh sửa hồ sơ PT — khớp đúng với BE updateProfile:
//   PUT /api/pt/profile → { bio, specialty[], experience, isAvailable }
//
// Các trường KHÔNG sửa được qua form này (do BE không cho):
//   fullName, email, phone, gender — hiển thị read-only để PT biết
//
// Tích hợp: avatar upload (uploadService), TagInput cho specialty[]

import React, { useRef } from 'react';
import { PTProfileFormData } from '../../../types/models';
import { PtProfileInfo }     from '../../../hooks/usePtProfile';
import ErrorToast            from '../notifications/ErrorToast';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProfileEditFormProps {
    formData:          PTProfileFormData;
    info:              PtProfileInfo;       // để hiển thị read-only fields
    isSaving:          boolean;
    saveError:         string | null;
    // Avatar
    avatarPreview:     string;
    isUploadingAvatar: boolean;
    onAvatarChange:    (file: File) => Promise<void>;
    // Handlers
    onFieldChange:     (field: keyof PTProfileFormData, value: string | boolean | string[]) => void;
    onSubmit:          () => void;
    onCancel:          () => void;
    onClearError:      () => void;
}

// ─── TagInput — nhập specialty[] từng tag ─────────────────────────────────────

const TagInput: React.FC<{
    tags:     string[];
    onChange: (tags: string[]) => void;
}> = ({ tags, onChange }) => {
    const [input, setInput] = React.useState('');

    const addTag = (raw: string) => {
        const tag = raw.trim();
        if (tag && !tags.includes(tag)) onChange([...tags, tag]);
        setInput('');
    };

    const removeTag = (tag: string) => onChange(tags.filter((t) => t !== tag));

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(input); }
        if (e.key === 'Backspace' && !input && tags.length > 0) onChange(tags.slice(0, -1));
    };

    return (
        <div className="tag-input">
            {tags.map((tag) => (
                <span key={tag} className="tag-input__tag">
                    {tag}
                    <button type="button" className="tag-input__remove" onClick={() => removeTag(tag)} aria-label={`Xoá ${tag}`}>
                        <i className="ti ti-x" aria-hidden="true" />
                    </button>
                </span>
            ))}
            <input
                className="tag-input__field"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => addTag(input)}
                placeholder={tags.length === 0 ? 'Nhập rồi Enter...' : ''}
            />
        </div>
    );
};

// ─── ReadOnlyRow — trường chỉ xem, không sửa ─────────────────────────────────

const ReadOnlyRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="profile-form__readonly-row">
        <span className="profile-form__readonly-label">{label}</span>
        <span className="profile-form__readonly-value">{value || '—'}</span>
    </div>
);

// ─── Component chính ──────────────────────────────────────────────────────────

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
                                                             formData,
                                                             info,
                                                             isSaving,
                                                             saveError,
                                                             avatarPreview,
                                                             isUploadingAvatar,
                                                             onAvatarChange,
                                                             onFieldChange,
                                                             onSubmit,
                                                             onCancel,
                                                             onClearError,
                                                         }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onAvatarChange(file);
        e.target.value = '';
    };

    return (
        <div className="profile-form">

            {/* ── Header ── */}
            <div className="profile-form__header">
                <h3 className="profile-form__title">Chỉnh sửa hồ sơ</h3>
                <button type="button" className="profile-form__close" onClick={onCancel} aria-label="Huỷ">
                    <i className="ti ti-x" aria-hidden="true" />
                </button>
            </div>

            {/* ── Toast lỗi ── */}
            {saveError && <ErrorToast message={saveError} onClose={onClearError} />}

            {/* ── Avatar upload ── */}
            <div className="profile-form__avatar-row">
                <div className="profile-form__avatar-wrap">
                    {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="profile-form__avatar-img" />
                    ) : (
                        <div className="profile-form__avatar-placeholder" aria-hidden="true">
                            {info.avatarInitials}
                        </div>
                    )}
                    {isUploadingAvatar && (
                        <div className="profile-form__avatar-overlay">
                            <span className="notif-card__spinner" />
                        </div>
                    )}
                </div>
                <div>
                    <button
                        type="button"
                        className="profile-form__btn-avatar"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                    >
                        {isUploadingAvatar ? 'Đang tải...' : 'Đổi ảnh'}
                    </button>
                    <p className="profile-form__avatar-hint">JPG, PNG · Tối đa 5MB</p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp"
                       style={{ display: 'none' }} onChange={handleFileChange} aria-hidden="true" />
            </div>

            {/* ══════════════════════════════════════════════════
                THÔNG TIN CỐ ĐỊNH — BE không cho sửa
                Hiển thị để PT biết, không phải input
            ══════════════════════════════════════════════════ */}
            <p className="profile-form__section-label">Thông tin cơ bản (không thể thay đổi)</p>
            <div className="profile-form__readonly-card">
                <ReadOnlyRow label="Họ tên"     value={info.fullName} />
                <ReadOnlyRow label="Giới tính"  value={info.gender}   />
                <ReadOnlyRow label="Email"       value={info.email}    />
                <ReadOnlyRow label="SĐT"         value={info.phone}    />
            </div>

            {/* ══════════════════════════════════════════════════
                THÔNG TIN CÓ THỂ SỬA
                Khớp với BE: bio, specialty[], experience, isAvailable
            ══════════════════════════════════════════════════ */}
            <p className="profile-form__section-label">Thông tin chuyên môn</p>

            {/* Kinh nghiệm */}
            <div className="profile-form__field">
                <label className="profile-form__label" htmlFor="pf-experience">
                    Kinh nghiệm
                </label>
                <input
                    id="pf-experience"
                    className="profile-form__input"
                    type="text"
                    placeholder="VD: 5 năm"
                    value={formData.experience}
                    onChange={(e) => onFieldChange('experience', e.target.value)}
                />
            </div>

            {/* Chuyên ngành — TagInput vì specialty là string[] */}
            <div className="profile-form__field">
                <label className="profile-form__label">
                    Chuyên ngành
                    <span className="profile-form__hint">Enter hoặc dấu phẩy để thêm tag</span>
                </label>
                <TagInput
                    tags={formData.specialty}
                    onChange={(tags) => onFieldChange('specialty', tags)}
                />
            </div>

            {/* Giới thiệu bản thân */}
            <div className="profile-form__field">
                <label className="profile-form__label" htmlFor="pf-bio">
                    Giới thiệu bản thân
                </label>
                <textarea
                    id="pf-bio"
                    className="profile-form__textarea"
                    rows={4}
                    placeholder="Mô tả kinh nghiệm, phong cách huấn luyện, thành tích nổi bật..."
                    value={formData.bio}
                    onChange={(e) => onFieldChange('bio', e.target.value)}
                />
            </div>

            {/* Toggle nhận học viên */}
            <div className="profile-form__toggle-row">
                <div>
                    <div className="profile-form__toggle-label">Đang nhận học viên</div>
                    <div className="profile-form__toggle-sub">
                        Tắt nếu không muốn hiển thị trên danh sách PT công khai
                    </div>
                </div>
                <button
                    type="button"
                    role="switch"
                    aria-checked={formData.isAvailable}
                    className={`toggle ${formData.isAvailable ? 'toggle--on' : ''}`}
                    onClick={() => onFieldChange('isAvailable', !formData.isAvailable)}
                >
                    <span className="toggle__thumb" />
                </button>
            </div>

            {/* Buttons */}
            <div className="profile-form__actions">
                <button type="button" className="profile-form__btn-cancel"
                        onClick={onCancel} disabled={isSaving}>
                    Huỷ
                </button>
                <button type="button" className="profile-form__btn-save"
                        onClick={onSubmit} disabled={isSaving || isUploadingAvatar}>
                    {isSaving ? (
                        <><span className="notif-card__spinner" aria-hidden="true" />Đang lưu...</>
                    ) : (
                        <><i className="ti ti-check" aria-hidden="true" />Lưu thay đổi</>
                    )}
                </button>
            </div>

        </div>
    );
};

export default ProfileEditForm;