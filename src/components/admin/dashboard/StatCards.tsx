import React from 'react';
import { useAppSelector } from '../../../store/hooks';

const StatCards: React.FC = () => {
    const { users } = useAppSelector((state) => state.adminUser);
    const { ptApplications } = useAppSelector((state) => state.adminPTApplication);
    const { monthData } = useAppSelector((state) => state.adminRevenue);

    const customerCount = users.filter((u) => u.role === 'customer').length;
    const ptCount = users.filter((u) => u.role === 'pt').length;
    const pendingApps = ptApplications.filter((app) => app.status === 'pending').length;
    const revenue = monthData?.totalRevenue || 0;
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    const stats = [
        { icon: '👥', label: 'Học viên', value: customerCount },
        { icon: '💪', label: 'PT', value: ptCount },
        { icon: '📝', label: 'Đơn đăng ký PT', value: pendingApps },
        { icon: '💰', label: 'Doanh thu tháng', value: formatCurrency(revenue) },
    ];

    return (
        <div className="db-grid-4">
            {stats.map((stat, idx) => (
                <div key={idx} className="db-stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                        <span className="db-text-red">•</span>
                    </div>
                    <p className="db-text-muted" style={{ fontSize: '0.875rem' }}>{stat.label}</p>
                    <p className="db-text-primary" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.25rem' }}>
                        {stat.value}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default StatCards;