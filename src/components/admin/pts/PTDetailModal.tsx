// src/components/admin/users/PTDetailModal.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {editPT, clearSelectedPT} from '../../../store/admin/adminPTSlice';
import type { PT } from '../../../types/models';
import { uploadImageToImgBB } from '../../../services/uploadService';
import '../../../styles/admin/AdminPtsPage.css';

interface Props {
    pt: PT;
    onClose: () => void;
}

type EditableFields = Partial<Omit<PT, 'id' | 'updateAt'>>;

const PTDetailModal: React.FC<Props> = ({ pt, onClose }) => {
    const dispatch = useAppDispatch();
    const { ptDetailLoading, ptDetailError } = useAppSelector((s) => s.adminPT);

    const [form, setForm] = useState<EditableFields>({
        fullName:    pt.fullName    ?? '',
        gender:      pt.gender      ?? '',
        bio:         pt.bio         ?? '',
        experience:  pt.experience  ?? '',
        specialty:   pt.specialty   ?? [],
        isAvailable: pt.isAvailable ?? true,
        avatar:      pt.avatar      ?? '',
    });
    const [specialtyInput, setSpecialtyInput] = useState((pt.specialty ?? []).join(', '));
    const [isDirty, setIsDirty] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        setForm(prev => ({ ...prev, [target.name]: value }));
        setIsDirty(true);
    };

    const handleSpecialtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSpecialtyInput(e.target.value);
        const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
        setForm(prev => ({ ...prev, specialty: arr }));
        setIsDirty(true);
    };

    // Hàm xử lý upload ảnh cho PT
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const url = await uploadImageToImgBB(file);
            if (url) {
                setForm(prev => ({ ...prev, avatar: url }));
                setIsDirty(true);
            } else {
                alert("Upload ảnh thất bại. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Đã xảy ra lỗi khi upload ảnh.");
        } finally {
            setIsUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    const handleClose = useCallback(() => {
        dispatch(clearSelectedPT());
        onClose();
    }, [dispatch, onClose]);

    const handleSave = () => {
        dispatch(editPT({ ptId: pt.id!, data: form }));
        setIsDirty(false);
    };

    return (
        <div className="au-modal-overlay" onMouseDown={handleClose}>
            <div className="au-modal-box" onMouseDown={e => e.stopPropagation()}>
                <h2 className="au-modal-title">Chỉnh sửa Hồ sơ PT</h2>

                <div className="au-modal-body">
                    {/* Phần Upload Avatar (Đưa lên đầu cho đẹp) */}
                    <div className="au-field">
                        <label className="au-field-label">Ảnh đại diện (Avatar)</label>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <img
                                src={form.avatar || 'https://via.placeholder.com/80'}
                                alt="PT Avatar"
                                className="pt-avatar-circle"
                                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e53e3e' }}
                            />
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        className="au-field-input"
                                        type="text"
                                        name="avatar"
                                        value={form.avatar}
                                        onChange={handleChange}
                                        placeholder="Link URL ảnh..."
                                        style={{ flex: 1 }}
                                    />
                                    <label className="au-btn au-btn--ghost" style={{ cursor: isUploading ? 'wait' : 'pointer', margin: 0, padding: '0 12px', minWidth: '44px' }}>
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
                    </div>

                    <div className="au-field">
                        <label className="au-field-label">Họ và tên</label>
                        <input className="au-field-input" name="fullName" value={form.fullName} onChange={handleChange} />
                    </div>

                    <div className="au-field">
                        <label className="au-field-label">Giới tính</label>
                        <select className="au-field-input" name="gender" value={form.gender} onChange={handleChange}>
                            <option value="">Chọn giới tính</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                        </select>
                    </div>

                    <div className="au-field">
                        <label className="au-field-label">Tiểu sử</label>
                        <textarea className="au-field-textarea" name="bio" value={form.bio} onChange={handleChange} rows={3} />
                    </div>

                    <div className="au-field">
                        <label className="au-field-label">Kinh nghiệm</label>
                        <textarea className="au-field-textarea" name="experience" value={form.experience} onChange={handleChange} rows={3} />
                    </div>

                    <div className="au-field">
                        <label className="au-field-label">Chuyên môn (Cắt nhau bởi dấu phẩy)</label>
                        <input
                            className="au-field-input"
                            value={specialtyInput}
                            onChange={handleSpecialtyChange}
                            placeholder="Giảm cân, Tăng cơ..."
                        />
                    </div>

                    <div className="au-field">
                        <label className="au-toggle-label">
                            <input
                                type="checkbox"
                                name="isAvailable"
                                checked={form.isAvailable ?? true}
                                onChange={handleChange}
                                className="au-toggle-input"
                            />
                            <span className="au-toggle-track">
                                <span className="au-toggle-thumb" />
                            </span>
                            <span className="au-toggle-text">
                                {form.isAvailable ? 'Đang nhận học viên' : 'Tạm ngưng'}
                            </span>
                        </label>
                    </div>

                    {ptDetailError && <p className="au-modal-error">⚠ {ptDetailError}</p>}
                </div>

                {/* ── Footer ── */}
                <div className="au-modal-footer">
                    <button className="au-btn au-btn--ghost" onClick={handleClose}>Đóng</button>
                    <button
                        className="au-btn au-btn--primary"
                        onClick={handleSave}
                        disabled={ptDetailLoading || isUploading || !isDirty}
                    >
                        {ptDetailLoading ? <span className="au-btn-spinner" /> : null}
                        {ptDetailLoading ? 'Đang lưu…' : 'Lưu thay đổi'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PTDetailModal;