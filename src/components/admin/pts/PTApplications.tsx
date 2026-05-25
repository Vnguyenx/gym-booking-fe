// src/components/admin/pts/PTApplications.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
    fetchPTApplications,
    reviewPTApplication,
    setPTAppFilter,
    type PTApplicationStatusFilter,
} from '../../../store/admin/adminPTApplicationSlice';
import type { PTApplication } from '../../../types/models';
import PTApplicationDetailModal from './PTApplicationDetailModal';
import '../../../styles/admin/AdminPtsPage.css';

const PAGE_SIZE = 5;

const STATUS_LABEL: Record<PTApplication['status'] | 'all', string> = {
    all:      'Tất cả',
    pending:  'Chờ duyệt',
    approved: 'Đã duyệt',
    rejected: 'Từ chối',
};

/**
 * Chuyển specialty (string | string[]) thành chuỗi hiển thị ngắn gọn, tối đa 2 mục
 */
const formatSpecialty = (specialty: string | string[] | undefined): string => {
    if (!specialty) return '—';
    if (Array.isArray(specialty)) {
        return specialty.slice(0, 2).join(', ');
    }
    return specialty.split(',').map(s => s.trim()).slice(0, 2).join(', ');
};

const PTApplications: React.FC = () => {
    const dispatch = useAppDispatch();
    const {
        ptApplications, ptAppLoading, ptAppError, ptAppFilter,
    } = useAppSelector((s) => s.adminPTApplication);

    const [currentPage, setCurrentPage] = useState(1);
    const [previewApp, setPreviewApp] = useState<PTApplication | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(fetchPTApplications(ptAppFilter));
    }, [dispatch, ptAppFilter]);

    useEffect(() => {
        setCurrentPage(1);
    }, [ptAppFilter, searchQuery]);

    const filteredApps = ptApplications.filter(app =>
        !searchQuery ||
        app.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.phone?.includes(searchQuery)
    );

    const totalPages = Math.max(1, Math.ceil(filteredApps.length / PAGE_SIZE));
    const startIdx   = (currentPage - 1) * PAGE_SIZE;
    const pageApps   = filteredApps.slice(startIdx, startIdx + PAGE_SIZE);

    const goTo = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const handleReview = useCallback(async (id: string, status: 'approved' | 'rejected') => {
        try {
            await dispatch(reviewPTApplication({ id, status })).unwrap();
            setPreviewApp(null);
            dispatch(fetchPTApplications(ptAppFilter));
        } catch (err) {
            console.error("Lỗi xét duyệt đơn:", err);
        }
    }, [dispatch, ptAppFilter]);

    return (
        <div className="ap-section">
            {/* Tabs lọc trạng thái */}
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

            {/* Ô tìm kiếm */}
            <div className="au-filter-bar">
                <input
                    type="text"
                    className="au-search"
                    placeholder="Tìm theo tên, email, số điện thoại..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Trạng thái loading / error / empty */}
            {ptAppLoading && ptApplications.length === 0 ? (
                <div className="au-modal-box au-modal-box--loading" style={{ background: 'transparent', boxShadow: 'none' }}>
                    <span className="au-spinner" />
                    <p>Đang tải danh sách đơn đăng ký...</p>
                </div>
            ) : ptAppError ? (
                <p className="au-modal-error" style={{ textAlign: 'center', padding: '20px' }}>⚠ Lỗi: {ptAppError}</p>
            ) : filteredApps.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#888', padding: '40px 0' }}>
                    Không tìm thấy đơn đăng ký nào.
                </div>
            ) : (
                <>
                    {/* ========== MOBILE: CARD VIEW (giống PTList) ========== */}
                    <div className="au-mobile-only">
                        <div className="au-card-list">
                            {pageApps.map((app) => (
                                <div key={app.id} className="au-card">
                                    <div className="au-card-body">
                                        <div className="au-card-row">
                                            <span className="au-card-label">Họ tên</span>
                                            <span className="au-card-value font-semibold">{app.fullName}</span>
                                        </div>
                                        <div className="au-card-row">
                                            <span className="au-card-label">Email</span>
                                            <span className="au-card-value">{app.email}</span>
                                        </div>
                                        <div className="au-card-row">
                                            <span className="au-card-label">Số điện thoại</span>
                                            <span className="au-card-value">{app.phone || '—'}</span>
                                        </div>
                                        <div className="au-card-row">
                                            <span className="au-card-label">Trạng thái</span>
                                            <span className="au-card-value">
                                                <span className={`status-badge status-${app.status}`}>
                                                    {STATUS_LABEL[app.status]}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="au-card-footer">
                                        <button className="au-btn-view" onClick={() => setPreviewApp(app)}>
                                            Xem chi tiết
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ========== DESKTOP: TABLE VIEW ========== */}
                    <div className="au-desktop-only">
                        <div className="au-table-wrapper">
                            <table className="au-table">
                                <thead>
                                <tr>
                                    <th>Họ tên</th>
                                    <th>Email</th>
                                    <th>Số điện thoại</th>
                                    <th>Chuyên môn</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                {pageApps.map((app) => (
                                    <tr key={app.id}>
                                        <td className="font-semibold">{app.fullName}</td>
                                        <td>{app.email}</td>
                                        <td>{app.phone || '—'}</td>
                                        <td>{formatSpecialty(app.specialty)}</td>
                                        <td>
                                                <span className={`status-badge status-${app.status}`}>
                                                    {STATUS_LABEL[app.status]}
                                                </span>
                                        </td>
                                        <td>
                                            <button className="au-btn-view" onClick={() => setPreviewApp(app)}>
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Phân trang */}
                    {totalPages > 1 && (
                        <div className="au-pagination">
                            <button className="au-page-btn" onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1}>‹</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    className={`au-page-btn${currentPage === page ? ' au-page-btn--active' : ''}`}
                                    onClick={() => goTo(page)}
                                >
                                    {page}
                                </button>
                            ))}
                            <button className="au-page-btn" onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages}>›</button>
                            <span className="au-page-info">
                                {startIdx + 1}–{Math.min(startIdx + PAGE_SIZE, filteredApps.length)} / {filteredApps.length}
                            </span>
                        </div>
                    )}
                </>
            )}

            {/* Modal chi tiết */}
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