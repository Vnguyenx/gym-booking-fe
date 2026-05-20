// src/components/admin/pts/PTApplicationDetailModal.tsx
import React, { useEffect } from 'react';
import type { PTApplication } from '../../../types/models';
import '../../../styles/admin/AdminPtsPage.css';

interface Props {
    application: PTApplication;
    onClose: () => void;
    onReview: (status: 'approved' | 'rejected') => void;
    loading?: boolean;
}

const STATUS_LABEL: Record<PTApplication['status'], string> = {
    pending:  'Chờ duyệt',
    approved: 'Đã duyệt',
    rejected: 'Từ chối',
};

const PTApplicationDetailModal: React.FC<Props> = ({ application, onClose, onReview, loading }) => {

    // Tự động đóng khi nhấn phím Esc
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <div className="au-modal-overlay" onClick={onClose}>
            <div
                className="au-modal-box"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '650px', width: '100%', borderRadius: '16px' }}
            >
                {/* ─── Header Modal (Thông tin cơ bản + Avatar) ─── */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #2c2c2c', paddingBottom: '16px' }}>
                    {application.avatarUrl ? (
                        <img
                            src={application.avatarUrl}
                            alt={application.fullName}
                            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #e53e3e' }}
                        />
                    ) : (
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#252525', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '3px solid #e53e3e' }}>
                            👤
                        </div>
                    )}
                    <div>
                        <h2 className="au-modal-title" style={{ margin: '0 0 6px 0', fontSize: '1.4rem', color: '#fff', fontWeight: 700 }}>
                            {application.fullName}
                        </h2>
                        <span className={`status-badge status-${application.status}`}>
                            {STATUS_LABEL[application.status]}
                        </span>
                    </div>
                </div>

                {/* ─── Body Modal (Chi tiết hồ sơ ứng viên) ─── */}
                <div className="au-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                        <div className="ap-field" style={{ flex: 1 }}>
                            <label className="ap-label">Giới tính</label>
                            <input className="ap-input" type="text" readOnly value={application.gender || 'Chưa cập nhật'} tabIndex={-1} />
                        </div>
                        <div className="ap-field" style={{ flex: 1 }}>
                            <label className="ap-label">Số điện thoại</label>
                            <input className="ap-input" type="text" readOnly value={application.phone || 'Chưa cập nhật'} tabIndex={-1} />
                        </div>
                    </div>

                    <div className="ap-field">
                        <label className="ap-label">Địa chỉ Email</label>
                        <input className="ap-input" type="text" readOnly value={application.email} tabIndex={-1} />
                    </div>

                    <div className="ap-field">
                        <label className="ap-label">Lĩnh vực chuyên môn</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                            {application.specialty && application.specialty.length > 0 ? (
                                application.specialty.map((spec, index) => (
                                    <span
                                        key={index}
                                        style={{ background: '#b7791f', color: '#fff', padding: '5px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}
                                    >
                                        {spec}
                                    </span>
                                ))
                            ) : (
                                <span style={{ color: '#888', fontSize: '0.9rem' }}>Chưa thiết lập chuyên môn</span>
                            )}
                        </div>
                    </div>

                    <div className="ap-field">
                        <label className="ap-label">Kinh nghiệm làm việc</label>
                        <textarea
                            className="ap-textarea"
                            readOnly
                            value={application.experience || 'Không có thông tin dữ liệu.'}
                            rows={3}
                            tabIndex={-1}
                            style={{ resize: 'none', padding: '10px', lineHeight: '1.4' }}
                        />
                    </div>

                    <div className="ap-field">
                        <label className="ap-label">Tiểu sử / Giới thiệu bản thân</label>
                        <textarea
                            className="ap-textarea"
                            readOnly
                            value={application.bio || 'Không có thông tin giới thiệu.'}
                            rows={4}
                            tabIndex={-1}
                            style={{ resize: 'none', padding: '10px', lineHeight: '1.4' }}
                        />
                    </div>
                </div>

                {/* ─── Footer Modal (Các nút thao tác phê duyệt) ─── */}
                <div
                    className="au-modal-footer"
                    style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', borderTop: '1px solid #2c2c2c', paddingTop: '16px' }}
                >
                    <button className="au-btn au-btn--ghost" onClick={onClose} disabled={loading}>
                        Đóng
                    </button>

                    {application.status === 'pending' && (
                        <>
                            <button
                                className="au-btn au-btn--reject"
                                onClick={() => onReview('rejected')}
                                disabled={loading}
                                style={{ padding: '0 16px', height: '40px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                            >
                                ✕ Từ chối
                            </button>
                            <button
                                className="au-btn au-btn--approve"
                                onClick={() => onReview('approved')}
                                disabled={loading}
                                style={{ padding: '0 16px', height: '40px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                                {loading && <span className="au-btn-spinner" />}
                                ✓ Duyệt hồ sơ
                            </button>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PTApplicationDetailModal;