// src/components/admin/users/UserDetailModal.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
    editUser,
    clearSelectedUser,
    type AdminUserRoleFilter,
} from '../../../store/admin/adminUserSlice';
import type { UserProfile } from '../../../types/models';
import { uploadImageToImgBB } from '../../../services/uploadService';
// Tùy theo cấu trúc dự án của bạn, đảm bảo import đúng file CSS
import '../../../styles/admin/AdminUsersPage.css';

interface Props {
    user: UserProfile;
    currentFilter: AdminUserRoleFilter;
    onClose: () => void;
}

type EditableFields = Pick<UserProfile, 'displayName' | 'phone' | 'role' | 'avatarUrl'>;

const UserDetailModal: React.FC<Props> = ({ user, currentFilter, onClose }) => {
    const dispatch = useAppDispatch();
    const { detailLoading, detailError } = useAppSelector((s) => s.adminUser);

    const [form, setForm] = useState<EditableFields>({
        displayName: user.displayName ?? '',
        phone:       user.phone       ?? '',
        role:        user.role        ?? 'customer',
        avatarUrl:   user.avatarUrl   ?? '',
    });
    const [isDirty, setIsDirty] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Sync khi user prop thay đổi
    useEffect(() => {
        setForm({
            displayName: user.displayName ?? '',
            phone:       user.phone       ?? '',
            role:        user.role        ?? 'customer',
            avatarUrl:   user.avatarUrl   ?? '',
        });
        setIsDirty(false);
    }, [user]);

    // Xử lý đóng modal bằng phím Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setIsDirty(true);
    };

    // Hàm xử lý upload ảnh
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const url = await uploadImageToImgBB(file);
            if (url) {
                setForm(prev => ({ ...prev, avatarUrl: url }));
                setIsDirty(true);
            } else {
                alert("Upload ảnh thất bại. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Đã xảy ra lỗi khi upload ảnh.");
        } finally {
            setIsUploading(false);
            // Reset input file để có thể chọn lại cùng 1 file nếu cần
            e.target.value = '';
        }
    };

    const handleClose = useCallback(() => {
        dispatch(clearSelectedUser());
        onClose();
    }, [dispatch, onClose]);

    const handleSave = () => {
        dispatch(editUser({ uid: user.id!, data: form, currentFilter }));
        setIsDirty(false);
    };

    return (
        <div className="au-modal-overlay" onMouseDown={handleClose}>
            <div className="au-modal-box" onMouseDown={e => e.stopPropagation()}>
                <h2 className="au-modal-title">Chỉnh sửa Người dùng</h2>

                <div className="au-modal-body">
                    <div className="au-field">
                        <label className="au-field-label" htmlFor="udm-displayName">Họ và tên</label>
                        <input
                            id="udm-displayName"
                            className="au-field-input"
                            type="text"
                            name="displayName"
                            value={form.displayName}
                            onChange={handleChange}
                            placeholder="Nhập họ tên..."
                        />
                    </div>

                    <div className="au-field">
                        <label className="au-field-label" htmlFor="udm-phone">Số điện thoại</label>
                        <input
                            id="udm-phone"
                            className="au-field-input"
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="09xx..."
                        />
                    </div>

                    <div className="au-field">
                        <label className="au-field-label" htmlFor="udm-role">Vai trò</label>
                        <select
                            id="udm-role"
                            className="au-field-input"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                        >
                            <option value="customer">Học viên (Customer)</option>
                            <option value="pt">Huấn luyện viên (PT)</option>
                            <option value="admin">Quản trị viên (Admin)</option>
                        </select>
                    </div>

                    <div className="au-field">
                        <label className="au-field-label" htmlFor="udm-avatarUrl">Ảnh đại diện (Avatar)</label>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <img
                                src={form.avatarUrl || 'https://via.placeholder.com/48'}
                                alt="Preview"
                                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #333' }}
                            />

                            <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
                                <input
                                    id="udm-avatarUrl"
                                    className="au-field-input"
                                    type="url"
                                    name="avatarUrl"
                                    value={form.avatarUrl}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    style={{ flex: 1 }}
                                />
                                <label className="au-btn au-btn--ghost" style={{ cursor: isUploading ? 'wait' : 'pointer', margin: 0, padding: '0 12px' }}>
                                    {isUploading ? <span className="au-btn-spinner" style={{ margin: 0 }} /> : '📁'}
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        disabled={isUploading}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {detailError && <p className="au-modal-error">⚠ {detailError}</p>}
                </div>

                {/* ── Footer ── */}
                <div className="au-modal-footer">
                    <button className="au-btn au-btn--ghost" onClick={handleClose}>
                        Đóng
                    </button>
                    <button
                        className="au-btn au-btn--primary"
                        onClick={handleSave}
                        disabled={detailLoading || isUploading || !isDirty}
                    >
                        {detailLoading ? <span className="au-btn-spinner" /> : null}
                        {detailLoading ? 'Đang lưu…' : 'Lưu thay đổi'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;