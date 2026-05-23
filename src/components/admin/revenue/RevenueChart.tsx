// src/components/admin/RevenueChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface RevenueChartProps {
    data: Array<{ name: string; revenue: number }>;
    color?: string;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, color = '#e53935' }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#1f1f1f', borderColor: '#333' }} labelStyle={{ color: '#fff' }} />
                <Bar dataKey="revenue" fill={color} radius={[8, 8, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default RevenueChart;