// src/components/admin/DailyConfigForm.tsx
import React, { useState, useEffect } from 'react';
import { DailyConfig } from '../../../store/admin/adminSettingsSlice';
interface DailyConfigFormProps {
    value: DailyConfig | null;
    onChange: (newValue: DailyConfig) => void;
}

const DailyConfigForm: React.FC<DailyConfigFormProps> = ({ value, onChange }) => {
    const [localCode, setLocalCode] = useState('');

    // Đồng bộ localCode khi value thay đổi từ bên ngoài
    useEffect(() => {
        if (value) {
            setLocalCode(value.currentSecretCode || '');
        }
    }, [value]);

    // Xử lý khi blur khỏi ô mã code
    const handleCodeBlur = () => {
        if (!value) return; // chưa có dữ liệu thì không xử lý

        let val = localCode.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (val.length !== 6) {
            alert('Mã điểm danh phải có đúng 6 ký tự chữ/số (A-Z, 0-9)');
            setLocalCode(value.currentSecretCode); // khôi phục giá trị cũ
            return;
        }

        // Chỉ gọi onChange nếu mã thay đổi
        if (val !== value.currentSecretCode) {
            onChange({
                currentSecretCode: val,
                lastUpdated: value.lastUpdated, // giữ nguyên lastUpdated hiện tại
            });
        }
    };

    // Xử lý khi chọn ngày giờ
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!value) return;

        const newDate = e.target.value;
        const isoString = newDate ? new Date(newDate).toISOString() : new Date().toISOString();

        onChange({
            currentSecretCode: value.currentSecretCode,
            lastUpdated: isoString,
        });
    };

    return (
        <div className="daily-config-form">
            <div className="form-field">
                <label>Mã điểm danh (6 ký tự chữ/số)</label>
                <input
                    type="text"
                    value={localCode}
                    onChange={(e) => setLocalCode(e.target.value.toUpperCase())}
                    onBlur={handleCodeBlur}
                    placeholder="VD: 7920XQ"
                    maxLength={6}
                    className="config-input"
                />
                <small className="form-hint">Tự động in hoa, tối đa 6 ký tự</small>
            </div>
            <div className="form-field">
                <label>Ngày cập nhật cuối</label>
                <input
                    type="datetime-local"
                    value={value?.lastUpdated ? value.lastUpdated.slice(0, 16) : ''}
                    onChange={handleDateChange}
                    className="config-input"
                />
                <small className="form-hint">Chọn thời điểm cập nhật gần nhất</small>
            </div>
        </div>
    );
};

export default DailyConfigForm;