// src/components/admin/pts/PTList.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
    fetchAdminPTs,
    fetchPTById,
    clearSelectedPT,
} from '../../../store/admin/adminUserSlice';
import PTDetailModal from './PTDetailModal';
import '../../../styles/admin/AdminPtsPage.css';

const PAGE_SIZE = 5;

const PTList: React.FC = () => {
    const dispatch = useAppDispatch();
    const {
        pts, ptsLoading, ptsError,
        selectedPT, ptDetailLoading,
    } = useAppSelector((s) => s.adminUser);

    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => { dispatch(fetchAdminPTs()); }, [dispatch]);

    const filtered = pts.filter(pt =>
        !searchQuery ||
        pt.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pt.specialty?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    useEffect(() => { setCurrentPage(1); }, [searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const startIdx   = (currentPage - 1) * PAGE_SIZE;
    const pagePTs    = filtered.slice(startIdx, startIdx + PAGE_SIZE);

    const goTo = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const handleView = useCallback((ptId: string) => {
        dispatch(fetchPTById(ptId));
        setIsModalOpen(true);
    }, [dispatch]);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        dispatch(clearSelectedPT());
    }, [dispatch]);

    return (
        <div>
            <div className="au-filter-bar">
                <input
                    type="text"
                    className="au-search"
                    placeholder="Tìm kiếm tên PT, chuyên môn..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {ptsLoading && !pts.length ? (
                <div className="au-loading">Đang tải danh sách PT...</div>
            ) : ptsError ? (
                <div className="au-error">⚠ {ptsError}</div>
            ) : (
                <>
                    {/* Mobile: card */}
                    <div className="au-mobile-only">
                        <div className="au-card-list">
                            {pagePTs.map(pt => (
                                <div key={pt.id} className="au-card">
                                    <div className="au-card-body">
                                        <div className="au-card-row">
                                            <span className="au-card-label">Họ tên</span>
                                            <span className="au-card-value font-semibold">{pt.fullName}</span>
                                        </div>
                                        <div className="au-card-row">
                                            <span className="au-card-label">Trạng thái</span>
                                            <span className="au-card-value">
                                                <span className={`au-badge au-badge--${pt.isAvailable ? 'approved' : 'rejected'}`}>
                                                    {pt.isAvailable ? 'Đang nhận HV' : 'Tạm ngưng'}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="au-card-footer">
                                        <button className="au-btn-view" onClick={() => handleView(pt.id!)}>Xem & Sửa</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Desktop: table */}
                    <div className="au-desktop-only">
                        <div className="au-table-wrapper">
                            <table className="au-table">
                                <thead>
                                <tr>
                                    <th>Họ tên</th>
                                    <th>Chuyên môn</th>
                                    <th>Kinh nghiệm</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                {pagePTs.map(pt => (
                                    <tr key={pt.id}>
                                        <td className="font-semibold">{pt.fullName}</td>
                                        <td>{pt.specialty?.join(', ') || 'N/A'}</td>
                                        <td>{pt.experience || 'N/A'}</td>
                                        <td>
                                                <span className={`au-badge au-badge--${pt.isAvailable ? 'approved' : 'rejected'}`}>
                                                    {pt.isAvailable ? 'Đang nhận HV' : 'Tạm ngưng'}
                                                </span>
                                        </td>
                                        <td>
                                            <button className="au-btn-view" onClick={() => handleView(pt.id!)}>Xem & Sửa</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="au-pagination">
                        <button className="au-page-btn" onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1}>‹</button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                className={`au-page-btn${currentPage === page ? ' au-page-btn--active' : ''}`}
                                onClick={() => goTo(page)}
                            >{page}</button>
                        ))}
                        <button className="au-page-btn" onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages}>›</button>
                        <span className="au-page-info">
                            {startIdx + 1}–{Math.min(startIdx + PAGE_SIZE, filtered.length)} / {filtered.length}
                        </span>
                    </div>
                </>
            )}

            {isModalOpen && ptDetailLoading && !selectedPT && (
                <div className="au-modal-overlay">
                    <div className="au-modal-box au-modal-box--loading">
                        <span className="au-spinner" />
                        <p>Đang tải hồ sơ HLV...</p>
                    </div>
                </div>
            )}

            {isModalOpen && selectedPT && (
                <PTDetailModal pt={selectedPT} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default PTList;