// src/components/pt/profile/ProfileEditForm.tsx
//
// Thay đổi so với bản trước:
//   1. specialty: string[] → TagInput component thay vì input text
//   2. Thêm avatar upload với preview

import React, { useRef } from 'react';
import { PTProfileFormData } from '../../../types/models';
import ErrorToast            from '../notifications/ErrorToast';

interface ProfileEditFormProps {
    formData:          PTProfileFormData;
    isSaving:          boolean;
    saveError:         string | null;
    // Avatar
    avatarPreview:     string;
    avatarInitials:    string;
    isUploadingAvatar: boolean;
    onAvatarChange:    (file: File) => Promise<void>;
    // Form
    onFieldChange:     (field: keyof PTProfileFormData, value: string | boolean | string[]) => void;
    onSubmit:          () => void;
    onCancel:          () => void;
    onClearError:      () => void;
}

// ─── TagInput — nhập chuyên ngành từng tag ────────────────────────────────────
// Enter hoặc dấu phẩy → thêm tag | Bấm X → xoá tag

const TagInput: React.FC<{
    tags:     string[];
    onChange: (tags: string[]) => void;
}> = ({ tags, onChange }) => {
    const [input, setInput] = React.useState('');

    const addTag = (raw: string) => {
        const tag = raw.trim();
        if (tag && !tags.includes(tag)) {
            onChange([...tags, tag]);
        }
        setInput('');
    };

    const removeTag = (tag: string) => {
        onChange(tags.filter((t) => t !== tag));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(input);
        }
        // Backspace xoá tag cuối khi input rỗng
        if (e.key === 'Backspace' && !input && tags.length > 0) {
            onChange(tags.slice(0, -1));
        }
    };

    return (
        <div className="tag-input">
            {tags.map((tag) => (
                <span key={tag} className="tag-input__tag">
                    {tag}
                    <button
                        className="tag-input__remove"
                        onClick={() => removeTag(tag)}
                        aria-label={`Xoá ${tag}`}
                        type="button"
                    >
                        <i className="ti ti-x" aria-hidden="true" />
                    </button>
                </span>
            ))}
            <input
                className="tag-input__field"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => addTag(input)}  // blur cũng thêm tag
                placeholder={tags.length === 0 ? 'Nhập rồi Enter...' : ''}
                aria-label="Thêm chuyên ngành"
            />
        </div>
    );
};

// ─── Component chính ──────────────────────────────────────────────────────────

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
                                                             formData,
                                                             isSaving,
                                                             saveError,
                                                             avatarPreview,
                                                             avatarInitials,
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
        // Reset input để có thể chọn lại cùng file
        e.target.value = '';
    };

    return (
        <div className="profile-form">

            {/* ── Header ── */}
            <div className="profile-form__header">
                <h3 className="profile-form__title">Chỉnh sửa hồ sơ</h3>
                <button className="profile-form__close" onClick={onCancel} aria-label="Huỷ">
                    <i className="ti ti-x" aria-hidden="true" />
                </button>
            </div>

            {/* ── Toast lỗi ── */}
            {saveError && <ErrorToast message={saveError} onClose={onClearError} />}

            {/* ── Avatar upload ── */}
            <div className="profile-form__avatar-row">
                <div className="profile-form__avatar-wrap">
                    {/* Ảnh hoặc initials fallback */}
                    {avatarPreview ? (
                        <img
                            src={avatarPreview}
                            alt="Avatar"
                            className="profile-form__avatar-img"
                        />
                    ) : (
                        <div className="profile-form__avatar-placeholder" aria-hidden="true">
                            {avatarInitials}
                        </div>
                    )}

                    {/* Overlay loading khi đang upload */}
                    {isUploadingAvatar && (
                        <div className="profile-form__avatar-overlay" aria-label="Đang tải ảnh">
                            <span className="notif-card__spinner" />
                        </div>
                    )}
                </div>

                <div>
                    <button
                        className="profile-form__btn-avatar"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                        type="button"
                    >
                        {isUploadingAvatar ? 'Đang tải...' : 'Đổi ảnh'}
                    </button>
                    <p className="profile-form__avatar-hint">JPG, PNG · Tối đa 5MB</p>
                </div>

                {/* Input file ẩn */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    aria-hidden="true"
                />
            </div>

            {/* ── Kinh nghiệm ── */}
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

            {/* ── Chuyên ngành — TagInput ── */}
            <div className="profile-form__field">
                <label className="profile-form__label">
                    Chuyên ngành
                    <span className="profile-form__hint">Enter hoặc dấu phẩy để thêm</span>
                </label>
                <TagInput
                    tags={formData.specialty}
                    onChange={(tags) => onFieldChange('specialty', tags)}
                />
            </div>

            {/* ── Giới thiệu ── */}
            <div className="profile-form__field">
                <label className="profile-form__label" htmlFor="pf-bio">
                    Giới thiệu bản thân
                </label>
                <textarea
                    id="pf-bio"
                    className="profile-form__textarea"
                    rows={4}
                    placeholder="Mô tả kinh nghiệm, phong cách huấn luyện..."
                    value={formData.bio}
                    onChange={(e) => onFieldChange('bio', e.target.value)}
                />
            </div>

            {/* ── Toggle nhận học viên ── */}
            <div className="profile-form__toggle-row">
                <div>
                    <div className="profile-form__toggle-label">Đang nhận học viên</div>
                    <div className="profile-form__toggle-sub">
                        Tắt nếu không muốn hiển thị trên danh sách PT
                    </div>
                </div>
                <button
                    role="switch"
                    aria-checked={formData.isAvailable}
                    className={`toggle ${formData.isAvailable ? 'toggle--on' : ''}`}
                    onClick={() => onFieldChange('isAvailable', !formData.isAvailable)}
                    type="button"
                >
                    <span className="toggle__thumb" />
                </button>
            </div>

            {/* ── Buttons ── */}
            <div className="profile-form__actions">
                <button
                    className="profile-form__btn-cancel"
                    onClick={onCancel}
                    disabled={isSaving}
                    type="button"
                >
                    Huỷ
                </button>
                <button
                    className="profile-form__btn-save"
                    onClick={onSubmit}
                    disabled={isSaving || isUploadingAvatar}
                    type="button"
                >
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