// src/components/admin/classes/ClassList.tsx
import React from 'react';
import {ClassItem} from '../../../types/models';

interface Props {
    onEdit?: (item: ClassItem) => void;
    data: ClassItem[],
    isLoading: boolean,
    onViewDetail: (id: string) => void,
}

const ClassList: React.FC<Props> = ({data, isLoading, onViewDetail, onEdit}) => {
    if (isLoading) return <div className="loading-state">Đang tải danh sách...</div>;
    if (data.length === 0) return <div className="empty-state">Không tìm thấy lớp học nào phù hợp.</div>;

    return (
        <div className="class-list-wrapper">
            {/* Header Desktop */}
            <div className="table-header desktop-only">
                <div>Học viên / Dịch vụ</div>
                <div>PT phụ trách</div>
                <div>Tiến độ</div>
                <div>Trạng thái</div>
                <div>Thao tác</div>
            </div>

            {data.map((item) => (
                <div key={item.id} className="class-card">
                    <div className="class-card-header">
                        <div>
                            {/* Hiển thị Tên học viên thay vì ID */}
                            <strong className="customer-name">{item.customerName}</strong>
                            <div className="type-badge">{item.ptServiceName || 'Dịch vụ mặc định'}</div>                        </div>
                        <span className={`badge badge-${item.status}`}>
                            {item.status === 'active' ? 'Còn hạn' : 'Hết hạn'}
                        </span>
                    </div>

                    <div className="class-info-row">
                        <span className="mobile-label">PT: </span>
                        <strong>{item.ptName}</strong>
                    </div>

                    <div className="class-info-row">
                        <span className="mobile-label">Tiến độ: </span>
                        <span>{item.usedSessions} / {item.totalSessions} buổi</span>
                        {/* Thanh progress bar nhỏ cho đẹp */}
                        <div className="progress-bar-mini">
                            <div
                                className="progress-fill"
                                style={{width: `${(item.usedSessions / item.totalSessions) * 100}%`}}
                            ></div>
                        </div>
                    </div>

                    <div className="desktop-only">
                        {/* Cột trống cho layout table */}
                    </div>

                    <div className="action-buttons" style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                        <button
                            className="btn-detail-outline"
                            style={{
                                flex: 1,
                                padding: '8px',
                                borderRadius: '6px',
                                border: '1px solid #3b82f6',
                                background: 'transparent',
                                color: '#3b82f6',
                                cursor: 'pointer'
                            }}
                            onClick={() => onViewDetail(item.id)}
                        >
                            Chi tiết
                        </button>

                        {/* Kiểm tra nếu có truyền onEdit thì mới hiển thị nút */}
                        {onEdit && (
                            <button
                                className="btn-edit-outline"
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    borderRadius: '6px',
                                    border: '1px solid #f59e0b',
                                    background: 'transparent',
                                    color: '#f59e0b',
                                    cursor: 'pointer'
                                }}
                                onClick={() => onEdit(item)}
                            >
                                Sửa
                            </button>
                        )}
                    </div>

                </div>
            ))}
        </div>
    );
};

export default ClassList;