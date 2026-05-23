import React, { useMemo } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueChart: React.FC = () => {
    const { monthData, isLoading } = useAppSelector((state) => state.adminRevenue);

    const chartData = useMemo(() => {
        if (!monthData?.byDay) return [];
        return Object.entries(monthData.byDay).map(([day, revenue]) => ({ day: `Ngày ${day}`, revenue }));
    }, [monthData]);

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    if (isLoading) {
        return (
            <div className="db-card">
                <h3 className="db-text-primary" style={{ fontWeight: 600, marginBottom: '1rem' }}>💰 Doanh thu tháng hiện tại</h3>
                <div className="db-skeleton" style={{ height: '16rem', borderRadius: '0.5rem' }}></div>
            </div>
        );
    }

    if (!monthData || chartData.length === 0) {
        return (
            <div className="db-card">
                <h3 className="db-text-primary" style={{ fontWeight: 600, marginBottom: '1rem' }}>💰 Doanh thu tháng hiện tại</h3>
                <div style={{ height: '16rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--db-surface-2)', borderRadius: '0.5rem' }}>
                    <p className="db-text-dim">Chưa có dữ liệu doanh thu</p>
                </div>
            </div>
        );
    }

    return (
        <div className="db-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className="db-text-primary" style={{ fontWeight: 600 }}>💰 Doanh thu tháng {monthData.month}/{monthData.year}</h3>
                <p className="db-text-muted" style={{ fontSize: '0.875rem' }}>Tổng: {formatCurrency(monthData.totalRevenue)}</p>
            </div>
            <div style={{ height: '16rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
                        <XAxis dataKey="day" tick={{ fill: '#777', fontSize: 10 }} interval="preserveStartEnd" />
                        <YAxis tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} tick={{ fill: '#777', fontSize: 10 }} />
                        <Tooltip
                            formatter={(value) => formatCurrency(value as number)}
                            contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#e0e0e0' }}
                        />
                        <Line type="monotone" dataKey="revenue" stroke="#ff3b30" strokeWidth={2} dot={{ r: 3, fill: '#ff3b30' }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueChart;