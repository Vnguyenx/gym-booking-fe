// src/components/admin/pts/PTApplications.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
    fetchPTApplications,
    reviewPTApplication,
    setPTAppFilter,
    type PTApplicationStatusFilter,
} from '../../../store/admin/adminUserSlice';
import type { PTApplication } from '../../../types/models';
import PTApplicationDetailModal from './PTApplicationDetailModal';
import '../../../styles/admin/AdminPtsPage.css';

const PAGE_SIZE = 2;

const STATUS_LABEL: Record<PTApplication['status'] | 'all', string> = {
    all:      'Tất cả',
    pending:  'Chờ duyệt',
    approved: 'Đã duyệt',
    rejected: 'Từ chối',
};

const PTApplications: React.FC = () => {
    const dispatch = useAppDispatch();
    const {
        ptApplications, ptAppLoading, ptAppError, ptAppFilter,
    } = useAppSelector((s) => s.adminUser);

    const [currentPage, setCurrentPage] = useState(1);
    const [previewApp, setPreviewApp] = useState<PTApplication | null>(null);

    // Fetch dữ liệu tương ứng khi filter thay đổi
    useEffect(() => {
        dispatch(fetchPTApplications(ptAppFilter));
    }, [dispatch, ptAppFilter]);

    // Reset về trang đầu tiên khi đổi tab bộ lọc
    useEffect(() => {
        setCurrentPage(1);
    }, [ptAppFilter]);

    // Tính toán dữ liệu phân trang
    const totalPages = Math.max(1, Math.ceil(ptApplications.length / PAGE_SIZE));
    const startIdx   = (currentPage - 1) * PAGE_SIZE;
    const pageApps   = ptApplications.slice(startIdx, startIdx + PAGE_SIZE);

    const goTo = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Xử lý gửi API xét duyệt đơn đăng ký (Approved / Rejected)
    const handleReview = useCallback(async (id: string, status: 'approved' | 'rejected') => {
        try {
            // Thực hiện dispatch action từ Redux slice và unwrap kết quả
            await dispatch(reviewPTApplication({ id, status })).unwrap();
            // Đóng modal chi tiết sau khi duyệt thành công
            setPreviewApp(null);
            // Tải lại danh sách đơn để cập nhật trạng thái mới nhất lên giao diện
            dispatch(fetchPTApplications(ptAppFilter));
        } catch (err) {
            console.error("Lỗi trong quá trình xét duyệt đơn:", err);
        }
    }, [dispatch, ptAppFilter]);

    return (
        <div className="ap-section">
            {/* Thanh Tab chuyển đổi các bộ lọc trạng thái đơn */}
            <div className="ap-tabs">
                {(Object.keys(STATUS_LABEL) as Array<PTApplicationStatusFilter>).map((status) => (
                    <button
                        key={status}
                        className={`ap-tab-btn ${ptAppFilter === status ? 'active' : ''}`}
                        onClick={() => dispatch(setPTAppFilter(status))}
                    >
                        {STATUS_LABEL[status]}
                    </button>
                ))}
            </div>

            {/* Trạng thái giao diện dựa trên dữ liệu Redux */}
            {ptAppLoading && ptApplications.length === 0 ? (
                <div className="au-modal-box au-modal-box--loading" style={{ background: 'transparent', boxShadow: 'none' }}>
                    <span className="au-spinner" />
                    <p>Đang tải danh sách đơn đăng ký làm PT...</p>
                </div>
            ) : ptAppError ? (
                <p className="au-modal-error" style={{ textAlign: 'center', padding: '20px' }}>⚠ Lỗi: {ptAppError}</p>
            ) : ptApplications.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#888', padding: '40px 0' }}>
                    Không tìm thấy đơn đăng ký nào phù hợp với bộ lọc hiện tại.
                </div>
            ) : (
                <>
                    {/* Render danh sách thẻ đơn ứng tuyển */}
                    <div className="pt-list-container">
                        {pageApps.map((app) => (
                            <div key={app.id} className="pt-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    {app.avatarUrl ? (
                                        <img src={app.avatarUrl} alt={app.fullName} className="pt-avatar-circle" />
                                    ) : (
                                        <div className="pt-avatar-circle" style={{ background: '#252525', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                                            👤
                                        </div>
                                    )}
                                    <div>
                                        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: '#fff' }}>{app.fullName}</h3>
                                        <p style={{ margin: '0 0 6px 0', fontSize: '0.85rem', color: '#888' }}>
                                            {app.email} {app.phone && `• ${app.phone}`}
                                        </p>
                                        <span className={`status-badge status-${app.status}`}>
                                            {STATUS_LABEL[app.status]}
                                        </span>
                                    </div>
                                </div>
                                <button className="au-btn au-btn--ghost" onClick={() => setPreviewApp(app)}>
                                    Xem chi tiết
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Thanh Phân Trang (Chỉ hiện khi tổng số trang > 1) */}
                    {totalPages > 1 && (
                        <div className="au-pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '24px' }}>
                            <button className="au-page-btn" onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1}>‹</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    className={`au-page-btn${currentPage === page ? ' au-page-btn--active' : ''}`}
                                    onClick={() => goTo(page)}
                                >{page}</button>
                            ))}
                            <button className="au-page-btn" onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages}>›</button>
                        </div>
                    )}
                </>
            )}

            {/* Gọi cấu trúc Modal mới được tách riêng để xử lý hiển thị chi tiết và tác vụ duyệt hồ sơ */}
            {previewApp && (
                <PTApplicationDetailModal
                    application={previewApp}
                    onClose={() => setPreviewApp(null)}
                    onReview={(status) => handleReview(previewApp.id!, status)}
                    loading={ptAppLoading}
                />
            )}
        </div>
    );
};

export default PTApplications;