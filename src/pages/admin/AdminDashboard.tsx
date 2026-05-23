import React from 'react';
import StatCards from '../../components/admin/dashboard/StatCards';
import RecentClasses from '../../components/admin/dashboard/RecentClasses';
import RecentBookings from '../../components/admin/dashboard/RecentBookings';
import ContentCards from '../../components/admin/dashboard/ContentCards';
import EquipmentTable from '../../components/admin/dashboard/EquipmentTable';
import RevenueChart from '../../components/admin/dashboard/RevenueChart';
import SettingsCard from '../../components/admin/dashboard/SettingsCard';
import useDashboardData from '../../hooks/useAdminDashboardData';
import '../../styles/admin/AdminDashboard.css';

const AdminDashboard: React.FC = () => {
    useDashboardData();

    return (
        <div className="db-page">
            {/* Thống kê */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 className="db-heading1">
                    <span>📊</span> Tổng quan
                </h1>
                <StatCards />
            </div>

            {/* Lớp học và booking */}
            <div className="db-grid-2-cols" style={{ marginBottom: '1.5rem' }}>
                <RecentClasses />
                <RecentBookings />
            </div>

            {/* Cấu hình nội dung */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 className="db-heading2">
                    <span>🏠</span> Cấu hình trang chủ & phòng tập
                </h2>
                <ContentCards />
            </div>

            {/* Thiết bị */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 className="db-heading2">
                    <span>🏋️</span> Quản lý thiết bị
                </h2>
                <EquipmentTable />
            </div>

            {/* Doanh thu và cài đặt */}
            <div className="db-grid-2-cols">
                <RevenueChart />
                <SettingsCard />
            </div>
        </div>
    );
};

export default AdminDashboard;