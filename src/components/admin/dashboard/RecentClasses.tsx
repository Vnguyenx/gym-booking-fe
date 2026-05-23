import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const RecentClasses: React.FC = () => {
    const { classes, isLoading } = useAppSelector((state) => state.adminClass);
    const recentClasses = classes.slice(0, 3);

    const statusBadge = (status: string) => {
        switch (status) {
            case 'active': return <span className="db-badge-green">Đang tập</span>;
            case 'expired': return <span className="db-badge-gray">Hết hạn</span>;
            default: return <span className="db-badge-yellow">Chờ</span>;
        }
    };

    if (isLoading) {
        return (
            <div className="db-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h3 className="db-text-primary" style={{ fontWeight: 600 }}>Lớp học đang chạy</h3>
                    <Link to={ROUTES.ADMIN_CLASSES} className="db-link">Xem tất cả</Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ display: 'flex', gap: '0.75rem' }}>
                            <div className="db-skeleton" style={{ width: '3rem', height: '3rem', borderRadius: '0.5rem' }}></div>
                            <div style={{ flex: 1 }}>
                                <div className="db-skeleton" style={{ height: '1rem', width: '75%', marginBottom: '0.5rem' }}></div>
                                <div className="db-skeleton" style={{ height: '0.75rem', width: '50%' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="db-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 className="db-text-primary" style={{ fontWeight: 600 }}>Lớp học đang chạy</h3>
                <Link to={ROUTES.ADMIN_CLASSES} className="db-link">Xem tất cả</Link>
            </div>
            {recentClasses.length === 0 ? (
                <p className="db-text-dim" style={{ fontSize: '0.875rem' }}>Chưa có lớp học nào.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {recentClasses.map(cls => (
                        <div key={cls.id} style={{ borderBottom: '1px solid var(--db-border)', paddingBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div>
                                    <p className="db-text-primary" style={{ fontWeight: 500 }}>
                                        {cls.type === 'pt-1on1' ? 'PT 1-1' : cls.type === 'pt-group' ? 'PT nhóm' : 'Tự tập'}
                                    </p>
                                    <p className="db-text-muted" style={{ fontSize: '0.75rem', marginTop: '0.125rem' }}>
                                        Học viên: {cls.customerName || 'N/A'} · {cls.usedSessions}/{cls.totalSessions} buổi
                                    </p>
                                </div>
                                {statusBadge(cls.status)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentClasses;