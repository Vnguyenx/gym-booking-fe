// src/components/admin/PaymentConfigForm.tsx
import React, { useState, useEffect } from 'react';
import { PaymentConfig } from '../../../store/admin/adminSettingsSlice';

interface PaymentConfigFormProps {
    value: PaymentConfig | null;
    onChange: (newValue: PaymentConfig) => void;
}

const PaymentConfigForm: React.FC<PaymentConfigFormProps> = ({ value, onChange }) => {
    const [localBankId, setLocalBankId] = useState('');
    const [localAccountNo, setLocalAccountNo] = useState('');
    const [localAccountName, setLocalAccountName] = useState('');

    useEffect(() => {
        if (value) {
            setLocalBankId(value.bankId || '');
            setLocalAccountNo(value.accountNo || '');
            setLocalAccountName(value.accountName || '');
        }
    }, [value]);

    const handleBankBlur = () => {
        if (!value) return;
        if (localBankId !== value.bankId) {
            onChange({
                bankId: localBankId,
                accountNo: value.accountNo,
                accountName: value.accountName,
            });
        }
    };

    const handleAccountNoBlur = () => {
        if (!value) return;
        const numeric = localAccountNo.replace(/[^0-9]/g, '');
        if (numeric !== value.accountNo) {
            onChange({
                bankId: value.bankId,
                accountNo: numeric,
                accountName: value.accountName,
            });
        }
    };

    const handleAccountNameBlur = () => {
        if (!value) return;
        if (localAccountName !== value.accountName) {
            onChange({
                bankId: value.bankId,
                accountNo: value.accountNo,
                accountName: localAccountName,
            });
        }
    };

    return (
        <div className="payment-config-form">
            <div className="form-field">
                <label>Tên ngân hàng</label>
                <input
                    type="text"
                    value={localBankId}
                    onChange={(e) => setLocalBankId(e.target.value)}
                    onBlur={handleBankBlur}
                    placeholder="VD: BIDV"
                    className="config-input"
                />
            </div>
            <div className="form-field">
                <label>Số tài khoản</label>
                <input
                    type="text"
                    value={localAccountNo}
                    onChange={(e) => setLocalAccountNo(e.target.value.replace(/[^0-9]/g, ''))}
                    onBlur={handleAccountNoBlur}
                    placeholder="Chỉ nhập số"
                    className="config-input"
                />
                <small className="form-hint">Chỉ cho phép ký tự số</small>
            </div>
            <div className="form-field">
                <label>Tên chủ tài khoản</label>
                <input
                    type="text"
                    value={localAccountName}
                    onChange={(e) => setLocalAccountName(e.target.value)}
                    onBlur={handleAccountNameBlur}
                    placeholder="VD: NGUYEN HOANG ANH VU"
                    className="config-input"
                />
                <small className="form-hint">Tự động viết hoa không dấu khi lưu</small>
            </div>
        </div>
    );
};

export default PaymentConfigForm;