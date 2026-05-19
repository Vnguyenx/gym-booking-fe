// src/pages/admin/AdminUsersPage.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks'; // Giả định bạn có hook này
import { fetchAdminUsers, removeUser, setFilterRole } from '../../store/admin/adminUserSlice';
import './AdminUsersPage.css';

const AdminUsersPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { users, loading, error, filterRole } = useAppSelector((state) => state.adminUser);

    useEffect(() => {
        dispatch(fetchAdminUsers(filterRole));
    }, [dispatch, filterRole]);

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setFilterRole(e.target.value));
    };

    const handleDelete = (uid: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            dispatch(removeUser(uid));
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Quản lý người dùng</h1>
                <div className="filter-group">
                    <label>Lọc theo vai trò:</label>
                    <select value={filterRole} onChange={handleRoleChange}>
                        <option value="all">Tất cả</option>
                        <option value="customer">Khách hàng</option>
                        <option value="pt">HLV (PT)</option>
                    </select>
                </div>
            </div>

            {loading && <p>Đang tải dữ liệu...</p>}
            {error && <p className="error-msg">{error}</p>}

            <div className="table-responsive">
                <table className="admin-table">
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
                    {users.map((user) => (
                        <tr key={user.uid}>
                            <td>{user.displayName || 'N/A'}</td>
                            <td>{user.email}</td>
                            <td>{user.phone || 'N/A'}</td>
                            <td>
                                    <span className={`badge badge-${user.role}`}>
                                        {user.role}
                                    </span>
                            </td>
                            <td>
                                <button
                                    className="btn-delete"
                                    onClick={() => handleDelete(user.uid)}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsersPage;