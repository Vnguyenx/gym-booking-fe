// src/components/admin/classes/ClassEditModal.tsx
import React, { useState, useEffect } from 'react';
import { ClassItem, UpdateClassData } from '../../../types/models';

interface Props {
    isOpen: boolean;
    initialData: ClassItem | null;
    onClose: () => void;
    onSubmit: (data: UpdateClassData) => void;
}

const ClassEditModal: React.FC<Props> = ({ isOpen, initialData, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<UpdateClassData>({});

    useEffect(() => {
        if (initialData) {
            const formattedDate = initialData.endDate ? initialData.endDate.split('T')[0] : '';

            setFormData({
                status: initialData.status,
                ptName: initialData.ptName,
                totalSessions: initialData.totalSessions,
                usedSessions: initialData.usedSessions,
                endDate: formattedDate,
                classGroupId: initialData.classGroupId || '', // <--- Nạp dữ liệu cũ (nếu null thì để chuỗi rỗng)
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen || !initialData) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const dataToSubmit: UpdateClassData = {
            status: formData.status,
            ptName: formData.ptName,
            endDate: formData.endDate,
            totalSessions: Number(formData.totalSessions),
            usedSessions: Number(formData.usedSessions),
            classGroupId: formData.classGroupId // <--- Gửi kèm lên Backend
        };

        onSubmit(dataToSubmit);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Cập nhật lớp học</h3>
                <p style={{marginBottom: '15px', color: '#4b5563'}}>
                    Học viên: <strong>{initialData.customerName}</strong> <br/>
                    Dịch vụ: <strong>{initialData.typeName}</strong>
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Trạng thái</label>
                        <select className="form-input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                            <option value="active">Còn hoạt động</option>
                            <option value="expired">Đã kết thúc</option>
                        </select>
                    </div>

                    <div style={{display: 'flex', gap: '10px'}}>
                        <div className="form-group" style={{flex: 1}}>
                            <label>Tên Huấn luyện viên (PT)</label>
                            <input type="text" className="form-input" value={formData.ptName || ''} onChange={e => setFormData({...formData, ptName: e.target.value})} />
                        </div>
                        {/* THÊM Ô NHẬP ĐỔI NHÓM VÀO UI */}
                        <div className="form-group" style={{flex: 1}}>
                            <label>ID Nhóm học (Học nhóm)</label>
                            <input type="text" className="form-input" placeholder="Để trống nếu học 1:1" value={formData.classGroupId || ''} onChange={e => setFormData({...formData, classGroupId: e.target.value})} />
                        </div>
                    </div>

                    <div style={{display: 'flex', gap: '10px'}}>
                        <div className="form-group" style={{flex: 1}}>
                            <label>Tổng số buổi</label>
                            <input type="number" className="form-input" min="1" value={formData.totalSessions} onChange={e => setFormData({...formData, totalSessions: parseInt(e.target.value) || 0})} />
                        </div>
                        <div className="form-group" style={{flex: 1}}>
                            <label>Đã tập</label>
                            <input type="number" className="form-input" min="0" value={formData.usedSessions} onChange={e => setFormData({...formData, usedSessions: parseInt(e.target.value) || 0})} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Ngày kết thúc dự kiến</label>
                        <input type="date" className="form-input" value={formData.endDate || ''} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                    </div>

                    <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                        <button type="submit" style={{flex: 1, padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'}}>Lưu thay đổi</button>
                        <button type="button" onClick={onClose} style={{flex: 1, padding: '10px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer'}}>Hủy</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClassEditModal;