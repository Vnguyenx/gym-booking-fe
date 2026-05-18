// src/components/pt/profile/ProfileInfoView.tsx
//
// Sub-component: chế độ XEM thông tin hồ sơ PT (read-only).
// Hiển thị: avatar lớn + tên | thông tin cơ bản | chuyên môn | tags | bio
// Khi bấm "Chỉnh sửa" → component cha switch sang ProfileEditForm.

import React from 'react';
import { PtProfileInfo } from '../../../hooks/usePtProfile';

interface ProfileInfoViewProps {
    info:       PtProfileInfo;
    onEditOpen: () => void;
    onLogout:   () => void;
}

const ProfileInfoView: React.FC<ProfileInfoViewProps> = ({ info, onEditOpen, onLogout }) => {
    return (
        <div className="profile-view">

            {/* ── Avatar lớn + tên + status ── */}
            <div className="profile-view__top">
                <div className="profile-view__avatar" aria-hidden="true">
                    {info.avatarUrl ? (
                        <img
                            src={info.avatarUrl}
                            alt={info.fullName}
                            className="pt-hdr__avatar-img"
                            style={{ borderRadius: '100%' }}
                        />
                    ) : (
                        info.avatarInitials
                    )}
                </div>
                <div className="profile-view__hero">
                    <div className="profile-view__name">{info.fullName}</div>
                    <div className="profile-view__meta">
                        PT · {info.gender}
                        <span className={`badge ${info.isAvailable ? 'badge--ok' : 'badge--neu'}`}>
                            {info.isAvailable ? 'Đang nhận học viên' : 'Tạm dừng'}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Thông tin cơ bản ── */}
            <p className="pt-section-label">Thông tin cơ bản</p>
            <div className="info-card">
                <InfoRow label="Họ tên"    value={info.fullName} />
                <InfoRow label="Giới tính" value={info.gender}   />
                <InfoRow label="Email"     value={info.email}    highlight />
                <InfoRow label="SĐT"       value={info.phone}    />
            </div>

            {/* ── Chuyên môn ── */}
            <p className="pt-section-label">Chuyên môn</p>
            <div className="info-card">
                <InfoRow label="Kinh nghiệm" value={info.experience} />
                <div className="info-row">
                    <span className="info-row__label">Trạng thái</span>
                    <span className={`badge ${info.isAvailable ? 'badge--ok' : 'badge--neu'}`}>
                        {info.isAvailable ? 'Đang nhận học viên' : 'Tạm dừng'}
                    </span>
                </div>
            </div>

            {/* ── Tags chuyên ngành ── */}
            {info.specialties.length > 0 && (
                <>
                    <p className="pt-section-label">Chuyên ngành</p>
                    <div className="profile-view__tags">
                        {info.specialties.map((tag) => (
                            <span key={tag} className="profile-view__tag">{tag}</span>
                        ))}
                    </div>
                </>
            )}

            {/* ── Bio ── */}
            {info.bio && (
                <>
                    <p className="pt-section-label">Giới thiệu</p>
                    <div className="info-card">
                        <p className="profile-view__bio">{info.bio}</p>
                    </div>
                </>
            )}

            {/* ── Actions ── */}
            <button className="profile-view__btn-edit" onClick={onEditOpen}>
                <i className="ti ti-edit" aria-hidden="true" />
                Chỉnh sửa hồ sơ
            </button>
            <button className="profile-view__btn-logout" onClick={onLogout}>
                Đăng xuất
            </button>

        </div>
    );
};

// ── Helper component: 1 dòng label/value ──────────────────────────────────────

const InfoRow: React.FC<{ label: string; value: string; highlight?: boolean }> = ({
                                                                                      label, value, highlight,
                                                                                  }) => (
    <div className="info-row">
        <span className="info-row__label">{label}</span>
        <span className={`info-row__value ${highlight ? 'info-row__value--highlight' : ''}`}>
            {value}
        </span>
    </div>
);

export default ProfileInfoView;