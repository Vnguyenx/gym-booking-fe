import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { updateDailyConfig, updatePaymentConfig } from '../../../store/admin/adminSettingsSlice';

const SettingsCard: React.FC = () => {
    const dispatch = useAppDispatch();
    const { dailyConfig, paymentConfig, loading } = useAppSelector((state) => state.adminSettings);

    const [isEditingSecret, setIsEditingSecret] = useState(false);
    const [newSecretCode, setNewSecretCode] = useState(dailyConfig?.currentSecretCode || '');
    const [isEditingBank, setIsEditingBank] = useState(false);
    const [bankAccount, setBankAccount] = useState({
        bankId: paymentConfig?.bankId || '',
        accountNo: paymentConfig?.accountNo || '',
        accountName: paymentConfig?.accountName || '',
    });

    const handleSaveSecret = async () => {
        if (!dailyConfig) return;
        try {
            await dispatch(updateDailyConfig({ ...dailyConfig, currentSecretCode: newSecretCode, lastUpdated: new Date().toISOString() })).unwrap();
            alert('Cập nhật mã bí mật thành công');
            setIsEditingSecret(false);
        } catch { alert('Cập nhật thất bại'); }
    };

    const handleSaveBank = async () => {
        if (!paymentConfig) return;
        try {
            await dispatch(updatePaymentConfig({ ...paymentConfig, ...bankAccount })).unwrap();
            alert('Cập nhật thông tin ngân hàng thành công');
            setIsEditingBank(false);
        } catch { alert('Cập nhật thất bại'); }
    };

    if (loading.daily || loading.payment) {
        return (
            <div className="db-card">
                <div className="db-skeleton" style={{ height: '1.25rem', width: '60%', marginBottom: '1rem' }}></div>
                <div className="db-skeleton" style={{ height: '2.8rem', marginBottom: '1rem' }}></div>
                <div className="db-skeleton" style={{ height: '1.25rem', width: '40%', marginBottom: '0.5rem' }}></div>
                <div className="db-skeleton" style={{ height: '2.8rem' }}></div>
            </div>
        );
    }

    return (
        <div className="db-card">
            <h3 className="db-text-primary" style={{ fontWeight: 600, marginBottom: '1rem' }}>⚙️ Cài đặt hệ thống</h3>

            {/* Secret Code */}
            <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <p className="db-text-muted" style={{ fontSize: '0.875rem' }}>Mã Secret Code check-in:</p>
                    {!isEditingSecret && (
                        <button onClick={() => setIsEditingSecret(true)} className="db-link db-link-sm">Sửa</button>
                    )}
                </div>
                {isEditingSecret ? (
                    <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <input
                            type="text"
                            value={newSecretCode}
                            onChange={(e) => setNewSecretCode(e.target.value.toUpperCase())}
                            className="db-input"
                            maxLength={6}
                            style={{ textAlign: 'center', letterSpacing: '0.1em' }}
                        />
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={handleSaveSecret} className="db-btn-red" style={{ flex: 1 }}>Lưu</button>
                            <button onClick={() => { setIsEditingSecret(false); setNewSecretCode(dailyConfig?.currentSecretCode || ''); }} className="db-btn-gray" style={{ flex: 1 }}>Hủy</button>
                        </div>
                    </div>
                ) : (
                    <p className="db-secret-code" style={{ marginTop: '0.5rem' }}>
                        {dailyConfig?.currentSecretCode || 'Chưa cấu hình'}
                    </p>
                )}
            </div>

            {/* Bank Info */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <p className="db-text-muted" style={{ fontSize: '0.875rem' }}>Tài khoản ngân hàng:</p>
                    {!isEditingBank && (
                        <button onClick={() => setIsEditingBank(true)} className="db-link db-link-sm">Sửa</button>
                    )}
                </div>
                {isEditingBank ? (
                    <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <input type="text" placeholder="Ngân hàng" value={bankAccount.bankId} onChange={(e) => setBankAccount({ ...bankAccount, bankId: e.target.value })} className="db-input" />
                        <input type="text" placeholder="Số tài khoản" value={bankAccount.accountNo} onChange={(e) => setBankAccount({ ...bankAccount, accountNo: e.target.value })} className="db-input" />
                        <input type="text" placeholder="Chủ tài khoản" value={bankAccount.accountName} onChange={(e) => setBankAccount({ ...bankAccount, accountName: e.target.value })} className="db-input" />
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={handleSaveBank} className="db-btn-red" style={{ flex: 1 }}>Lưu</button>
                            <button onClick={() => { setIsEditingBank(false); setBankAccount({ bankId: paymentConfig?.bankId || '', accountNo: paymentConfig?.accountNo || '', accountName: paymentConfig?.accountName || '' }); }} className="db-btn-gray" style={{ flex: 1 }}>Hủy</button>
                        </div>
                    </div>
                ) : (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                        <p>{paymentConfig?.bankId || '—'}</p>
                        <p className="db-text-primary" style={{ fontFamily: 'monospace' }}>{paymentConfig?.accountNo || '—'}</p>
                        <p>{paymentConfig?.accountName || '—'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsCard;