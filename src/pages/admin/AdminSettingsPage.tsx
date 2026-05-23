// src/pages/admin/AdminSettingsPage.tsx
import React from 'react';
import AdminProfileCard from '../../components/admin/settings/AdminProfileCard';
import SettingsCard from '../../components/admin/settings/SettingsCard';
import DailyConfigForm from '../../components/admin/settings/DailyConfigForm';
import PaymentConfigForm from '../../components/admin/settings/PaymentConfigForm';
import { useGymSettingsForm } from '../../hooks/useAdminGymSettings';
import '../../styles/admin/AdminSettingsPage.css';

const AdminSettingsPage: React.FC = () => {
    const {
        dailyEditData,
        dailyLoading,
        dailyError,
        setDailyEditData,
        handleDailySave,
        resetDailyForm,
        isDailyDirty,

        paymentEditData,
        paymentLoading,
        paymentError,
        setPaymentEditData,
        handlePaymentSave,
        resetPaymentForm,
        isPaymentDirty,
    } = useGymSettingsForm();

    return (
        <div className="admin-settings">
            <div className="admin-settings__container">
                <h1 className="admin-settings__heading">Cài đặt hệ thống</h1>

                <AdminProfileCard />

                <SettingsCard
                    title="Cấu hình mã điểm danh"
                    loading={dailyLoading}
                    error={dailyError}
                    isDirty={isDailyDirty}
                    onSave={handleDailySave}
                    onCancel={resetDailyForm}
                >
                    {dailyEditData ? (
                        <DailyConfigForm value={dailyEditData} onChange={setDailyEditData} />
                    ) : (
                        <div className="admin-settings__placeholder">Đang tải cấu hình...</div>
                    )}
                </SettingsCard>

                <SettingsCard
                    title="Cấu hình thanh toán"
                    loading={paymentLoading}
                    error={paymentError}
                    isDirty={isPaymentDirty}
                    onSave={handlePaymentSave}
                    onCancel={resetPaymentForm}
                >
                    {paymentEditData ? (
                        <PaymentConfigForm value={paymentEditData} onChange={setPaymentEditData} />
                    ) : (
                        <div className="admin-settings__placeholder">Đang tải cấu hình...</div>
                    )}
                </SettingsCard>
            </div>
        </div>
    );
};

export default AdminSettingsPage;