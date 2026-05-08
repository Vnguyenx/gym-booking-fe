import React from 'react';
import useProfile from '../../hooks/useProfile';

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * ProfileInfo
 * Hiển thị thông tin cá nhân của customer, hỗ trợ chỉnh sửa inline.
 * Sử dụng hook useProfile để tách biệt logic khỏi UI.
 */
const ProfileInfo: React.FC = () => {
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
    } = useProfile();

    return (
        <section className="profile-section">
            <div className="section-header">
                <h2 className="section-title">Thông tin cá nhân</h2>
                {/* Chỉ hiện nút Chỉnh sửa khi không đang edit */}
                {!isEditing && (
                    <button className="btn-outline" onClick={handleEdit}>
                        Chỉnh sửa
                    </button>
                )}
            </div>

            {/* Thông báo thành công */}
            {successMessage && (
                <p className="alert alert--success">{successMessage}</p>
            )}

            {/* Thông báo lỗi */}
            {errorMessage && (
                <p className="alert alert--error">{errorMessage}</p>
            )}

            <div className="info-card">
                {/* Họ tên */}
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

                {/* Số điện thoại */}
                <div className="info-row">
                    <span className="info-label">Số Zalo</span>
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

                {/* Email - chỉ đọc, không cho sửa */}
                <div className="info-row">
                    <span className="info-label">Email</span>
                    <span className="info-value info-value--muted">{formData.email || '—'}</span>
                </div>
            </div>

            {/* Nút hành động khi đang edit */}
            {isEditing && (
                <div className="action-row">
                    <button
                        className="btn-primary"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                    <button
                        className="btn-ghost"
                        onClick={handleCancel}
                        disabled={isSaving}
                    >
                        Huỷ
                    </button>
                </div>
            )}
        </section>
    );
};

export default ProfileInfo;