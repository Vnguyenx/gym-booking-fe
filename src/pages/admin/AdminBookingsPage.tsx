// src/pages/admin/AdminBookingsPage.tsx

import React, { useState, useEffect } from 'react';
import useAdminBookings from '../../hooks/useAdminBookings';
import BookingFilterBar    from '../../components/admin/bookings/BookingFilterBar';
import BookingTable        from '../../components/admin/bookings/BookingTable';
import BookingCardList     from '../../components/admin/bookings/BookingCardList';
import BookingConfirmModal from '../../components/admin/bookings/BookingConfirmModal';
import BookingCreateModal  from '../../components/admin/bookings/BookingCreateModal';
import '../../styles/admin/AdminBookings.css';

const PAGE_SIZE = 5;

const AdminBookingsPage: React.FC = () => {
    const {
        filteredBookings,
        loading,
        error,
        filterStatus,
        updating,
        selectedBooking,
        selectedDetail,
        pendingAction,
        handleFilterChange,
        handleActionClick,
        handleCloseModal,
        handleConfirmAction,
        handleRefresh,
    } = useAdminBookings();

    const [currentPage,      setCurrentPage]      = useState(1);
    const [showCreateModal,  setShowCreateModal]   = useState(false);

    // Reset về trang 1 khi filter thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus]);

    const totalPages = Math.max(1, Math.ceil(filteredBookings.length / PAGE_SIZE));
    const startIdx   = (currentPage - 1) * PAGE_SIZE;
    const pageItems  = filteredBookings.slice(startIdx, startIdx + PAGE_SIZE);

    const goTo = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const hasData = !loading && filteredBookings.length > 0;

    return (
        <div className="ab-page">
            <div className="ab-page-header">
                <div className="ab-page-header-row">
                    <div>
                        <h1 className="ab-page-title">Quản lý đơn đăng ký</h1>
                        <p className="ab-page-subtitle">
                            Xem và xử lý các đơn đăng ký gói tập từ khách hàng
                        </p>
                    </div>
                    <button
                        className="ab-create-btn"
                        onClick={() => setShowCreateModal(true)}
                    >
                        ＋ Tạo đơn
                    </button>
                </div>
            </div>

            <BookingFilterBar
                current={filterStatus}
                onChange={handleFilterChange}
                onRefresh={handleRefresh}
                total={filteredBookings.length}
            />

            {loading && (
                <div className="ab-state-box">⏳ Đang tải dữ liệu...</div>
            )}

            {error && (
                <div className="ab-state-box ab-state-box--error">⚠️ {error}</div>
            )}

            {!loading && !error && filteredBookings.length === 0 && (
                <div className="ab-state-box">📭 Không có đơn nào</div>
            )}

            {hasData && (
                <>
                    {/* Mobile: card list */}
                    <div className="ab-mobile-only">
                        <BookingCardList
                            bookings={pageItems}
                            updating={updating}
                            onAction={handleActionClick}
                        />
                    </div>

                    {/* Desktop: table */}
                    <div className="ab-desktop-only">
                        <BookingTable
                            bookings={pageItems}
                            updating={updating}
                            onAction={handleActionClick}
                        />
                    </div>

                    {/* Pagination */}
                    <div className="ab-pagination">
                        <button
                            className="ab-page-btn"
                            onClick={() => goTo(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            ‹
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                className={`ab-page-btn${currentPage === page ? ' ab-page-btn--active' : ''}`}
                                onClick={() => goTo(page)}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            className="ab-page-btn"
                            onClick={() => goTo(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            ›
                        </button>

                        <span className="ab-page-info">
                            {startIdx + 1}–{Math.min(startIdx + PAGE_SIZE, filteredBookings.length)} / {filteredBookings.length}
                        </span>
                    </div>
                </>
            )}

            {/* Modal xác nhận duyệt / huỷ */}
            <BookingConfirmModal
                booking={selectedBooking}
                action={pendingAction}
                onConfirm={handleConfirmAction}
                onClose={handleCloseModal}
                isUpdating={!!updating}
                selectedDetail={selectedDetail}
            />

            {/* Modal tạo đơn mới */}
            <BookingCreateModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </div>
    );
};

export default AdminBookingsPage;