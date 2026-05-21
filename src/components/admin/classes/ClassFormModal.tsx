// src/components/admin/classes/ClassFormModal.tsx
import React, {useEffect, useState} from 'react';
import { CreateClassRequest } from '../../../types/models';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateClassRequest) => void;
}

const ClassFormModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
    const initialForm: CreateClassRequest = {
        customerName: '',
        ptName: '',
        type: 'pt-1on1',
        classGroupId: '',
        totalSessions: 10,
        startDate: '',
        endDate: ''
    };
    const [formData, setFormData] = useState<CreateClassRequest>(initialForm);

    // Reset form mỗi khi đóng/mở modal
    useEffect(() => {
        if (!isOpen) setFormData(initialForm);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Kiểm tra logic nhỏ: ngày kết thúc không được trước ngày bắt đầu
        if (new Date(formData.endDate) < new Date(formData.startDate)) {
            alert("Ngày kết thúc không thể trước ngày bắt đầu!");
            return;
        }
        onSubmit(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Thêm lớp học mới</h3>
                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Tên khách hàng (Nhập đúng tên hiển thị)</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Ví dụ: Nguyễn Văn A"
                            required
                            onChange={e => setFormData({...formData, customerName: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Huấn luyện viên phụ trách</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Ví dụ: HLV Trần Văn B"
                            onChange={e => setFormData({...formData, ptName: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Loại dịch vụ</label>
                        <select
                            className="form-input"
                            value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value})}
                        >
                            <option value="pt-none">Không PT</option>
                            <option value="pt-1on1">PT Kèm 1:1</option>
                            <option value="pt-group">Lớp Nhóm PT</option>

                        </select>
                    </div>
                    <div className="form-group">
                        <label>Tên nhóm (nếu có)</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Ví dụ: group-sang-thu-4-6"
                            required
                            onChange={e => setFormData({...formData, classGroupId: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Số buổi tập</label>
                        <input type="number" className="form-input" defaultValue={10}
                               onChange={e => setFormData({...formData, totalSessions: parseInt(e.target.value)})}/>
                    </div>
                    <div className="form-group">
                        <label>Ngày bắt đầu</label>
                        <input type="date" className="form-input" required
                               onChange={e => setFormData({...formData, startDate: e.target.value})}/>
                    </div>
                    <div className="form-group">
                        <label>Ngày kết thúc</label>
                        <input type="date" className="form-input" required
                               onChange={e => setFormData({...formData, endDate: e.target.value})}/>
                    </div>

                    <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                        <button type="submit" style={{
                            flex: 1,
                            padding: '10px',
                            background: '#2563eb',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px'
                        }}>Lưu
                        </button>
                        <button type="button" onClick={onClose} style={{
                            flex: 1,
                            padding: '10px',
                            background: '#e5e7eb',
                            border: 'none',
                            borderRadius: '6px'
                        }}>Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClassFormModal;