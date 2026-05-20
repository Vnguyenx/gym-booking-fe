// src/pages/admin/AdminUsersPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
    fetchAdminUsers,
    fetchUserById,
    removeUser,
    setFilterRole,
    clearSelectedUser,
} from '../../store/admin/adminUserSlice';
import UserDetailModal from '../../components/admin/users/UserDetailModal';
import '../../styles/admin/AdminUsersPage.css';

const PAGE_SIZE = 5;

const AdminUsersPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const {
        users, loading, error, filterRole,
        selectedUser, detailLoading,
    } = useAppSelector((s) => s.adminUser);

    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // State tìm kiếm

    // Lấy dữ liệu mỗi khi filter Role thay đổi
    useEffect(() => {
        dispatch(fetchAdminUsers(filterRole));
    }, [dispatch, filterRole]);

    // Reset về trang 1 khi đổi bộ lọc hoặc gõ tìm kiếm
    useEffect(() => { setCurrentPage(1); }, [filterRole, searchQuery]);

    // Lọc danh sách user theo searchQuery (Tên, Email hoặc SĐT)
    const filteredUsers = users.filter(u => {
        const term = searchQuery.toLowerCase();
        return !term ||
            (u.displayName?.toLowerCase().includes(term)) ||
            (u.email?.toLowerCase().includes(term)) ||
            (u.phone?.toLowerCase().includes(term));
    });

    // Tính toán phân trang trên danh sách đã lọc
    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
    const startIdx   = (currentPage - 1) * PAGE_SIZE;
    const pageUsers  = filteredUsers.slice(startIdx, startIdx + PAGE_SIZE);

    const goTo = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setFilterRole(e.target.value as any));
    };

    const handleView = useCallback((uid: string) => {
        dispatch(fetchUserById(uid));
        setIsModalOpen(true);
    }, [dispatch]);

    const handleDelete = (uid: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            dispatch(removeUser(uid));
        }
    };

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        dispatch(clearSelectedUser());
    }, [dispatch]);

    return (
        <div className="au-page">
            <div className="au-header">
                <h1 className="au-title">Quản lý Học viên & Người dùng</h1>
            </div>

            <div className="au-filter-bar">
                {/* Thanh tìm kiếm Text */}
                <input
                    type="text"
                    className="au-search"
                    placeholder="Tìm theo họ tên, email, SĐT..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Bộ lọc Role */}
                <select className="au-select" value={filterRole} onChange={handleRoleChange}>
                    <option value="all">Tất cả vai trò</option>
                    <option value="customer">Học viên (Customer)</option>
                    <option value="pt">Huấn luyện viên (PT)</option>
                </select>
            </div>

            {loading && !users.length ? (
                <div className="au-loading">Đang tải dữ liệu...</div>
            ) : error ? (
                <div className="au-error">⚠ {error}</div>
            ) : (
                <>
                    {/* Mobile: card */}
                    <div className="au-mobile-only">
                        <div className="au-card-list">
                            {pageUsers.map(u => (
                                <div key={u.id} className="au-card">
                                    <div className="au-card-body">
                                        <div className="au-card-row">
                                            <span className="au-card-label">Họ tên</span>
                                            <span className="au-card-value font-semibold">{u.displayName || 'Chưa cập nhật'}</span>
                                        </div>
                                        <div className="au-card-row">
                                            <span className="au-card-label">Liên hệ</span>
                                            <span className="au-card-value" style={{ fontSize: '0.85rem' }}>
                                                {u.phone || u.email}
                                            </span>
                                        </div>
                                        <div className="au-card-row">
                                            <span className="au-card-label">Vai trò</span>
                                            <span className="au-card-value">
                                                <span className={`au-badge au-badge--${u.role}`}>{u.role}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="au-card-footer">
                                        <button className="au-btn-view" onClick={() => handleView(u.id!)}>Chi tiết</button>
                                        <button className="au-btn-delete" onClick={() => handleDelete(u.id!)}>Xoá</button>
                                    </div>
                                </div>
                            ))}
                            {pageUsers.length === 0 && (
                                <div style={{textAlign: 'center', padding: '20px', color: '#888'}}>Không tìm thấy kết quả nào.</div>
                            )}
                        </div>
                    </div>

                    {/* Desktop: table */}
                    <div className="au-desktop-only">
                        <div className="au-table-wrapper">
                            <table className="au-table">
                                <thead>
                                <tr>
                                    <th>Họ tên</th>
                                    <th>Email</th>
                                    <th>Số điện thoại</th>
                                    <th>Vai trò</th>
                                    <th>Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                {pageUsers.map(u => (
                                    <tr key={u.id}>
                                        <td className="font-semibold">{u.displayName || 'Chưa cập nhật'}</td>
                                        <td>{u.email}</td>
                                        <td>{u.phone || 'Chưa cập nhật'}</td>
                                        <td><span className={`au-badge au-badge--${u.role}`}>{u.role}</span></td>
                                        <td>
                                            <button className="au-btn-view mr-2" style={{marginRight: '8px'}} onClick={() => handleView(u.id!)}>Sửa</button>
                                            <button className="au-btn-delete" onClick={() => handleDelete(u.id!)}>Xoá</button>
                                        </td>
                                    </tr>
                                ))}
                                {pageUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={5} style={{textAlign: 'center', padding: '30px', color: '#888'}}>
                                            Không tìm thấy người dùng nào phù hợp.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {filteredUsers.length > 0 && (
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
                                {startIdx + 1}–{Math.min(startIdx + PAGE_SIZE, filteredUsers.length)} / {filteredUsers.length}
                            </span>
                        </div>
                    )}
                </>
            )}

            {isModalOpen && detailLoading && !selectedUser && (
                <div className="au-modal-overlay">
                    <div className="au-modal-box au-modal-box--loading">
                        <span className="au-spinner" />
                        <p>Đang tải thông tin...</p>
                    </div>
                </div>
            )}

            {isModalOpen && selectedUser && (
                <UserDetailModal
                    user={selectedUser}
                    currentFilter={filterRole}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default AdminUsersPage;