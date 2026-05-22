// src/components/admin/classes/ClassDetail.tsx
import React from 'react';
import { ClassItem } from '../../../types/models';

interface Props {
    selectedClass: ClassItem | null;
    onClose: () => void;
}

const ClassDetail: React.FC<Props> = ({ selectedClass, onClose }) => {
    if (!selectedClass) return null;

    // Helper để định dạng ngày tháng cho đẹp
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            {/* stopPropagation để click vào nội dung modal không bị đóng */}
            <div className="modal-content detail-modal" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>Chi tiết lớp học</h2>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '1.8rem', cursor: 'pointer', color: '#666' }}>&times;</button>
                </header>

                <div className="detail-grid" style={{
                    background: '#f8fafc',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '15px',
                    marginBottom: '25px'
                }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Học viên</label>
                        <strong>{selectedClass.customerName}</strong>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Loại dịch vụ</label>
                        <strong>{selectedClass.ptServiceName}</strong>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>HLV Phụ trách</label>
                        <strong>{selectedClass.ptName}</strong>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Tiến độ buổi tập</label>
                        <strong>{selectedClass.usedSessions} / {selectedClass.totalSessions} buổi</strong>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Ngày bắt đầu</label>
                        <span>{formatDate(selectedClass.startDate)}</span>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Ngày kết thúc</label>
                        <span>{formatDate(selectedClass.endDate)}</span>
                    </div>
                    <div style={{ gridColumn: 'span 2', borderTop: '1px solid #e2e8f0', paddingTop: '10px', marginTop: '5px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            Được tạo bởi: <strong>{selectedClass.creatorName}</strong>
                        </span>
                    </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Lịch sử điểm danh</h3>
                <div className="attendance-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {selectedClass.attendance && selectedClass.attendance.length > 0 ? (
                        selectedClass.attendance.map((att: any) => (
                            <div key={att.id} style={{
                                padding: '12px',
                                borderBottom: '1px solid #f1f5f9',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 500, color: "white" }}>{formatDate(att.date)}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{att.sessionType || 'Buổi tập cá nhân'}</div>
                                </div>
                                <div style={{
                                    fontSize: '0.85rem',
                                    padding: '4px 10px',
                                    borderRadius: '20px',
                                    background: att.isSuccess ? '#dcfce7' : '#fef9c3',
                                    color: att.isSuccess ? '#16a34a' : '#ca8a04'
                                }}>
                                    {att.isSuccess ? '● Đã hoàn thành' : '○ Chờ xác nhận'}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                            <p>Chưa có dữ liệu điểm danh cho lớp này.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassDetail;