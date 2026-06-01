import React, { useRef } from 'react';
import useProfile from '../../hooks/useProfile';
import useAuth from '../../hooks/useAuth';
import useLogout from '../../hooks/useLogout';

const getInitial = (name?: string | null) =>
    name?.trim().charAt(0).toUpperCase() ?? '?';

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * ProfileInfo
 * Tab "Cá nhân": thông tin + đổi avatar + đăng xuất.
 *
 * Nút Đăng xuất đặt tại đây (không phải page level)
 * để các tab khác không bị nhiễu.
 */
const ProfileInfo: React.FC = () => {
    const { user } = useAuth();
    const { isLoggingOut, handleLogout } = useLogout();
    const {
        formData,
        isEditing,
        isSaving,
        successMessage,
        errorMessage,
        handleEdit,
        handleCancel,
        handleChange,
        handleSave,
        avatarUrl,
        isUploadingAvatar,
        handleAvatarChange,
    } = useProfile();

    const fileRef = useRef<HTMLInputElement>(null);

    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file ảnh (JPG, PNG, WEBP).');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.');
            return;
        }

        try {
            await handleAvatarChange(file);
        } catch (err: any) {
            alert('Không thể tải ảnh: ' + (err.message ?? 'Lỗi không xác định'));
        }
    };

    return (
        <section className="profile-section">
            <div className="section-header">
                <h2 className="section-title">Thông tin cá nhân</h2>
                {!isEditing && (
                    <button className="btn-outline" onClick={handleEdit}>
                        Chỉnh sửa
                    </button>
                )}
            </div>

            {successMessage && <p className="alert alert--success">{successMessage}</p>}
            {errorMessage   && <p className="alert alert--error">{errorMessage}</p>}

            {/* Avatar */}
            <div className="avatar-upload-wrapper">
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileInput}
                />
                <div
                    className="avatar-upload-circle"
                    onClick={() => fileRef.current?.click()}
                    role="button"
                    aria-label="Đổi ảnh đại diện"
                >
                    {avatarUrl
                        ? <img src={avatarUrl} alt="Avatar" />
                        : <div className="avatar-initials">{getInitial(user?.displayName)}</div>
                    }
                    <div className="avatar-overlay">📷<br />Đổi ảnh</div>
                </div>
                {isUploadingAvatar && (
                    <p className="avatar-uploading-indicator">Đang tải ảnh lên...</p>
                )}
            </div>

            {/* Fields */}
            <div className="info-card">
                <div className="info-row">
                    <span className="info-label">Họ tên</span>
                    {isEditing ? (
                        <input
                            className="info-input"
                            type="text"
                            value={formData.displayName}
                            onChange={(e) => handleChange('displayName', e.target.value)}
                            placeholder="Nhập họ tên"
                        />
                    ) : (
                        <span className="info-value">{formData.displayName || '—'}</span>
                    )}
                </div>

                <div className="info-row">
                    <span className="info-label">Zalo</span>
                    {isEditing ? (
                        <input
                            className="info-input"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            placeholder="Nhập số điện thoại"
                        />
                    ) : (
                        <span className="info-value">{formData.phone || '—'}</span>
                    )}
                </div>

                <div className="info-row">
                    <span className="info-label">Email</span>
                    <span className="info-value info-value--muted">{formData.email || '—'}</span>
                </div>
            </div>

            {/* Action buttons khi edit */}
            {isEditing && (
                <div className="action-row">
                    <button className="btn-primary" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                    <button className="btn-ghost" onClick={handleCancel} disabled={isSaving}>
                        Huỷ
                    </button>
                </div>
            )}

            {/* Đăng xuất — chỉ hiện ở tab Cá nhân */}
            <div className="logout-wrapper">
                <button
                    className="btn-logout"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                >
                    {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
                </button>
            </div>
        </section>
    );
};

export default ProfileInfo;